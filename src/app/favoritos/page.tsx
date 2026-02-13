"use client";

import { useFavoritesStore } from "@/lib/store/favorites-store";
import { ProductCard } from "@/components/product/product-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function FavoritosPage() {
  const { favorites, clearFavorites } = useFavoritesStore();

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ⭐ ASIDE - LADO ESQUERDO */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              
              <BlurFade delay={0.1} inView>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                      <Heart className="w-5 h-5 fill-red-500" />
                    </div>
                    <h2 className="font-display font-bold text-xl">Favoritos</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Você tem <span className="font-bold text-red-500">{favorites.length}</span> {favorites.length === 1 ? 'item favoritado' : 'itens favoritados'}
                  </p>
                  
                  {favorites.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
                      onClick={clearFavorites}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar Favoritos
                    </Button>
                  )}
                </div>
              </BlurFade>

              <BlurFade delay={0.2} inView>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                  <h3 className="font-bold mb-2 text-foreground">💡 Dica</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione produtos aos favoritos para comprar depois!
                  </p>
                  <Link href="/loja">
                    <Button size="sm" className="w-full">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Ir para Loja
                    </Button>
                  </Link>
                </div>
              </BlurFade>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex-1">
            <BlurFade delay={0.1} inView>
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2">
                  Meus Favoritos ❤️
                </h1>
                <p className="text-muted-foreground">
                  Produtos que você salvou para comprar depois
                </p>
              </div>
            </BlurFade>

            {favorites.length === 0 ? (
              <BlurFade delay={0.2} inView>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                    <Heart className="w-12 h-12 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Nenhum favorito ainda</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Comece a favoritar produtos clicando no ícone de coração nos cards
                  </p>
                  <Link href="/loja">
                    <Button>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Explorar Produtos
                    </Button>
                  </Link>
                </div>
              </BlurFade>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((product, index) => (
                  <BlurFade key={product.id} delay={0.1 + index * 0.05} inView>
                    <ProductCard product={product} index={index} />
                  </BlurFade>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}