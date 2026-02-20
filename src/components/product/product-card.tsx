"use client";

import Link from "next/link";
import { Product } from "@/types";
import { QuickAddButton } from "@/components/product/quick-add-btn";
import { FavoriteButton } from "@/components/product/favorite-button";
import { Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const firstImage = product.images[0]?.src;
  const secondImage = product.images[1]?.src;
  const hasSecondImage = !!secondImage;

  // ⭐ Verificar promotional_price da Nuvemshop
  const hasNuvemshopDiscount = !!(product.promotional_price && product.promotional_price < product.price);
  
  // ⭐ Verificar promoções aplicáveis (configuradas manualmente)
  const percentagePromotion = product.applicable_promotions?.find(
    p => p.type === 'percentage'
  );
  
  const buyXGetYPromo = product.applicable_promotions?.find(
    p => p.type === 'buy_x_get_y'
  );
  
  // Calcular preço final e desconto
  let finalPrice = product.price;
  let discountPercentage = 0;
  let hasDiscount = false;
  
  // ⭐ Prioridade: promotional_price > promoção percentual
  if (hasNuvemshopDiscount) {
    finalPrice = product.promotional_price!;
    discountPercentage = Math.round(((product.price - finalPrice) / product.price) * 100);
    hasDiscount = true;
  } else if (percentagePromotion && percentagePromotion.value) {
    finalPrice = product.price * (1 - percentagePromotion.value / 100);
    discountPercentage = percentagePromotion.value;
    hasDiscount = true;
  }

  return (
    <Link href={`/produto/${product.slug}`} className="block h-full cursor-pointer group">
      <div 
        className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 h-full
          bg-white dark:bg-white/5 
          border border-black/5 dark:border-white/10
          shadow-md hover:shadow-xl dark:shadow-primary/5
          hover:border-primary/20"
      >
        <div className="aspect-[4/3] bg-muted/20 relative overflow-hidden">
          
          <img 
            src={firstImage} 
            alt={product.name}
            className={`object-cover w-full h-full transition-transform duration-700 ease-out
              ${hasSecondImage ? 'group-hover:scale-105' : 'group-hover:scale-110'}`} 
          />

          {hasSecondImage && (
            <img 
              src={secondImage}
              alt={`${product.name} - Vista Completa`}
              className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
          
          <div className="absolute top-3 left-3 z-30" onClick={(e) => e.preventDefault()}>
            <FavoriteButton product={product} />
          </div>

          {/* ⭐ BADGES DINÂMICOS */}
          <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
            {/* Badge de Desconto Percentual */}
            {hasDiscount && discountPercentage > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Tag className="w-3 h-3" />
                -{discountPercentage}%
              </span>
            )}
            
            {/* Badge de Promoção "Pague X Leve Y" */}
            {buyXGetYPromo && (
              <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg text-center">
                {buyXGetYPromo.name}
              </span>
            )}
          </div>

        </div>
        
        <div className="p-4 space-y-2">
          <p className="text-xs font-mono text-primary uppercase tracking-wider opacity-80">{product.category}</p>
          <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="pt-2 flex justify-between items-end border-t border-black/5 dark:border-white/10 mt-2">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through font-mono">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-display font-bold text-foreground">
                R$ {finalPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="relative z-30" onClick={(e) => e.preventDefault()}>
              <QuickAddButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}