import { NextResponse } from "next/server";

const STORE_ID = process.env.NUVEMSHOP_USER_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;
const API_URL = process.env.NUVEMSHOP_API_URL;

/**
 * ⭐ Criar cupom temporário com desconto fixo em reais
 */
async function createTempCoupon(discountAmount: number): Promise<string | null> {
  try {
    const couponCode = `PROMO${Date.now()}`;
    
    const couponPayload = {
      code: couponCode,
      type: "absolute", // Desconto FIXO em reais
      value: discountAmount.toString(),
      valid: true,
      max_uses: null, // Ilimitado (será deletado depois)
      includes_shipping: false,
      combines_with_other_discounts: true, // ⭐ IMPORTANTE
    };

    console.log("🎫 Criando cupom temporário:", couponPayload);

    const response = await fetch(`${API_URL}/${STORE_ID}/coupons`, {
      method: "POST",
      headers: {
        "Authentication": `bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Sentai Headless Store",
      },
      body: JSON.stringify(couponPayload),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Cupom criado com sucesso:", data);
      return data.code;
    } else {
      console.error("❌ Erro ao criar cupom:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Exceção ao criar cupom:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, discount, couponCode } = body; 

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    console.log("\n=== CRIANDO DRAFT ORDER ===");
    console.log("📦 Items recebidos:", items.length);

    // ⭐ CALCULAR TOTAL E DESCONTO
    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    
    // Calcular subtotal real (com desconto Dragon Ball já aplicado)
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.finalPrice * item.quantity);
    }, 0);
    
    console.log("💰 Subtotal calculado:", subtotal.toFixed(2));
    console.log("🛒 Total de itens:", totalItems);

    // ⭐ CALCULAR DESCONTO "PAGUE 4 LEVE 5"
    let buyXGetYDiscount = 0;
    
    if (totalItems >= 5) {
      const sortedItems = [...items].sort((a: any, b: any) => a.finalPrice - b.finalPrice);
      const cheapestItem = sortedItems[0];
      if (cheapestItem) {
        buyXGetYDiscount = cheapestItem.finalPrice;
      }
    }

    console.log("🎁 Desconto Pague 4 Leve 5:", buyXGetYDiscount.toFixed(2));

    // ⭐ PREPARAR PRODUTOS
    const products = items.map((item: any) => {
      let correctVariantId = item.id;

      if (item.variants && item.variants.length > 0) {
        correctVariantId = item.variants[0].id;

        if (item.selectedSize) {
          const matchedVariant = item.variants.find((v: any) => 
            v.values?.some((val: any) => val.pt === item.selectedSize)
          );
          if (matchedVariant) {
            correctVariantId = matchedVariant.id;
          }
        }
      }

      console.log(`   - ${item.name}: variant ${correctVariantId} x ${item.quantity}`);

      return {
        variant_id: correctVariantId,
        quantity: item.quantity || 1,
      };
    });

    // ⭐ DETERMINAR CUPOM A SER USADO
    let finalCouponCode = null;
    
    // Se tem desconto "Pague 4 Leve 5", criar cupom temporário
    if (buyXGetYDiscount > 0) {
      console.log("\n🎫 Criando cupom para Pague 4 Leve 5...");
      finalCouponCode = await createTempCoupon(buyXGetYDiscount);
      
      if (!finalCouponCode) {
        console.warn("⚠️ Falha ao criar cupom, continuando sem desconto adicional");
      }
    }
    
    // Se usuário aplicou cupom real (COMPRА10, etc), usar ele
    if (couponCode && !couponCode.startsWith('DRAFT')) {
      finalCouponCode = couponCode;
      console.log("🎫 Usando cupom do usuário:", couponCode);
    }

    // ⭐ CRIAR DRAFT ORDER
    const draftOrderPayload: any = {
      contact_email: "cliente@exemplo.com",
      contact_name: "Cliente",
      contact_lastname: "SentaiTshirt",
      products: products,
      send_confirmation_email: false,
      send_fulfillment_email: false,
    };

    if (finalCouponCode) {
      draftOrderPayload.coupon = finalCouponCode;
      console.log("✅ Cupom será aplicado:", finalCouponCode);
    }

    console.log("\n📤 Enviando payload para Nuvemshop...");

    const apiUrl = `https://api.nuvemshop.com.br/v1/${STORE_ID}/draft_orders`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authentication": `bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Sentai Headless Store (sentaitshirt@gmail.com)",
      },
      body: JSON.stringify(draftOrderPayload),
    });

    const data = await response.json();
    console.log("\n📥 Response status:", response.status);

    if (!response.ok) {
      console.error("❌ Erro da API:", JSON.stringify(data, null, 2));
      
      if (data.code === 422 || data.code === 400) {
        const errorMessage = data.message || data.description || "";
        const errorDetails = JSON.stringify(data);
        
        if (errorMessage.toLowerCase().includes("stock") || 
            errorMessage.toLowerCase().includes("estoque") ||
            errorDetails.toLowerCase().includes("stock")) {
          
          let productInfo = "";
          
          if (data.errors && Array.isArray(data.errors)) {
            productInfo = data.errors.map((err: any) => {
              const productName = err.product_name || err.product || "Produto";
              const availableStock = err.available_stock !== undefined ? err.available_stock : "indisponível";
              const requestedQty = err.requested_quantity || err.quantity;
              
              return `${productName}: solicitado ${requestedQty}, disponível ${availableStock}`;
            }).join("; ");
          }
          
          return NextResponse.json(
            { 
              error: "ESTOQUE_INSUFICIENTE",
              message: "Quantidade indisponível em estoque",
              details: productInfo || "Um ou mais produtos não têm estoque suficiente",
              rawError: data
            },
            { status: 422 }
          );
        }
      }

      return NextResponse.json(
        { 
          error: "ERRO_API_NUVEMSHOP",
          message: "Erro ao processar o pedido",
          details: data.message || data.description || "Erro desconhecido na API",
          rawError: data
        },
        { status: response.status }
      );
    }

    // ⭐ VERIFICAR SE CUPOM FOI APLICADO
    console.log("💰 Subtotal retornado:", data.subtotal);
    console.log("💰 Desconto cupom retornado:", data.discount_coupon);
    console.log("💰 Total retornado:", data.total);

    let checkoutUrl = data.checkout_url;

    if (!checkoutUrl) {
      throw new Error("Draft Order criado mas sem checkout_url");
    }

    checkoutUrl = checkoutUrl.replace('sentaitshirt.com.br', 'sentaitshirt.lojavirtualnuvem.com.br');

    const expectedTotal = subtotal - buyXGetYDiscount;
    console.log("\n✅ SUCCESS!");
    console.log("🔗 Checkout URL:", checkoutUrl);
    console.log("💰 Total esperado: R$", expectedTotal.toFixed(2));
    console.log("💰 Total da Nuvemshop: R$", data.total);
    
    if (Math.abs(parseFloat(data.total) - expectedTotal) > 0.5) {
      console.warn("⚠️ ATENÇÃO: Diferença entre total esperado e retornado!");
    }
    
    return NextResponse.json({ url: checkoutUrl });

  } catch (error: any) {
    console.error("\n❌ ERRO:", error.message);
    console.error("Stack trace:", error.stack);
    
    return NextResponse.json(
      { 
        error: "ERRO_INTERNO",
        message: "Falha ao processar checkout",
        details: error.message || "Erro interno do servidor"
      },
      { status: 500 }
    );
  }
}