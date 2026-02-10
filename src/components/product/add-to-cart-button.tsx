"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

interface AddToCartProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string>("M"); // Padrão M

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    // Aqui futuramente colocaremos um Toast de sucesso
    console.log(`Adicionado: ${product.name} - Tamanho ${selectedSize}`);
  };

  return (
    <div className="space-y-4">
      {/* Seletor de Tamanho */}
      <div className="space-y-3">
        <span className="text-sm font-bold text-foreground">Tamanho</span>
        <div className="flex flex-wrap gap-3">
          {['P', 'M', 'G', 'GG', 'XG'].map((size) => (
            <button 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all font-medium
                ${selectedSize === size 
                  ? 'border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-110' 
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/30 hover:bg-white/10'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="pt-4">
        <Button 
          onClick={handleAddToCart}
          className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 group"
        >
          <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-bounce" />
          ADICIONAR AO CARRINHO
        </Button>
      </div>
    </div>
  );
}