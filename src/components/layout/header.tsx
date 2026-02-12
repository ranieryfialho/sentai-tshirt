"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, User } from "lucide-react";
import { AnimatedThemeToggle } from "@/components/magicui/animated-theme-toggle"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart-store"; 
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { getCartCount, toggleCart } = useCartStore();
  const cartCount = getCartCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ ATUALIZADO: "/categoria/camisetas" -> "/loja"
  const navLinks = [
    { name: "Sentai Store", href: "/loja" },
    { name: "Pedidos Personalizados", href: "/personalizados" },
    { name: "Trocas e Devoluções", href: "/trocas" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Lado Esquerdo: Menu Mobile + Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground/80 hover:text-primary hover:bg-primary/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-white/10 bg-background/95 backdrop-blur-xl">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href} className="text-lg font-medium hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
                <Separator className="bg-white/10 my-2" />
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-start gap-2 border-white/10 hover:bg-white/5">
                    <User className="h-4 w-4" /> Minha Conta
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo (Home) */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <span className="font-display font-bold text-xl">S</span>
            </div>
            <span className="hidden md:inline-block font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Sentai<span className="text-primary">Tshirt</span>
            </span>
          </Link>
        </div>

        {/* Centro: Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
          <div className="relative hidden lg:block w-full max-w-[200px] xl:max-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full bg-secondary/10 border-transparent pl-9 focus-visible:bg-background focus-visible:ring-primary/50 transition-all duration-300 rounded-full h-9 placeholder:text-muted-foreground/50"
            />
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden text-foreground/80">
            <Search className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCart} 
              className="text-foreground/80 hover:text-primary hover:bg-primary/10"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Button>
            
            {mounted && cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-white text-[10px] animate-bounce-slow shadow-lg shadow-red-500/50 pointer-events-none">
                {cartCount}
              </Badge>
            )}
          </div>

          <AnimatedThemeToggle />
        </div>
      </div>
    </header>
  );
}