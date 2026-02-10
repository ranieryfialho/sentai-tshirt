import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const product = await nuvemshopClient.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const discountPercentage = product.promotional_price 
    ? Math.round(((product.price - product.promotional_price) / product.price) * 100) 
    : 0;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-7xl">
        
        <BlurFade delay={0.1} inView>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Voltar para a Loja</span>
          </Link>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Galeria */}
          <div className="space-y-4">
            <BlurFade delay={0.2} inView>
              <div className="aspect-square relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
                <img 
                  src={product.images[0]?.src} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-6 right-6 bg-secondary text-white font-bold px-4 py-2 rounded-full shadow-lg border border-white/10 backdrop-blur-md">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>
            </BlurFade>
            
            <BlurFade delay={0.3} inView>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img) => (
                  <button 
                    key={img.id}
                    className="flex-shrink-0 w-24 h-24 rounded-xl border border-primary/50 overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all bg-white/5"
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </BlurFade>
          </div>

          <div className="flex flex-col">
            <BlurFade delay={0.3} inView>
              <div className="space-y-6">
                
                <div>
                  <Badge variant="outline" className="mb-3 border-primary/30 text-primary bg-primary/5 px-3 py-1">
                    {product.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm">Em estoque, envio imediato.</span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-1">
                  {product.promotional_price && (
                    <p className="text-lg text-muted-foreground line-through">
                      R$ {product.price.toFixed(2)}
                    </p>
                  )}
                  <div className="flex items-end gap-2">
                    <p className="text-5xl font-bold text-foreground tracking-tight">
                      R$ {product.promotional_price ? product.promotional_price.toFixed(2) : product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-primary/80 font-medium">
                    até 3x de R$ {(product.price / 3).toFixed(2)} sem juros
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-sm text-muted-foreground leading-relaxed">
                  <p>{product.description || "Descrição indisponível no momento."}</p>
                </div>

                <AddToCartButton product={product} />

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <Truck className="w-5 h-5 text-primary" />
                    <div className="text-xs">
                      <p className="font-bold text-foreground">Frete Grátis</p>
                      <p className="text-muted-foreground">Para sul e sudeste</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div className="text-xs">
                      <p className="font-bold text-foreground">Garantia Sentai</p>
                      <p className="text-muted-foreground">30 dias para troca</p>
                    </div>
                  </div>
                </div>

              </div>
            </BlurFade>
          </div>
        </div>
        
        <div className="mt-20 border-t border-white/10 pt-10">
          <BlurFade inView>
            <h2 className="text-2xl font-bold mb-6 font-display">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-muted-foreground">Material</span>
                    <span className="font-medium">100% Algodão Penteado 30.1</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-muted-foreground">Estampa</span>
                    <span className="font-medium">Silk Screen Digital (DTG)</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-muted-foreground">Modelagem</span>
                    <span className="font-medium">Regular Fit</span>
                </div>
            </div>
          </BlurFade>
        </div>

      </div>
    </main>
  );
}