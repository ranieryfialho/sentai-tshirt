import { nuvemshopClient } from "@/lib/api/nuuvemshop-client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ProductCard } from "@/components/product/product-card";
import { StoreFilters } from "@/components/store/store-filters";
import { Breadcrumbs } from "@/components/store/breadcrumbs";
import { PaginationWrapper } from "@/components/store/pagination-wrapper";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ITEMS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Sentai Store - Camisetas de Animes, Games e Tokusatsu | Sentai Tshirt",
  description: "Explore nossa coleção completa de camisetas exclusivas de animes, games, tokusatsu e comics. Produtos oficiais com qualidade premium.",
  openGraph: {
    title: "Sentai Store - Loja Oficial",
    description: "Confira nossa coleção completa de produtos exclusivos",
    type: "website",
  },
};

export default async function CamisetasPage({ searchParams }: Props) {
  const search = await searchParams;

  const sortFilter = typeof search.sort === 'string' ? search.sort : null;
  const sizeFilter = typeof search.size === 'string' ? search.size : null;
  const currentPage = typeof search.page === 'string' ? parseInt(search.page) : 1;

  const allProducts = await nuvemshopClient.getProducts();

  let products = allProducts;

  // Filtro por tamanho
  if (sizeFilter) {
    products = products.filter((p) => {
      return p.variants?.some(variant => 
        variant.values?.some(v => v.pt === sizeFilter)
      );
    });
  }

  // Ordenação por Preço
  if (sortFilter === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortFilter === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  }

  // Paginação
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs 
          items={[
            { label: "Loja", href: "/categoria/camisetas" }
          ]}
        />
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block">
            <StoreFilters 
              currentSort={sortFilter || undefined}
              currentSize={sizeFilter || undefined}
            />
          </div>

          <div className="flex-1">
            <BlurFade delay={0.1} inView>
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                  <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">
                    Loja Oficial
                  </span>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                    Todos os Produtos
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {products.length} {products.length === 1 ? 'drop encontrado' : 'drops encontrados'}
                  </p>
                </div>

                {/* Filtro Mobile */}
                <div className="lg:hidden w-full md:w-auto mt-4 md:mt-0">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full border-white/10 gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filtros
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
            </BlurFade>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, idx) => (
                  <BlurFade key={product.id} delay={0.1 + (idx * 0.05)} inView>
                    <ProductCard product={product} index={idx} />
                  </BlurFade>
                ))
              ) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-3xl bg-white/5">
                  <p className="text-xl text-muted-foreground font-display">
                    Nenhum produto encontrado com esses filtros.
                  </p>
                  <Button 
                    variant="secondary"
                    onClick={() => window.location.href = '/categoria/camisetas'}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <PaginationWrapper 
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/categoria/camisetas"
                searchParams={search as Record<string, string>}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}