import { NextResponse } from "next/server";

const STORE_ID = process.env.NUVEMSHOP_USER_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    console.log("=== CRIANDO DRAFT ORDER ===");

    const draftOrderPayload = {
      contact_email: "cliente@exemplo.com",
      contact_name: "Cliente",
      contact_lastname: "SentaiTshirt",
      products: items.map((item: any) => {
        // Encontra o variant_id baseado no tamanho (selectedSize) do zustand
        let correctVariantId = item.id; // Fallback inicial

        if (item.variants && item.variants.length > 0) {
          correctVariantId = item.variants[0].id; // Fallback para a primeira variante

          if (item.selectedSize) {
            const matchedVariant = item.variants.find((v: any) => 
              v.values?.some((val: any) => val.pt === item.selectedSize)
            );
            if (matchedVariant) {
              correctVariantId = matchedVariant.id;
            }
          }
        }

        return {
          variant_id: correctVariantId,
          quantity: item.quantity || 1,
        };
      }),
      send_confirmation_email: false,
      send_fulfillment_email: false,
    };

    console.log("Payload:", JSON.stringify(draftOrderPayload, null, 2));

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
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
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

    let checkoutUrl = data.checkout_url;

    if (!checkoutUrl) {
      throw new Error("Draft Order criado mas sem checkout_url");
    }

    checkoutUrl = checkoutUrl.replace('sentaitshirt.com.br', 'sentaitshirt.lojavirtualnuvem.com.br');
    checkoutUrl = checkoutUrl.replace('sentaitshirt.com.br', 'sentaitshirt.lojavirtualnuvem.com.br');

    console.log("✅ SUCCESS! Checkout URL:", checkoutUrl);
    
    return NextResponse.json({ url: checkoutUrl });

  } catch (error: any) {
    console.error("❌ ERRO:", error.message);
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