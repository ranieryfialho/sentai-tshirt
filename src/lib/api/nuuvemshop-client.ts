import { Product } from "@/types";
import { MOCK_PRODUCTS } from "./mock-data";

interface NuvemshopProductRaw {
  id: number;
  name: { pt: string };
  variants: Array<{ price: string; promotional_price?: string; stock: number }>;
  images: Array<{ id: number; src: string }>;
  handle: { pt: string }; // slug
  description: { pt: string };
}

const USE_MOCK = process.env.USE_MOCK_DATA === "true";

function mapNuvemshopToProduct(item: NuvemshopProductRaw): Product {
  const mainVariant = item.variants[0] || {};
  
  return {
    id: item.id,
    name: item.name.pt,
    slug: item.handle.pt,
    description: item.description.pt || "",
    price: parseFloat(mainVariant.price || "0"),
    promotional_price: mainVariant.promotional_price ? parseFloat(mainVariant.promotional_price) : undefined,
    images: item.images.map(img => ({ id: img.id, src: img.src, alt: item.name.pt })),
    category: "Geral",
    specs: {}
  };
}

export const nuvemshopClient = {
  async getProducts(): Promise<Product[]> {
    if (USE_MOCK) {
      console.log("⚠️ [API] Usando MOCK DATA para getProducts");
      await new Promise(resolve => setTimeout(resolve, 800)); 
      return MOCK_PRODUCTS;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NUVEMSHOP_API_URL}/products`, {
        headers: {
          'Authentication': `bearer ${process.env.NUVEMSHOP_ACCESS_TOKEN}`,
          'User-Agent': process.env.NUVEMSHOP_USER_AGENT || 'SentaiTshirt App'
        },
        next: { revalidate: 3600 }
      });

      if (!response.ok) throw new Error(`Erro API: ${response.status}`);
      
      const data: NuvemshopProductRaw[] = await response.json();
      return data.map(mapNuvemshopToProduct);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return MOCK_PRODUCTS; 
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (USE_MOCK) {
      const product = MOCK_PRODUCTS.find(p => p.slug === slug);
      return product || null;
    }
    
    return null; 
  }
};