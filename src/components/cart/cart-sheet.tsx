"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, PackageOpen, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
  const { 
    isOpen, 
    toggleCart, 
    items, 
    removeItem, 
    updateQuantity, 
    getCartTotal 
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Erro no retorno da API:", data);
        
        switch (data.error) {
          case "ESTOQUE_INSUFICIENTE":
            setErrorMessage(`Estoque insuficiente!\n${data.details}`);
            break;
          case "ERRO_API_NUVEMSHOP":
            setErrorMessage(`Erro ao processar pedido.\n${data.details}`);
            break;
          case "ERRO_INTERNO":
            setErrorMessage(`Erro interno no servidor.\nTente novamente mais tarde.`);
            break;
          default:
            setErrorMessage(`Não foi possível finalizar.\n${data.message || "Erro desconhecido"}`);
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
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
            SEU CARRINHO
            <span className="text-xs font-mono text-muted-foreground font-normal ml-auto border border-border px-2 py-1 rounded-md">
              {items.length} ITEM(S)
            </span>
          </SheetTitle>
        </SheetHeader>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-6 pt-4"
          >
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive whitespace-pre-line font-medium leading-tight">
                  {errorMessage}
                </p>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-xs text-destructive hover:text-destructive/80 underline mt-2"
                >
                  Dispensar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-muted-foreground p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center border border-border animate-pulse-slow">
              <PackageOpen className="w-10 h-10 opacity-50" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Seu inventário está vazio</p>
              <p className="text-sm mt-1">Equipe-se com os melhores itens da loja.</p>
            </div>
            <Button variant="outline" onClick={toggleCart} className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
              Voltar para a Loja
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      key={`${item.id}-${item.selectedSize}`} 
                      className="group relative flex gap-4 p-3 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-300 shadow-sm"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                        <img 
                          src={item.images[0]?.src} 
                          alt={item.name} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-tight">
                              {item.name}
                            </h4>
                            <button 
                              onClick={() => removeItem(item.id, item.selectedSize)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-2 -mt-2 rounded-md hover:bg-destructive/10"
                              aria-label="Remover item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs font-mono text-primary mt-1 flex items-center gap-2">
                            <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[10px] border border-primary/20 font-bold">
                              TAM: {item.selectedSize}
                            </span>
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center h-8 bg-primary rounded-lg shadow-md shadow-primary/20">
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                              className="w-8 h-full flex items-center justify-center text-primary-foreground/90 hover:bg-black/20 transition-colors rounded-l-lg disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-primary-foreground">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                              className="w-8 h-full flex items-center justify-center text-primary-foreground/90 hover:bg-black/20 transition-colors rounded-r-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <span className="font-bold text-sm tracking-tight text-foreground">
                            R$ {((item.promotional_price || item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="p-6 bg-background/80 border-t border-border backdrop-blur-xl flex-shrink-0 z-20">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-foreground font-medium">R$ {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete Estimado</span>
                  <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded border border-green-200 dark:border-green-800">GRÁTIS</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold font-display mb-6 items-end">
                <span className="text-foreground">Total</span>
                <span className="text-2xl text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  R$ {getCartTotal().toFixed(2)}
                </span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full h-14 text-base font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300 group rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Finalizar Compra
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}