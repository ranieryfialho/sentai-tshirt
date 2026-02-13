"use client";

import { useFavoritesStore } from "@/lib/store/favorites-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Trash2, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";

export function FavoritesSheet() {
  const { 
    isOpen, 
    toggleSheet, 
    favorites, 
    removeFavorite, 
    clearFavorites 
  } = useFavoritesStore();

  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem(product, "M");       
    removeFavorite(product.id);  
    toggleSheet();               
    toggleCart();                
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleSheet}>
      <SheetContent 
        side="right"
        className="w-full sm:max-w-lg border-l border-white/10 bg-background p-0 shadow-2xl flex flex-col h-full"
      >
        
        {/* HEADER */}
        <SheetHeader className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-red-500/10 via-pink-500/10 to-red-500/10 backdrop-blur-md flex-shrink-0">
          <SheetTitle className="font-display text-2xl font-bold flex items-center gap-3 text-foreground">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-lg"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                <Heart className="w-6 h-6 fill-white text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl">Meus Favoritos</span>
              <span className="text-xs font-normal text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {favorites.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center border border-red-500/20">
                <Heart className="w-16 h-16 text-red-500/60" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Nenhum favorito ainda</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Comece a favoritar produtos clicando no ícone de coração nos cards que você gostar!
              </p>
            </div>
            {/* ⭐ BOTÃO CORRIGIDO: Agora vai para /loja */}
            <Link href="/loja" onClick={toggleSheet}>
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Explorar Produtos
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* LISTA DE FAVORITOS */}
            <ScrollArea className="flex-1 px-4">
              <div className="py-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {favorites.map((product, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                      transition={{ delay: index * 0.05 }}
                      key={product.id}
                      className="group relative rounded-2xl border border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-red-500/30 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-pink-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-pink-500/5 group-hover:to-red-500/5 transition-all duration-300"></div>
                      
                      <div className="relative flex gap-4 p-4">
                        {/* Imagem */}
                        <Link 
                          href={`/produto/${product.slug}`} 
                          onClick={toggleSheet} 
                          className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-muted flex-shrink-0 group-hover:border-red-500/30 transition-all"
                        >
                          <img
                            src={product.images[0]?.src}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {product.promotional_price && (
                            <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                              -{Math.round(((product.price - product.promotional_price) / product.price) * 100)}%
                            </div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link href={`/produto/${product.slug}`} onClick={toggleSheet}>
                              <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-red-500 transition-colors leading-tight">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                              {product.category}
                            </p>
                          </div>
                          
                          <div className="flex items-end justify-between mt-2">
                            <div className="flex flex-col">
                              {product.promotional_price && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                  R$ {product.price.toFixed(2)}
                                </span>
                              )}
                              <span className="text-xl font-bold text-foreground">
                                R$ {(product.promotional_price || product.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex flex-col gap-2 justify-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 transition-all hover:scale-110"
                            onClick={() => removeFavorite(product.id)}
                            title="Remover dos favoritos"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-all hover:scale-110"
                            onClick={() => handleAddToCart(product)}
                            title="Adicionar ao carrinho"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <div className="px-6 py-5 border-t border-white/10 bg-background/95 backdrop-blur-md flex-shrink-0">
              <div className="space-y-3">
                {favorites.length > 1 && (
                  <Button
                    variant="outline"
                    className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl h-11"
                    onClick={clearFavorites}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Todos os Favoritos
                  </Button>
                )}
                
                <Link href="/loja" onClick={toggleSheet} className="block">
                  <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white border-0 rounded-xl h-12 shadow-lg shadow-primary/20">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}