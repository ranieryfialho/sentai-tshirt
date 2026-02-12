"use client";

import Link from "next/link";
import { Product } from "@/types";
import { QuickAddButton } from "@/components/product/quick-add-btn";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const firstImage = product.images[0]?.src;
  const secondImage = product.images[1]?.src;
  const hasSecondImage = !!secondImage;

  const discountPercentage = product.promotional_price 
    ? Math.round(((product.price - product.promotional_price) / product.price) * 100) 
    : 0;

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
          
          {product.promotional_price && (
            <span className="absolute top-3 right-3 z-30 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          )}

        </div>
        
        <div className="p-4 space-y-2">
          <p className="text-xs font-mono text-primary uppercase tracking-wider opacity-80">{product.category}</p>
          <h3 className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="pt-2 flex justify-between items-end border-t border-black/5 dark:border-white/10 mt-2">
            <div className="flex flex-col">
              {product.promotional_price && (
                <span className="text-xs text-muted-foreground line-through font-mono">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
              <span className="text-xl font-display font-bold text-foreground">
                R$ {product.promotional_price ? product.promotional_price.toFixed(2) : product.price.toFixed(2)}
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