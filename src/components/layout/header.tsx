"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, 
  Menu, 
  Search, 
  User, 
  Heart, 
  Store, 
  Package, 
  Phone, 
  ArrowLeftRight, 
  Home,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AnimatedThemeToggle } from "@/components/magicui/animated-theme-toggle";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { cn } from "@/lib/utils";
import { searchProducts } from "@/app/actions/search";
import { Product } from "@/types";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { getCartCount, toggleCart } = useCartStore();
  const { getFavoritesCount, toggleSheet } = useFavoritesStore();
  
  const cartCount = getCartCount();
  const favoritesCount = getFavoritesCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchProducts(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const navLinks = [
    { name: "Sentai Store", href: "/loja", icon: Store },
    { name: "Pedidos Personalizados", href: "/personalizados", icon: Package },
    { name: "Trocas e Devoluções", href: "/trocas", icon: ArrowLeftRight },
    { name: "Contato", href: "/contato", icon: Phone },
  ];

  const isTransparent = isHome && !isScrolled;

  const textColorClass = isTransparent
    ? "text-white/90 hover:text-white"
    : "text-foreground/80 hover:text-primary";

  const headerBgClass = isTransparent
    ? "bg-transparent border-transparent py-5"
    : "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3";

    const SearchResultsDropdown = () => {
    if (!showResults || searchQuery.length < 3) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
        {isSearching ? (
          <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Buscando...
          </div>
        ) : searchResults.length > 0 ? (
          <ul>
            {searchResults.map((product) => (
              <li key={product.id} className="border-b border-border/50 last:border-0">
                <Link 
                  href={`/produto/${product.slug}`}
                  onClick={() => {
                    setShowResults(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                    <img src={product.images[0]?.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      R$ {product.promotional_price ? product.promotional_price.toFixed(2) : product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            <li className="bg-gray-50/50 dark:bg-white/5 border-t border-border/50">
              <Link 
                href={`/busca?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => {
                  setShowResults(false);
                  setIsMobileMenuOpen(false);
                }}
                className="block p-3 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Ver todos os resultados
              </Link>
            </li>
          </ul>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        headerBgClass
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center gap-2 z-50 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <span className="font-display font-bold text-xl">S</span>
          </div>
          <span className={cn(
            "font-display font-bold text-xl tracking-tight block transition-colors",
            // Aplica a lógica de cor: Branco na Home transparente, Cor do tema no resto
            isTransparent ? "text-white group-hover:text-white" : "text-foreground group-hover:text-primary"
          )}>
            Sentai<span className="text-primary">Tshirt</span>
          </span>
        </Link>

        {/* 2. NAV LINKS (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 mx-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                pathname === link.href 
                  ? "bg-primary/10 text-primary" 
                  : textColorClass
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* 3. BUSCA (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-[200px] lg:max-w-xs ml-auto mr-4 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
              "text-muted-foreground group-focus-within:text-blue-500" 
            )} />
            <Input 
              placeholder="Buscar..." 
              className={cn(
                "pl-10 h-9 rounded-full transition-all border",
                // Mantém o input consistente em todas as páginas
                "bg-white border-gray-200 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500 focus-visible:border-blue-500",
                "dark:bg-slate-900/50 dark:border-transparent dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:bg-slate-900"
              )}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>
          
          <SearchResultsDropdown />
        </div>

        {/* 4. AÇÕES */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          <div className={cn("hidden sm:block [&_button]:text-current [&_svg]:text-current", textColorClass)}>
             <AnimatedThemeToggle />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("hidden md:flex relative transition-colors", textColorClass)}
            onClick={toggleSheet}
          >
            <Heart className="w-5 h-5" />
            {mounted && favoritesCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold animate-in zoom-in">
                {favoritesCount}
              </Badge>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("relative transition-colors", textColorClass)}
            onClick={toggleCart}
          >
            <ShoppingBag className="w-5 h-5" />
            {mounted && cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-[10px] font-bold animate-in zoom-in">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Link href="/minha-conta" className="hidden md:flex">
             <Button variant="ghost" size="icon" className={cn("transition-colors", textColorClass)}>
               <User className="w-5 h-5" />
             </Button>
          </Link>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("-mr-2", textColorClass)}>
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 border-r-white/10 bg-background/95 backdrop-blur-xl">
                
                <SheetHeader className="p-6 border-b border-white/5 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="font-display font-bold text-white">S</span>
                    </div>
                    <span className="font-display font-bold text-xl">Menu</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full overflow-y-auto">
                  <div className="p-6 pb-2 relative">
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="O que você procura?" 
                        className={cn(
                          "pl-10 h-12 rounded-xl transition-all border",
                          "bg-white border-gray-200 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500",
                          "dark:bg-slate-900/50 dark:border-transparent dark:text-foreground dark:placeholder:text-muted-foreground"
                        )}
                        value={searchQuery}
                        onChange={handleInputChange}
                      />
                    </form>
                    <div className="mt-2 text-left">
                      <SearchResultsDropdown />
                    </div>
                  </div>

                  <nav className="flex-1 px-4 py-4 space-y-2">
                    <Link 
                      href="/" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                        pathname === "/" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <Home className="w-5 h-5" />
                      Início
                    </Link>

                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                          pathname.startsWith(link.href) ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="p-6 mt-auto border-t border-white/5 space-y-4 bg-black/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-muted-foreground">Tema</span>
                      <AnimatedThemeToggle />
                    </div>

                    <SheetClose asChild>
                      <Link href="/minha-conta">
                        <Button variant="outline" className="w-full justify-start gap-3 h-12 border-white/10 hover:bg-white/5 hover:text-primary transition-colors">
                          <User className="w-4 h-4" />
                          Minha Conta
                        </Button>
                      </Link>
                    </SheetClose>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 h-12 hover:bg-white/5 hover:text-red-500 transition-colors"
                      onClick={() => { setIsMobileMenuOpen(false); toggleSheet(); }}
                    >
                      <Heart className="w-4 h-4" />
                      Meus Favoritos ({mounted ? favoritesCount : 0})
                    </Button>
                  </div>

                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}