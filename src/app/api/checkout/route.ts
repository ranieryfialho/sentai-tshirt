import { NextResponse } from "next/server";
import { getActivePromotions } from "@/lib/config/promotions";

const STORE_ID = process.env.NUVEMSHOP_USER_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    console.log("\n=== 🛒 INICIANDO CHECKOUT ===");
    console.log("📦 Items recebidos:", items.length);

    const totalItems = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.finalPrice * item.quantity);
    }, 0);

    console.log("💰 Subtotal:", subtotal.toFixed(2));
    console.log("🛒 Total de itens:", totalItems);

    // --- Monta os produtos ---
    const products = items.map((item: any) => {
      let correctVariantId = item.id;

      if (item.variants && item.variants.length > 0) {
        correctVariantId = item.variants[0].id;

        if (item.selectedSize) {
          const matchedVariant = item.variants.find((v: any) =>
            v.values?.some((val: any) => val.pt === item.selectedSize)
          );
          if (matchedVariant) correctVariantId = matchedVariant.id;
        }
      }

      console.log(`   - ${item.name}: variant ${correctVariantId} x ${item.quantity}`);

      return {
        variant_id: correctVariantId,
        quantity: item.quantity || 1,
      };
    });

    // ✅ Consulta getActivePromotions() — respeita enabled, start_date e end_date
    const activePromotions = getActivePromotions();
    const buyXGetYPromo = activePromotions.find(p => p.type === 'buy_x_get_y');

    let buyXGetYDiscount = 0;
    if (buyXGetYPromo) {
      const minQty = buyXGetYPromo.min_quantity ?? 5;
      if (totalItems >= minQty) {
        const sorted = [...items].sort((a: any, b: any) => a.finalPrice - b.finalPrice);
        buyXGetYDiscount = sorted[0]?.finalPrice ?? 0;
        console.log(`🎁 Pague 4 Leve 5 ativa: desconto de R$ ${buyXGetYDiscount.toFixed(2)}`);
      }
    } else {
      console.log("ℹ️ Promoção Pague 4 Leve 5 inativa — nenhum desconto aplicado.");
    }

    // --- Monta o payload do Draft Order ---
    const draftOrderPayload: any = {
      contact_email: "cliente@exemplo.com",
      contact_name: "Cliente",
      contact_lastname: "SentaiTshirt",
      products,
      send_confirmation_email: false,
      send_fulfillment_email: false,
    };

    if (buyXGetYDiscount > 0) {
      draftOrderPayload.discount = parseFloat(buyXGetYDiscount.toFixed(2));
      console.log(`✅ discount: R$ ${draftOrderPayload.discount} injetado no draft order`);
    }

    console.log("\n📤 Enviando payload:", JSON.stringify(draftOrderPayload, null, 2));

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

      const errorDetails = JSON.stringify(data);
      if (
        (data.message || "").toLowerCase().includes("stock") ||
        (data.message || "").toLowerCase().includes("estoque") ||
        errorDetails.toLowerCase().includes("stock")
      ) {
        let productInfo = "";
        if (data.errors && Array.isArray(data.errors)) {
          productInfo = data.errors
            .map((err: any) => {
              const name = err.product_name || err.product || "Produto";
              const available = err.available_stock ?? "indisponível";
              const requested = err.requested_quantity || err.quantity;
              return `${name}: solicitado ${requested}, disponível ${available}`;
            })
            .join("; ");
        }
        return NextResponse.json(
          {
            error: "ESTOQUE_INSUFICIENTE",
            message: "Quantidade indisponível em estoque",
            details: productInfo || "Um ou mais produtos não têm estoque suficiente",
            rawError: data,
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error: "ERRO_API_NUVEMSHOP",
          message: "Erro ao processar o pedido",
          details: data.message || data.description || "Erro desconhecido na API",
          rawError: data,
        },
        { status: response.status }
      );
    }

    console.log("💰 Subtotal retornado:", data.subtotal);
    console.log("💰 Desconto retornado:", data.discount);
    console.log("💰 Total retornado:", data.total);

    let checkoutUrl = data.checkout_url;

    if (!checkoutUrl) {
      throw new Error("Draft Order criado mas sem checkout_url");
    }

    checkoutUrl = checkoutUrl.replace(
      "sentaitshirt.com.br",
      "sentaitshirt.lojavirtualnuvem.com.br"
    );

    console.log("\n✅ SUCCESS!");
    console.log("🔗 Checkout URL:", checkoutUrl);
    console.log(`💰 Total esperado: R$ ${(subtotal - buyXGetYDiscount).toFixed(2)}`);
    console.log(`💰 Total Nuvemshop: R$ ${data.total}`);

    return NextResponse.json({ url: checkoutUrl });

  } catch (error: any) {
    console.error("\n❌ ERRO INTERNO:", error.message);
    console.error("Stack trace:", error.stack);

    return NextResponse.json(
      {
        error: "ERRO_INTERNO",
        message: "Falha ao processar checkout",
        details: error.message || "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}