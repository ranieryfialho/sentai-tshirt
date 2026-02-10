"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { MouseEvent } from "react";

export function QuickAddButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: MouseEvent) => {
    // A MÁGICA: Impede que o clique suba para o Link pai e mude de página
    e.preventDefault(); 
    e.stopPropagation();

    // Adiciona ao carrinho (Padrão Tamanho M para compra rápida da vitrine)
    // Em um cenário real, poderíamos abrir um modal de seleção rápida
    addItem(product, "M"); 
  };

  return (
    <Button
      size="icon"
      className="rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary shadow-lg backdrop-blur-sm transition-all duration-300"
      onClick={handleQuickAdd}
    >
      <ShoppingCart className="w-5 h-5" />
    </Button>
  );
}