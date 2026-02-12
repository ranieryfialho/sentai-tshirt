import Link from "next/link";
import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ProductCard } from "@/components/product/product-card";
import { HeroCarousel } from "@/components/hero-carousel";
import { ShippingBanner } from "@/components/shipping-banner";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, Truck, CreditCard, Zap, Tag, Gamepad2, BookOpen, Tv 
} from "lucide-react";

const PromoBanner = ({ title, color }: { title: string, color: string }) => (
  <div className={`w-full h-[250px] md:h-[300px] rounded-3xl overflow-hidden relative group my-16 border border-white/10 ${color} shadow-2xl`}>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
      <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter drop-shadow-lg">
        {title}
      </h3>
      <Button variant="secondary" className="rounded-full font-bold px-8 shadow-lg hover:scale-105 transition-transform">
        Conferir Coleção
      </Button>
    </div>
    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
  </div>
);

export default async function Home() {
  const allProducts = await nuvemshopClient.getProducts();

  const filterByCategory = (term: string) => 
    allProducts.filter(p => (p.category || "").toLowerCase().includes(term.toLowerCase()));

  const discountedProducts = allProducts
    .filter(p => p.promotional_price && p.promotional_price < p.price)
    .slice(0, 4);

  const animeProducts = filterByCategory("anime").slice(0, 4);
  const gamesProducts = filterByCategory("games").slice(0, 4);
  const tokusatsuProducts = filterByCategory("tokusatsu").slice(0, 2);
  const comicsProducts = filterByCategory("comics").slice(0, 2);

  return (
    <main className="flex min-h-screen flex-col items-center pb-20 bg-background text-foreground overflow-x-hidden">
      
      {/* 1. HERO CAROUSEL */}
      <HeroCarousel />

      {/* 2. SHIPPING BANNER */}
      <ShippingBanner />

      {/* 3. BARRA DE CONFIANÇA */}
      <div className="w-full bg-secondary/5 border-b border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              <ShieldCheck className="w-8 h-8 text-green-500 mb-2 md:mb-0" />
              <div>
                <h4 className="font-bold text-sm">Checkout Seguro</h4>
                <p className="text-xs text-muted-foreground">Processado via Nuvemshop</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              <CreditCard className="w-8 h-8 text-blue-500 mb-2 md:mb-0" />
              <div>
                <h4 className="font-bold text-sm">Pagamento Flexível</h4>
                <p className="text-xs text-muted-foreground">Pix, Cartão e Boleto</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              <Truck className="w-8 h-8 text-orange-500 mb-2 md:mb-0" />
              <div>
                <h4 className="font-bold text-sm">Envio Rápido</h4>
                <p className="text-xs text-muted-foreground">Para todo o Brasil</p>
              </div>
            </div>

             <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
              <Zap className="w-8 h-8 text-purple-500 mb-2 md:mb-0" />
              <div>
                <h4 className="font-bold text-sm">Qualidade Premium</h4>
                <p className="text-xs text-muted-foreground">Algodão e Silk Digital</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20 max-w-7xl">
        
        {/* 4. OFERTAS RELÂMPAGO */}
        {discountedProducts.length > 0 && (
          <section>
            <BlurFade inView>
              <div className="flex items-center justify-between mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-600/10 to-transparent border border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Tag className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-display text-foreground">Ofertas Relâmpago</h2>
                    <p className="text-sm text-red-400 font-medium">Descontos por tempo limitado</p>
                  </div>
                </div>
                <Link href="/ofertas" className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  Ver todas <span className="text-lg">→</span>
                </Link>
              </div>
            </BlurFade>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.map((product, idx) => (
                <BlurFade key={product.id} delay={idx * 0.1} inView>
                  <ProductCard product={product} index={idx} />
                </BlurFade>
              ))}
            </div>
          </section>
        )}

        {/* 5. CATEGORIA: ANIMES */}
        {animeProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-l-4 border-purple-500 pl-4">
              <h2 className="text-3xl font-bold font-display">Animes</h2>
              <Link href="/categoria/camisetas?filter=anime" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Ver coleção completa &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {animeProducts.map((product, idx) => (
                <BlurFade key={product.id} delay={idx * 0.1} inView>
                  <ProductCard product={product} index={idx} />
                </BlurFade>
              ))}
            </div>
            
            <BlurFade delay={0.2} inView>
              <PromoBanner title="Clássicos dos Animes" color="bg-purple-900/40" />
            </BlurFade>
          </section>
        )}

        {/* 6. CATEGORIA: GAMES */}
        {gamesProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-l-4 border-green-500 pl-4">
              <h2 className="text-3xl font-bold font-display flex items-center gap-2">
                Games <Gamepad2 className="w-6 h-6 text-green-500" />
              </h2>
              <Link href="/categoria/camisetas?filter=games" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Ver coleção completa &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gamesProducts.map((product, idx) => (
                <BlurFade key={product.id} delay={idx * 0.1} inView>
                  <ProductCard product={product} index={idx} />
                </BlurFade>
              ))}
            </div>

            <BlurFade delay={0.2} inView>
              <PromoBanner title="Press Start" color="bg-green-900/40" />
            </BlurFade>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Coluna Comics */}
          {comicsProducts.length > 0 && (
            <section className="rounded-3xl p-6 md:p-8 transition-colors
              bg-black/5 dark:bg-white/5 
              border border-black/10 dark:border-white/10
              hover:border-black/20 dark:hover:border-white/20"
            >
               <div className="flex items-center justify-between mb-6 border-b border-black/10 dark:border-white/10 pb-4">
                <h2 className="text-2xl font-bold font-display flex items-center gap-2 text-foreground">
                   <BookOpen className="w-5 h-5 text-yellow-500" /> Comics
                </h2>
                <Link href="/categoria/camisetas?filter=comics" className="text-sm text-primary hover:underline">Ver mais</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {comicsProducts.map((product, idx) => (
                   <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            </section>
          )}

          {/* Coluna Tokusatsu */}
          {tokusatsuProducts.length > 0 && (
            <section className="rounded-3xl p-6 md:p-8 transition-colors
              bg-black/5 dark:bg-white/5 
              border border-black/10 dark:border-white/10
              hover:border-black/20 dark:hover:border-white/20"
            >
               <div className="flex items-center justify-between mb-6 border-b border-black/10 dark:border-white/10 pb-4">
                <h2 className="text-2xl font-bold font-display flex items-center gap-2 text-foreground">
                  <Tv className="w-5 h-5 text-red-500" /> Tokusatsu
                </h2>
                <Link href="/categoria/camisetas?filter=tokusatsu" className="text-sm text-primary hover:underline">Ver mais</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tokusatsuProducts.map((product, idx) => (
                   <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>

        <BlurFade delay={0.2} inView>
           <PromoBanner title="Pedidos Personalizados" color="bg-blue-900/40" />
        </BlurFade>

      </div>
    </main>
  );
}