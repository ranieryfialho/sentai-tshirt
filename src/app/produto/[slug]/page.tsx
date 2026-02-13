import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await nuvemshopClient.getProductBySlug(slug);

  if (!product) return { title: "Produto não encontrado" };

  return {
    title: `${product.name} - Sentai Tshirt`,
    description: product.description.slice(0, 150),
    openGraph: {
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
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
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex justify-center bg-background text-foreground">
      <div className="w-full max-w-7xl">
        
        <BlurFade delay={0.1} inView>
          <Link 
            href="/loja" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Voltar para a Loja</span>
          </Link>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <BlurFade delay={0.2} inView>
            <ProductGallery 
              images={product.images} 
              discountPercentage={discountPercentage} 
            />
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <ProductInfo product={product} />
          </BlurFade>

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
                <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-muted-foreground">Garantia</span>
                    <span className="font-medium">Contra defeitos de fabricação</span>
                </div>
            </div>
          </BlurFade>
        </div>

      </div>
    </main>
  );
}