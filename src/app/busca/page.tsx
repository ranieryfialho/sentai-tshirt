import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ProductCard } from "@/components/product/product-card";
import { StoreFilters } from "@/components/store/store-filters";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : "";
  
  return {
    title: query ? `Busca por "${query}" - Sentai Store` : "Busca - Sentai Store",
    description: `Resultados da busca por ${query} na Sentai Store.`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const search = await searchParams;
  const query = typeof search.q === 'string' ? search.q : "";
  const sortFilter = typeof search.sort === 'string' ? search.sort : null;
  const sizeFilter = typeof search.size === 'string' ? search.size : null;

  const allProducts = await nuvemshopClient.getProducts();

  const term = query.toLowerCase();
  let products = allProducts.filter((p) => {
    const matchName = p.name.toLowerCase().includes(term);
    
    const matchCategoryString = p.category && p.category.toLowerCase().includes(term);
    
    const matchCategoriesArray = p.categories?.some((cat) => 
      cat.name.toLowerCase().includes(term)
    );

    if (!term) return true;
    return matchName || matchCategoryString || matchCategoriesArray;
  });

  if (sizeFilter) {
    products = products.filter((p) => {
      return p.variants?.some(variant => 
        variant.values?.some(v => v.pt === sizeFilter)
      );
    });
  }

  if (sortFilter === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortFilter === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col gap-6 mb-8">
          <Link 
            href="/loja" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Loja
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
            <div>
              <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block flex items-center gap-2">
                <Search className="w-4 h-4" /> Resultados da Busca
              </span>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground break-words">
                &quot;{query}&quot;
              </h1>
              <p className="text-muted-foreground mt-2">
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            <div className="lg:hidden w-full md:w-auto mt-4 md:mt-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-white/10 gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Refinar Busca
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-background border-r border-white/10">
                  <div className="mt-6">
                    <StoreFilters 
                      currentSort={sortFilter || undefined}
                      currentSize={sizeFilter || undefined}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="hidden lg:block">
            <StoreFilters 
              currentSort={sortFilter || undefined}
              currentSize={sizeFilter || undefined}
            />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <BlurFade key={product.id} delay={0.1 + (idx * 0.05)} inView>
                    <ProductCard product={product} index={idx} />
                  </BlurFade>
                ))
              ) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-3xl bg-white/5">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Não encontramos nada com &quot;{query}&quot;. Tente buscar por termos mais genéricos como &quot;Naruto&quot;, &quot;Games&quot; ou o nome do personagem.
                  </p>
                  <Button asChild className="mt-4" variant="default">
                    <Link href="/loja">Ver todos os produtos</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}