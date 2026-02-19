"use server";

import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { Product } from "@/types";

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.length < 3) return [];

  try {
    const allProducts = await nuvemshopClient.getProducts();

    const term = query.toLowerCase();
    
    const filtered = allProducts.filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchCategoryString = p.category && p.category.toLowerCase().includes(term);
      const matchCategoriesArray = p.categories?.some((cat) => 
        cat.name.toLowerCase().includes(term)
      );

      return matchName || matchCategoryString || matchCategoriesArray;
    });

    return filtered.slice(0, 5);
  } catch (error) {
    console.error("Erro na busca instantânea:", error);
    return [];
  }
}