"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShieldCheck, Clock, Tag, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { FavoriteButton } from "@/components/product/favorite-button";

interface ProductInfoProps {
  product: Product;
}

function sanitizeDescription(html: string): string {
  if (!html) return "";
  let clean = html;
  clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  clean = clean.replace(/\s+style="[^"]*"/gi, '');
  clean = clean.replace(/\s+style='[^']*'/gi, '');
  clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  clean = clean.replace(/\s+on\w+="[^"]*"/gi, '');
  clean = clean.replace(/\s+on\w+='[^']*'/gi, '');
  clean = clean.replace(/\s+class=""/gi, '');
  clean = clean.replace(/\s+class=''/gi, '');
  clean = clean.replace(/\s+id="[^"]*"/gi, '');
  clean = clean.replace(/\s+id='[^']*'/gi, '');
  clean = clean.replace(/>\s+</g, '><');
  clean = clean.replace(/\n\s*\n/g, '\n');
  return clean.trim();
}

export function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useCartStore((state) => state.addItem);
  
  // ⭐ PROTEÇÃO: Verificar se product existe
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando produto...</p>
      </div>
    );
  }
  
  // ⭐ PROTEÇÃO: Verificar se variants existe e tem itens
  const sizes = Array.from(new Set(
    (product.variants || []).flatMap(v => 
      (v.values || []).map(val => val.pt).filter((s): s is string => typeof s === "string" && s.length > 0)
    )
  )).sort();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const selectedVariant = (product.variants || []).find(v => 
    (v.values || []).some(val => val.pt === selectedSize)
  );

  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) {
      toast.error("Por favor, selecione um tamanho.");
      return;
    }

    const productToAdd = {
      ...product,
      id: selectedVariant.id,
      price: selectedVariant.price,
      promotional_price: undefined,
    };

    addItem(productToAdd, selectedSize);
    toast.success("Produto adicionado ao carrinho!");
  };

  // ⭐ Calcular preço considerando descontos
  const hasNuvemshopDiscount = !!(product.promotional_price && product.promotional_price < product.price);
  const percentagePromo = product.applicable_promotions?.find(p => p.type === 'percentage');
  const buyXGetYPromo = product.applicable_promotions?.find(p => p.type === 'buy_x_get_y');
  
  let finalPrice = product.price;
  let discountPercentage = 0;
  
  if (hasNuvemshopDiscount) {
    finalPrice = product.promotional_price!;
    discountPercentage = Math.round(((product.price - finalPrice) / product.price) * 100);
  } else if (percentagePromo && percentagePromo.value) {
    finalPrice = product.price * (1 - percentagePromo.value / 100);
    discountPercentage = percentagePromo.value;
  }
  
  const hasDiscount = finalPrice < product.price;
  
  const cleanDescription = useMemo(
    () => sanitizeDescription(product.description || ""),
    [product.description]
  );

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Badge variant="outline" className="mb-3 border-primary/30 text-primary bg-primary/5 px-3 py-1">
          {product.category}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm">
            Disponível (Produção sob encomenda)
          </span>
        </div>
      </div>

      <Separator className="bg-black/10 dark:bg-white/10" />

      {/* ⭐ Mostrar promoções/cupons ativos */}
      {(buyXGetYPromo || percentagePromo) && (
        <div className="space-y-2">
          {buyXGetYPromo && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <Tag className="w-4 h-4 text-purple-600" />
              <div className="flex-1">
                <span className="text-sm font-bold text-purple-600">{buyXGetYPromo.name}</span>
                <p className="text-xs text-purple-600/80 mt-0.5">
                  Válido até {new Date(buyXGetYPromo.end_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}

          {percentagePromo && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <Tag className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <span className="text-sm font-bold text-green-600">{percentagePromo.name}</span>
                <p className="text-xs text-green-600/80 mt-0.5">
                  {percentagePromo.value}% de desconto aplicado
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-1">
        {hasDiscount && (
          <p className="text-lg text-muted-foreground line-through font-mono">
            R$ {product.price.toFixed(2)}
          </p>
        )}
        <div className="flex items-end gap-2">
          <p className="text-5xl font-bold text-foreground tracking-tight">
            R$ {finalPrice.toFixed(2)}
          </p>
          {discountPercentage > 0 && (
            <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
              -{discountPercentage}%
            </span>
          )}
        </div>
        <p className="text-sm text-primary/80 font-medium">
          até 3x de R$ {(finalPrice / 3).toFixed(2)} sem juros
        </p>
      </div>

      {cleanDescription && (
        <div className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <div 
            className="product-description text-foreground leading-relaxed text-sm"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        </div>
      )}

      <Separator className="bg-black/10 dark:bg-white/10" />

      <div className="space-y-3">
        <label className="text-sm font-bold text-foreground/80">Tamanho:</label>
        <div className="flex flex-wrap gap-3">
          {sizes.length > 0 ? (
            sizes.map((size) => {
              const variantExists = (product.variants || []).some(v => 
                (v.values || []).some(val => val.pt === size)
              );
              return (
                <button
                  key={size}
                  disabled={!variantExists}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-12 w-12 rounded-xl border text-sm font-bold transition-all flex items-center justify-center relative",
                    selectedSize === size
                      ? "bg-primary text-white border-primary ring-4 ring-primary/20"
                      : variantExists
                        ? "border-black/10 dark:border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary bg-black/5 dark:bg-white/5"
                        : "border-black/5 dark:border-white/5 text-black/20 dark:text-white/10 cursor-not-allowed bg-black/5 dark:bg-black/20"
                  )}
                >
                  {size}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">Tamanho único.</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          size="lg" 
          className={cn(
            "flex-1 h-14 text-lg font-bold gap-3 rounded-xl transition-all duration-300",
            "hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:ring-2 hover:ring-primary/50",
            !selectedSize && "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-primary hover:shadow-none hover:ring-0"
          )}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          <ShoppingBag className="w-5 h-5" />
          Adicionar ao Carrinho
        </Button>

        <div className="h-14 w-14 flex-shrink-0">
          <FavoriteButton 
            product={product}
            className="w-full h-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-all data-[favorited=true]:bg-red-500/20 data-[favorited=true]:border-red-500"
            iconSize={24}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <Clock className="w-5 h-5 text-primary" />
          <div className="text-xs">
            <p className="font-bold text-foreground">Sob Encomenda</p>
            <p className="text-muted-foreground">Envio em até 5 dias úteis</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <div className="text-xs">
            <p className="font-bold text-foreground">Garantia Sentai</p>
            <p className="text-muted-foreground">30 dias para troca</p>
          </div>
        </div>
      </div>
    </div>
  );
}