"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, User, Heart } from "lucide-react";
import { AnimatedThemeToggle } from "@/components/magicui/animated-theme-toggle"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart-store";
import { useFavoritesStore } from "@/lib/store/favorites-store"; // ⭐ NOVO
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { getCartCount, toggleCart } = useCartStore();
  const { getFavoritesCount, toggleSheet } = useFavoritesStore(); // ⭐ NOVO
  const cartCount = getCartCount();
  const favoritesCount = getFavoritesCount(); // ⭐ NOVO

  useEffect(() => {
    setMounted(true);
  }, []);

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

          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <span className="font-display font-bold text-xl">S</span>
            </div>
            <span className="hidden md:inline-block font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Sentai Tshirt
            </span>
          </Link>
        </div>

        {/* Centro: Links Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-2">
          <AnimatedThemeToggle />

          {/* ⭐ BOTÃO DE FAVORITOS - ABRE O SHEET */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSheet}
            className="relative text-foreground/80 hover:text-red-500 hover:bg-red-500/10"
          >
            <Heart className="h-5 w-5" />
            {mounted && favoritesCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold">
                {favoritesCount}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleCart} className="relative text-foreground/80 hover:text-primary hover:bg-primary/10">
            <ShoppingBag className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-xs font-bold">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}