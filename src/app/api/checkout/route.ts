import { NextResponse } from "next/server";
import { getActivePromotions } from "@/lib/config/promotions";

const STORE_ID = process.env.NUVEMSHOP_USER_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;

const API_HEADERS = {
  "Authentication": `bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
  "User-Agent": "Sentai Headless Store (sentaitshirt@gmail.com)",
};

// ─────────────────────────────────────────────────────────────
// Helpers de detecção de tipo de camiseta (mesmo critério do cart-store)
// ─────────────────────────────────────────────────────────────
function isOversized(name: string): boolean {
  return name.toLowerCase().includes("oversize");
}

function isTradicional(name: string): boolean {
  return name.toLowerCase().includes("tradicional");
}

// ─────────────────────────────────────────────────────────────
// Calcula o desconto de promoção buy_x_get_y com base nos itens
// Retorna o valor absoluto do desconto em R$
// ─────────────────────────────────────────────────────────────
function calculateBuyXGetYDiscount(items: any[], promo: any): number {
  const promoName = promo.name.toLowerCase();
  const isOversizedTradicionaPromo =
    promoName.includes("oversize") || promoName.includes("tradicional");

  if (isOversizedTradicionaPromo) {
    const oversizedItems = items.filter(i => isOversized(i.name));
    const traditionalItems = items.filter(i => isTradicional(i.name));

    const oversizedCount = oversizedItems.reduce((acc: number, i: any) => acc + i.quantity, 0);
    const minQtyRequired = promo.min_quantity || 2;
    const itemsToGiveFree = promo.discount_quantity || 1;
    const freeCount = Math.floor(oversizedCount / minQtyRequired) * itemsToGiveFree;

    if (freeCount > 0 && traditionalItems.length > 0) {
      const allTraditionalPrices: number[] = [];
      traditionalItems.forEach((item: any) => {
        for (let i = 0; i < item.quantity; i++) {
          allTraditionalPrices.push(item.finalPrice);
        }
      });
      allTraditionalPrices.sort((a, b) => a - b);

      let discount = 0;
      const maxFree = Math.min(freeCount, allTraditionalPrices.length);
      for (let i = 0; i < maxFree; i++) {
        discount += allTraditionalPrices[i];
      }
      return discount;
    }
    return 0;
  }

  // Lógica genérica: Pague X Leve Y
  const totalItems = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
  const minQty = promo.min_quantity ?? 5;
  if (totalItems >= minQty) {
    const sorted = [...items].sort((a: any, b: any) => a.finalPrice - b.finalPrice);
    return sorted[0]?.finalPrice ?? 0;
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────
// Cria um cupom temporário de uso único na Nuvemshop
// Retorna o código do cupom ou null se falhar
// ─────────────────────────────────────────────────────────────
async function createTemporaryCoupon(discountValue: number, label: string): Promise<string | null> {
  const code = `PROMO-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const payload = {
    code,
    type: "absolute",
    value: discountValue.toFixed(2),
    max_uses: 1,
    valid: true,
    combines_with_other_discounts: false,
  };

  console.log(`🎟️ Criando cupom temporário: ${code} = R$ ${discountValue.toFixed(2)} (${label})`);

  const res = await fetch(`https://api.nuvemshop.com.br/v1/${STORE_ID}/coupons`, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Falha ao criar cupom temporário (${res.status}):`, err);
    return null;
  }

  const data = await res.json();
  console.log(`✅ Cupom temporário criado: ${data.code} (id: ${data.id})`);
  return data.code;
}

// ─────────────────────────────────────────────────────────────
// Remove o cupom temporário após uso (fire-and-forget)
// ─────────────────────────────────────────────────────────────
async function deleteTemporaryCoupon(code: string): Promise<void> {
  // Primeiro busca o ID pelo código
  const listRes = await fetch(
    `https://api.nuvemshop.com.br/v1/${STORE_ID}/coupons?code=${encodeURIComponent(code)}`,
    { headers: API_HEADERS }
  );
  if (!listRes.ok) return;

  const coupons = await listRes.json();
  const coupon = Array.isArray(coupons) ? coupons.find((c: any) => c.code === code) : null;
  if (!coupon) return;

  await fetch(`https://api.nuvemshop.com.br/v1/${STORE_ID}/coupons/${coupon.id}`, {
    method: "DELETE",
    headers: API_HEADERS,
  });
  console.log(`🗑️ Cupom temporário ${code} removido.`);
}

// ─────────────────────────────────────────────────────────────
// POST /api/checkout
// ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  let temporaryCouponCode: string | null = null;

  try {
    const body = await request.json();
    const { items, couponCode: clientCouponCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    console.log("\n=== 🛒 INICIANDO CHECKOUT ===");
    console.log("📦 Items recebidos:", items.length);

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.finalPrice * item.quantity,
      0
    );
    console.log("💰 Subtotal:", subtotal.toFixed(2));

    // ── Monta os produtos ──────────────────────────────────────
    const products = items.map((item: any) => {
      let correctVariantId = item.id;

      if (item.variants?.length > 0) {
        correctVariantId = item.variants[0].id;
        if (item.selectedSize) {
          const matched = item.variants.find((v: any) =>
            v.values?.some((val: any) => val.pt === item.selectedSize)
          );
          if (matched) correctVariantId = matched.id;
        }
      }

      console.log(`   - ${item.name}: variant ${correctVariantId} x ${item.quantity}`);
      return { variant_id: correctVariantId, quantity: item.quantity || 1 };
    });

    // ── Verifica promoções ativas (tabela verdade) ─────────────
    const activePromotions = getActivePromotions();
    const buyXGetYPromo = activePromotions.find(p => p.type === "buy_x_get_y");

    const promoDiscount = buyXGetYPromo
      ? calculateBuyXGetYDiscount(items, buyXGetYPromo)
      : 0;

    console.log(
      promoDiscount > 0
        ? `🎁 Desconto de promoção calculado: R$ ${promoDiscount.toFixed(2)}`
        : "ℹ️ Nenhuma promoção buy_x_get_y aplicável."
    );

    // ── Cria cupom temporário se houver desconto de promoção ───
    if (promoDiscount > 0) {
      temporaryCouponCode = await createTemporaryCoupon(
        promoDiscount,
        buyXGetYPromo!.name
      );

      if (!temporaryCouponCode) {
        console.warn("⚠️ Não foi possível criar cupom temporário. Prosseguindo sem desconto de promoção.");
      }
    }

    // ── Monta payload do Draft Order ──────────────────────────
    const draftOrderPayload: any = {
      contact_email: "cliente@exemplo.com",
      contact_name: "Cliente",
      contact_lastname: "SentaiTshirt",
      products,
      send_confirmation_email: false,
      send_fulfillment_email: false,
    };

    // Injeta o cupom de promoção (temporário) se criado com sucesso
    // Obs: a Nuvemshop aceita apenas 1 cupom por pedido.
    // Se o cliente também tiver um cupom manual, o de promoção tem prioridade aqui.
    if (temporaryCouponCode) {
      draftOrderPayload.coupon = temporaryCouponCode;
      console.log(`✅ Cupom de promoção injetado no draft order: ${temporaryCouponCode}`);
    } else if (clientCouponCode) {
      draftOrderPayload.coupon = clientCouponCode;
      console.log(`✅ Cupom do cliente injetado no draft order: ${clientCouponCode}`);
    }

    console.log("\n📤 Enviando payload:", JSON.stringify(draftOrderPayload, null, 2));

    // ── Cria o Draft Order ────────────────────────────────────
    const response = await fetch(
      `https://api.nuvemshop.com.br/v1/${STORE_ID}/draft_orders`,
      {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify(draftOrderPayload),
      }
    );

    const data = await response.json();
    console.log("\n📥 Response status:", response.status);

    if (!response.ok) {
      console.error("❌ Erro da API:", JSON.stringify(data, null, 2));

      // Limpa o cupom temporário se o draft order falhou
      if (temporaryCouponCode) {
        deleteTemporaryCoupon(temporaryCouponCode).catch(() => {});
      }

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
    console.log(`💰 Total esperado: R$ ${(subtotal - promoDiscount).toFixed(2)}`);
    console.log(`💰 Total Nuvemshop: R$ ${data.total}`);

    return NextResponse.json({ url: checkoutUrl });

  } catch (error: any) {
    console.error("\n❌ ERRO INTERNO:", error.message);
    console.error("Stack trace:", error.stack);

    // Limpa o cupom temporário em caso de erro inesperado
    if (temporaryCouponCode) {
      deleteTemporaryCoupon(temporaryCouponCode).catch(() => {});
    }

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