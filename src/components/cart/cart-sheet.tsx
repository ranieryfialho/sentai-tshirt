"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, PackageOpen, Loader2, AlertCircle, Ticket, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
  const { 
    isOpen, toggleCart, items, removeItem, 
    updateQuantity, getCartTotals, applyCoupon, 
    removeCoupon, couponCode
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const { subtotal, promotionDiscount, couponDiscount, totalDiscount, total } = getCartTotals();

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    
    setCouponError("");
    
    try {
      // ⭐ Buscar cupons válidos da API
      const response = await fetch('/api/coupons');
      const activeCoupons = await response.json();
      
      const validCoupon = activeCoupons.find((c: any) => 
        c.code.toUpperCase() === couponInput.toUpperCase()
      );
      
      if (!validCoupon) {
        setCouponError("Cupão inválido ou expirado.");
        return;
      }
      
      applyCoupon(validCoupon.code);
      setCouponInput("");
      
    } catch (error) {
      setCouponError("Erro ao validar cupão.");
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
          discount: totalDiscount,
          couponCode: couponCode
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.details || data.message || "Não foi possível finalizar.");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Erro de conexão. Verifique sua internet.");
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md border-l border-border bg-background/95 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full">
        
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border bg-background/50 backdrop-blur-md flex-shrink-0">
          <SheetTitle className="font-display text-2xl font-bold flex items-center gap-3 text-foreground tracking-wide">
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            SEU CESTO
            <span className="text-xs font-mono text-muted-foreground font-normal ml-auto border border-border px-2 py-1 rounded-md">
              {items.reduce((acc, item) => acc + item.quantity, 0)} ITEM(S)
            </span>
          </SheetTitle>
        </SheetHeader>

        {errorMessage && (
          <div className="px-6 pt-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive whitespace-pre-line font-medium leading-tight">
                  {errorMessage}
                </p>
                <button onClick={() => setErrorMessage(null)} className="text-xs text-destructive underline mt-2">
                  Dispensar
                </button>
              </div>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-muted-foreground p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center border border-border">
              <PackageOpen className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-lg font-medium text-foreground">O seu carrinho está vazio</p>
            <Button variant="outline" onClick={toggleCart} className="border-primary/50 text-primary hover:bg-primary/10">
              Voltar para a Loja
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    // ⭐ Usar finalPrice do item
                    const itemPrice = item.finalPrice;
                    const hasItemDiscount = itemPrice < item.price;

                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                        key={`${item.id}-${item.selectedSize}`} 
                        className="group relative flex gap-4 p-3 rounded-xl border border-border bg-card hover:border-primary/20 transition-all duration-300"
                      >
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                          <img src={item.images[0]?.src} alt={item.name} className="object-cover w-full h-full" />
                          {hasItemDiscount && (
                            <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              -{Math.round(((item.price - itemPrice) / item.price) * 100)}%
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight">
                                {item.name}
                              </h4>
                              <button 
                                onClick={() => removeItem(item.id, item.selectedSize)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs font-mono text-primary mt-1">
                              TAM: {item.selectedSize}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center h-8 bg-primary rounded-lg">
                              <button 
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center text-primary-foreground/90 rounded-l-lg disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-primary-foreground">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-primary-foreground/90 rounded-r-lg"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              {hasItemDiscount && (
                                <span className="text-xs text-muted-foreground line-through font-mono">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </span>
                              )}
                              <span className="font-bold text-sm tracking-tight text-foreground">
                                R$ {(itemPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="p-6 bg-background/80 border-t border-border backdrop-blur-xl flex-shrink-0 z-20">
              
              {/* ⭐ ALERTA DE PROMOÇÃO "PAGUE 4 LEVE 5" */}
              {items.reduce((sum, item) => sum + item.quantity, 0) >= 5 && promotionDiscount > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-600">Promoção Ativa!</p>
                    <p className="text-xs text-green-600/80">Pague 4 e Leve 5 - Desconto aplicado!</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                {!couponCode ? (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Cupão de desconto" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="bg-muted/50 focus-visible:ring-primary/50"
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>Aplicar</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-3 rounded-lg">
                    <div className="flex items-center gap-2 font-medium">
                      <Ticket className="w-4 h-4" />
                      Cupão {couponCode} aplicado!
                    </div>
                    <button onClick={removeCoupon} className="text-xs hover:underline">Remover</button>
                  </div>
                )}
                {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
              </div>

              <div className="space-y-3 mb-4 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-foreground font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>

                {promotionDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Promoção (Pague 4 Leve 5)
                    </span>
                    <span>- R$ {promotionDiscount.toFixed(2)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      Cupão {couponCode}
                    </span>
                    <span>- R$ {couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded border border-green-200 dark:border-green-800">GRÁTIS</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold font-display mb-6 items-end">
                <span className="text-foreground">Total</span>
                <span className="text-3xl text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 group rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando...</>
                ) : (
                  <>Finalizar Compra <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}