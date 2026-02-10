import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Palette, Ruler, Shirt, Clock, MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CustomOrdersPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        
        {/* HERO SECTION: Limpa e Sólida */}
        <BlurFade delay={0.1} inView>
          <div className="relative rounded-3xl overflow-hidden border border-border 
            /* MODO LIGHT: Fundo cinza claro sólido (Clean) */
            bg-slate-100
            /* MODO DARK: Fundo preto sólido */
            dark:bg-black
            p-8 md:p-20 text-center mb-16"
          >
            
            <div className="relative z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wider mb-6">
                SENTAI CUSTOM LAB
              </span>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-foreground">
                Pedidos Personalizados
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Crie sua peça única. Do seu jeito, com a nossa qualidade.
              </p>
              
              <Link href="https://wa.me/5585999066003" target="_blank">
                <Button className="h-14 px-8 text-lg bg-green-500 hover:bg-green-600 text-white font-bold shadow-sm rounded-full transition-transform hover:scale-105">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Chamar no WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </BlurFade>

        {/* Como Funciona */}
        <div className="mb-20">
            <BlurFade delay={0.2} inView>
                <h2 className="text-3xl font-bold mb-8 text-center font-display text-foreground">O que precisamos saber?</h2>
            </BlurFade>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Cards Limpos: Fundo branco no light, preto no dark */}
                
                <BlurFade delay={0.3} inView>
                    <div className="p-6 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors h-full">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                            <Palette className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground">Sua Estampa</h3>
                        <p className="text-sm text-muted-foreground">
                            Envie a imagem da sua estampa e informe o tamanho que ela deve ter na camisa.
                        </p>
                    </div>
                </BlurFade>

                <BlurFade delay={0.4} inView>
                    <div className="p-6 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors h-full">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                            <Shirt className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground">Detalhes da Peça</h3>
                        <p className="text-sm text-muted-foreground">
                            Informe o <strong>tamanho</strong> desejado (P, M, G...) e a <strong>cor</strong> da camisa.
                        </p>
                    </div>
                </BlurFade>

                <BlurFade delay={0.5} inView>
                    <div className="p-6 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors h-full">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                            <Ruler className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground">Modelagem</h3>
                        <p className="text-sm text-muted-foreground">
                            Escolha o estilo que mais combina com você: <strong>Tradicional</strong> ou <strong>Oversized</strong>.
                        </p>
                    </div>
                </BlurFade>

                <BlurFade delay={0.6} inView>
                    <div className="p-6 rounded-2xl border border-border bg-background hover:border-primary/50 transition-colors h-full">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-foreground">Envio Rápido</h3>
                        <p className="text-sm text-muted-foreground">
                            Enviamos de <strong>1 a 2 dias úteis</strong> após a confirmação do pagamento e da arte.
                        </p>
                    </div>
                </BlurFade>

            </div>
        </div>

        {/* Aviso de Preço */}
        <BlurFade delay={0.7} inView>
          <div className="text-center max-w-2xl mx-auto p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-border">
            <div className="flex items-center justify-center gap-2 mb-2 text-yellow-600 dark:text-yellow-500 font-bold">
                <AlertCircle className="w-5 h-5" />
                Importante sobre valores
            </div>
            <p className="text-muted-foreground">
              Os preços variam de acordo com o <strong>tamanho da estampa</strong> escolhida. Entre em contato para um orçamento exato.
            </p>
          </div>
        </BlurFade>

      </div>
    </main>
  );
}