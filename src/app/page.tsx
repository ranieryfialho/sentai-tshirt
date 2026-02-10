import Link from "next/link";
import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { QuickAddButton } from "@/components/product/quick-add-btn";

export default async function Home() {
  const products = await nuvemshopClient.getProducts();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-12 text-foreground transition-colors duration-300">
      
      <div className="w-full max-w-6xl flex justify-between items-end border-b border-white/10 pb-6">
        <BlurFade delay={0.25} inView>
          <div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-secondary animate-pulse-slow">
              Sentai Tshirt
            </h1>
            <p className="mt-2 text-muted-foreground font-mono text-lg">
              Equipamento oficial para sua jornada geek.
            </p>
          </div>
        </BlurFade>
        
        <BlurFade delay={0.4} inView>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${products.length > 0 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
              <span className="text-xs font-mono text-muted-foreground">SYSTEM: {products.length > 0 ? "ONLINE" : "OFFLINE"}</span>
            </div>
          </div>
        </BlurFade>
      </div>

      <section className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <BlurFade delay={0.5} inView>
            <h2 className="text-3xl font-bold font-display flex items-center gap-3">
              <span className="w-2 h-8 bg-secondary rounded-sm block shadow-[0_0_15px_rgba(220,38,38,0.5)]"></span>
              Últimos Drops
            </h2>
          </BlurFade>
          
          <BlurFade delay={0.6} inView>
            <div className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
              Ver todos &rarr;
            </div>
          </BlurFade>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const firstImage = product.images[0]?.src;
            const secondImage = product.images[1]?.src;
            const hasSecondImage = !!secondImage;

            return (
            <BlurFade key={product.id} delay={0.25 + (idx * 0.1)} inView>
              <Link href={`/produto/${product.slug}`} className="block h-full cursor-pointer">
                <div 
                  className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 h-full
                    bg-white/5 dark:bg-black/20 
                    backdrop-blur-md 
                    border border-white/10 dark:border-white/5
                    shadow-xl shadow-black/5 dark:shadow-primary/5
                    hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30"
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    
                    {product.promotional_price && (
                      <span className="absolute top-3 right-3 z-30 bg-secondary/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                        -{Math.round(((product.price - product.promotional_price) / product.price) * 100)}% OFF
                      </span>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-white text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 pointer-events-none">
                      Visualizar
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-mono text-primary mb-1 uppercase tracking-wider">{product.category}</p>
                        <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="pt-2 flex justify-between items-end border-t border-white/5 mt-2">
                      <div className="flex flex-col">
                        {product.promotional_price && (
                          <span className="text-xs text-muted-foreground line-through font-mono">
                            R$ {product.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-display font-bold text-foreground">
                          R$ {product.promotional_price ? product.promotional_price.toFixed(2) : product.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="relative z-20">
                        <QuickAddButton product={product} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </BlurFade>
          )})}
        </div>
      </section>
    </main>
  );
}