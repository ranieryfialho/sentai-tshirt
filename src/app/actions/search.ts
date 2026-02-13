"use server";

import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { Product } from "@/types";

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.length < 3) return [];

  try {
    const allProducts = await nuvemshopClient.getProducts();

    const term = query.toLowerCase();
    const filtered = allProducts.filter((p) => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term)
    );

    return filtered.slice(0, 5);
  } catch (error) {
    console.error("Erro na busca instantânea:", error);
    return [];
  }
}