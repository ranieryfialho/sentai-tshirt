import { Product, Coupon } from "@/types";
import { getActivePromotions } from "@/lib/config/promotions";

const API_URL = process.env.NUVEMSHOP_API_URL;
const USER_ID = process.env.NUVEMSHOP_USER_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;

if (!API_URL || !USER_ID || !ACCESS_TOKEN) {
  console.warn("⚠️ ALERTA: Credenciais da Nuvemshop não configuradas no .env.local");
}

const headers = {
  "Authentication": `bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
  "User-Agent": "SentaiTshirt Headless (suporte@sentaitshirt.com)"
};

// ⭐ Verificar se cupom está ativo
function isCouponActive(coupon: any): boolean {
  if (!coupon.valid) return false;
  
  const now = new Date();
  
  if (coupon.start_date) {
    const start = new Date(coupon.start_date);
    if (now < start) return false;
  }
  
  if (coupon.end_date) {
    const end = new Date(coupon.end_date);
    if (now > end) return false;
  }
  
  return true;
}

export const nuvemshopClient = {
  /**
   * ⭐ Buscar cupons ativos da API da Nuvemshop
   */
  getCoupons: async (): Promise<Coupon[]> => {
    if (!ACCESS_TOKEN) return [];

    try {
      const res = await fetch(`${API_URL}/${USER_ID}/coupons`, {
        headers,
        next: { revalidate: 300 }
      });

      if (!res.ok) {
        console.error(`Erro ao buscar cupons: ${res.statusText}`);
        return [];
      }

      const data = await res.json();

      return data
        .filter(isCouponActive)
        .map((coupon: any) => ({
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          valid: coupon.valid,
          start_date: coupon.start_date,
          end_date: coupon.end_date,
          min_price: coupon.min_price,
          categories: coupon.categories,
          products: coupon.products
        }));

    } catch (error) {
      console.error("Falha ao buscar cupons:", error);
      return [];
    }
  },

  /**
   * ⭐ Buscar produtos com cupons e promoções aplicáveis
   */
  getProducts: async (): Promise<Product[]> => {
    if (!ACCESS_TOKEN) return [];

    try {
      const [productsRes, coupons, promotions] = await Promise.all([
        fetch(`${API_URL}/${USER_ID}/products?include_all=true&per_page=100`, {
          headers,
          next: { revalidate: 60 }
        }),
        nuvemshopClient.getCoupons(),
        Promise.resolve(getActivePromotions())
      ]);

      if (!productsRes.ok) {
        throw new Error(`Erro na API Nuvemshop: ${productsRes.statusText}`);
      }

      const data = await productsRes.json();

      return data.map((item: any) => {
        const productName = item.name.pt || item.name;
        const categoryIds = item.categories?.map((cat: any) => cat.id) || [];
        
        // Filtrar cupons aplicáveis ao produto
        const applicableCoupons = coupons.filter(coupon => {
          if (!coupon.categories && !coupon.products) return true;
          if (coupon.products && coupon.products.includes(item.id)) return true;
          if (coupon.categories && coupon.categories.some(id => categoryIds.includes(id))) return true;
          return false;
        });

        // Filtrar promoções aplicáveis
        const applicablePromotions = promotions.filter(promo => {
          if (promo.applies_to === 'all') {
            return promo.type === 'buy_x_get_y';
          }
          
          if (promo.applies_to === 'products' && promo.product_ids) {
            return promo.product_ids.includes(item.id);
          }
          
          if (promo.applies_to === 'categories' && promo.category_ids) {
            return promo.category_ids.some(promoCategory => 
              categoryIds.includes(promoCategory)
            );
          }
          
          return false;
        });

        return {
          id: item.id,
          name: productName,
          slug: item.handle.pt || item.handle,
          description: item.description.pt || item.description || "",
          price: parseFloat(item.variants[0].price),
          promotional_price: item.variants[0].promotional_price 
            ? parseFloat(item.variants[0].promotional_price) 
            : undefined,
          images: item.images.map((img: any) => ({
            id: img.id,
            product_id: item.id,
            src: img.src
          })),
          category: item.categories?.[0]?.name?.pt || item.categories?.[0]?.name || "Geral",
          categories: item.categories?.map((cat: any) => ({
            id: cat.id,
            name: cat.name?.pt || cat.name || "",
            description: cat.description?.pt || cat.description || "",
            parent: cat.parent || null
          })) || [],
          variants: item.variants.map((variant: any) => ({
            id: variant.id,
            price: parseFloat(variant.price),
            stock: variant.stock || 0,
            values: variant.values || []
          })),
          applicable_coupons: applicableCoupons,
          applicable_promotions: applicablePromotions
        };
      });

    } catch (error) {
      console.error("Falha ao buscar produtos:", error);
      return [];
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const products = await nuvemshopClient.getProducts();
    return products.find(p => p.slug === slug) || null;
  }
};