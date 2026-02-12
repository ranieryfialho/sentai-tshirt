import { Product } from "@/types";

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

export const nuvemshopClient = {
  getProducts: async (): Promise<Product[]> => {
    if (!ACCESS_TOKEN) return [];

    try {
      const res = await fetch(`${API_URL}/${USER_ID}/products?include_all=true&per_page=100`, {
        headers,
        next: { revalidate: 60 }
      });

      if (!res.ok) {
        throw new Error(`Erro na API Nuvemshop: ${res.statusText}`);
      }

      const data = await res.json();

      return data.map((item: any) => ({
        id: item.id,
        name: item.name.pt || item.name,
        slug: item.handle.pt || item.handle,
        description: item.description.pt || item.description || "",
        price: parseFloat(item.variants[0].price),
        promotional_price: item.variants[0].promotional_price ? parseFloat(item.variants[0].promotional_price) : undefined,
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
        }))
      }));

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