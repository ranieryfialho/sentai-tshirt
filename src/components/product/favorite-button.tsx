"use client";

import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { Product } from "@/types";
import { Heart } from "lucide-react";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  iconSize?: number;
}

export function FavoriteButton({ 
  product, 
  className, 
  iconSize = 20 
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isProductFavorite = isFavorite(product.id);

  const handleToggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "rounded-full transition-all duration-300 shadow-lg hover:scale-110",
        className ? className : (
          isProductFavorite
            ? "bg-red-500 text-white border-2 border-white hover:bg-red-600 h-10 w-10"
            : "bg-black/60 dark:bg-white/90 text-white dark:text-black border-2 border-white/20 hover:bg-black/80 dark:hover:bg-white backdrop-blur-md h-10 w-10"
        ),
        isProductFavorite && !className && "bg-red-500 text-white hover:bg-red-600"
      )}
      onClick={handleToggleFavorite}
    >
      <Heart
        className={cn(
          "transition-all",
          isProductFavorite && "fill-current"
        )}
        size={iconSize}
      />
    </Button>
  );
}