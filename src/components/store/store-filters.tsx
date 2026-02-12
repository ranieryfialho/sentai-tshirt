"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Árvore de categorias baseada na sua imagem do painel Nuvemshop
const categories = [
  {
    id: "animes",
    label: "Animes",
    subcategories: [
      { id: "black-clover", label: "Black Clover" },
      { id: "dragon-ball", label: "Dragon Ball" },
      { id: "fullmetal-alchemist", label: "Fullmetal Alchemist" },
      { id: "hunter-x-hunter", label: "Hunter x Hunter" },
      { id: "kimetsu-no-yaiba", label: "Kimetsu no Yaiba" },
      { id: "jujutsu-kaisen", label: "Jujutsu Kaisen" },
      { id: "naruto", label: "Naruto" },
      { id: "one-piece", label: "One Piece" },
      { id: "pokemon", label: "Pokémon" },
    ]
  },
  {
    id: "tokusatsu",
    label: "Tokusatsu",
    subcategories: [
      { id: "kamen-rider", label: "Kamen Rider" }
    ]
  },
  {
    id: "comics",
    label: "Comics",
    subcategories: [
      { id: "homem-aranha", label: "Homem-Aranha" }
    ]
  },
  {
    id: "games",
    label: "Games",
    subcategories: [
      { id: "league-of-legends", label: "League of Legends" },
      { id: "super-nintendo", label: "Super Nintendo" },
      { id: "god-of-war", label: "God of War" },
      { id: "hollow-knight", label: "Hollow Knight" }
    ]
  },
];

const sizes = ["P", "M", "G", "GG", "XG"];

type StoreFiltersProps = {
  currentCategory?: string;
  currentSubcategory?: string;
  currentSort?: string;
  currentSize?: string;
};

export function StoreFilters({ 
  currentCategory, 
  currentSubcategory,
  currentSort,
  currentSize 
}: StoreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: false,
    sizes: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ✅ NAVEGAÇÃO PARA CATEGORIA/SUBCATEGORIA COM TOGGLE
  const navigateToCategory = (categoryId: string, subcategoryId?: string) => {
    // Verifica se está clicando no mesmo item já selecionado (TOGGLE)
    const clickingSameCategory = !subcategoryId && currentCategory === categoryId && !currentSubcategory;
    const clickingSameSubcategory = subcategoryId && currentSubcategory === subcategoryId;
    
    // Preserva os filtros de sort e size
    const params = new URLSearchParams();
    if (currentSort) params.set("sort", currentSort);
    if (currentSize) params.set("size", currentSize);
    const queryString = params.toString();
    
    // Se clicar no mesmo item, desmarca e volta para /loja
    if (clickingSameCategory || clickingSameSubcategory) {
      router.push(`/loja${queryString ? `?${queryString}` : ''}`);
      return;
    }
    
    // Navega para a categoria/subcategoria
    const url = subcategoryId 
      ? `/categoria/${categoryId}/${subcategoryId}${queryString ? `?${queryString}` : ''}`
      : `/categoria/${categoryId}${queryString ? `?${queryString}` : ''}`;
    
    router.push(url);
  };

  // ✅ ATUALIZA QUERY PARAMS (SORT E SIZE) COM TOGGLE
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    
    // Se já está selecionado, remove (TOGGLE)
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push("/loja");
  };

  const isCategoryActive = (catId: string, subcats?: { id: string }[]) => {
    if (currentCategory === catId) return true;
    if (subcats && subcats.some(sub => sub.id === currentSubcategory)) return true;
    return false;
  };

  const hasActiveFilters = currentCategory || currentSize || currentSort;

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-8 text-foreground sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">Filtros</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-xs text-red-400 hover:underline"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Categorias e Subcategorias */}
      <div className="border-b border-white/10 pb-6">
        <button 
          onClick={() => toggleSection("categories")}
          className="flex w-full items-center justify-between py-2 font-bold hover:text-primary transition-colors"
        >
          <span>Categorias</span>
          {openSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {openSections.categories && (
          <div className="mt-4 space-y-1">
            {categories.map((cat) => {
              const isActive = isCategoryActive(cat.id, cat.subcategories);
              const isCatSelected = currentCategory === cat.id && !currentSubcategory;
              
              return (
                <div key={cat.id} className="flex flex-col">
                  {/* Categoria Pai */}
                  <button
                    onClick={() => navigateToCategory(cat.id)}
                    className={cn(
                      "flex items-center justify-between w-full py-1.5 text-sm hover:text-primary transition-colors",
                      isCatSelected ? "text-primary font-bold" : "text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        isCatSelected ? "bg-primary border-primary" : "border-white/20 bg-transparent"
                      )}>
                        {isCatSelected && <Check size={10} className="text-white" />}
                      </div>
                      {cat.label}
                    </div>
                  </button>

                  {/* Renderização das Subcategorias */}
                  {isActive && cat.subcategories && (
                    <div className="ml-2 pl-4 border-l border-white/10 mt-1 space-y-1">
                      {cat.subcategories.map((sub) => {
                        const isSubSelected = currentSubcategory === sub.id;
                        
                        return (
                          <button
                            key={sub.id}
                            onClick={() => navigateToCategory(cat.id, sub.id)}
                            className={cn(
                              "flex items-center gap-2 w-full py-1 text-xs hover:text-primary transition-colors text-left",
                              isSubSelected ? "text-primary font-bold" : "text-muted-foreground/70"
                            )}
                          >
                            <ChevronRight size={12} className={cn(isSubSelected ? "text-primary" : "text-transparent")} />
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ordenação por Preço */}
      <div className="border-b border-white/10 pb-6">
        <button 
          onClick={() => toggleSection("price")} 
          className="flex w-full items-center justify-between py-2 font-bold hover:text-primary transition-colors"
        >
          <span>Faixa de Preço</span>
          {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.price && (
          <div className="mt-4 grid grid-cols-2 gap-2">
             <button
              onClick={() => updateQueryParam("sort", "price_asc")}
              className={cn(
                "h-9 px-3 rounded-md border text-xs font-medium transition-all",
                currentSort === "price_asc" 
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                  : "border-white/10 text-muted-foreground hover:border-blue-500 hover:text-white"
              )}
             >
               Menor Preço
             </button>
             <button
              onClick={() => updateQueryParam("sort", "price_desc")}
              className={cn(
                "h-9 px-3 rounded-md border text-xs font-medium transition-all",
                currentSort === "price_desc" 
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                  : "border-white/10 text-muted-foreground hover:border-blue-500 hover:text-white"
              )}
             >
               Maior Preço
             </button>
          </div>
        )}
      </div>

      {/* Filtro de Tamanhos */}
      <div className="border-b border-white/10 pb-6">
        <button 
          onClick={() => toggleSection("sizes")} 
          className="flex w-full items-center justify-between py-2 font-bold hover:text-primary transition-colors"
        >
          <span>Tamanhos</span>
          {openSections.sizes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.sizes && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => updateQueryParam("size", size)}
                className={cn(
                  "h-10 w-full rounded-md border text-sm font-medium transition-all",
                  currentSize === size 
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                    : "border-white/10 text-muted-foreground hover:border-blue-500 hover:text-white"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}