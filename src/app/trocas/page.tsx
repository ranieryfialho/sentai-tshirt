import { BlurFade } from "@/components/magicui/blur-fade";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RefreshCw, ShieldCheck, AlertTriangle, HelpCircle, FileText, Banknote } from "lucide-react";

export default function ExchangesPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            {/* Gradiente ajustado para suportar Light Mode (Preto -> Cinza) e Dark Mode (Branco -> Cinza Claro) */}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60">
              Trocas e Devoluções
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Política transparente e descomplicada. Queremos você 100% satisfeito com seu equipamento.
            </p>
          </div>
        </BlurFade>

        <div className="space-y-12">
          
          <BlurFade delay={0.2} inView>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cards com bg e border dinâmicos */}
              <div className="p-6 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300">
                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Garantia de 7 Dias</h3>
                <p className="text-sm text-muted-foreground">Arrependimento de compra garantido por lei. Devolva sem perguntas.</p>
              </div>
              <div className="p-6 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300">
                <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">15 Dias para Troca</h3>
                <p className="text-sm text-muted-foreground">Troca de tamanho ou modelo facilitada (mediante estoque).</p>
              </div>
              <div className="p-6 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Condições</h3>
                <p className="text-sm text-muted-foreground">Produto sem uso, com etiqueta intacta e embalagem original.</p>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            {/* Box principal de Dúvidas Frequentes ajustada */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Dúvidas Frequentes
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                
                {/* Linhas separadoras dos Accordions ajustadas para aparecerem no modo claro */}
                <AccordionItem value="item-1" className="border-black/10 dark:border-white/10">
                  <AccordionTrigger className="hover:text-primary transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Como faço para solicitar uma troca?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-7">
                    <ol className="list-decimal space-y-2 ml-4">
                      <li>Entre em contato pelo e-mail <strong>sentaitshirt@gmail.com</strong> ou WhatsApp.</li>
                      <li>Informe o número do pedido (#1234) e o motivo.</li>
                      <li>Aguarde nossa equipe entrar em contato.</li>
                      <li>Embale o produto e leve à agência dos Correios mais próxima.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-black/10 dark:border-white/10">
                  <AccordionTrigger className="hover:text-primary transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <Banknote className="w-4 h-4 text-muted-foreground" />
                      Como funcionam os reembolsos?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-7">
                    <p className="mb-2">
                      O reembolso é liberado após o recebimento e conferência do produto em nosso QG.
                    </p>
                    <ul className="list-disc space-y-1 ml-4">
                      <li><strong>Cartão de Crédito:</strong> O estorno ocorre em até 2 faturas subsequentes.</li>
                      <li><strong>Pix ou Boleto:</strong> Depósito em conta corrente em até 5 dias úteis.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-black/10 dark:border-white/10">
                  <AccordionTrigger className="hover:text-primary transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      O produto chegou com defeito. E agora?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-7">
                    Lamentamos muito! Nesse caso, a troca é imediata e sem custos. 
                    Envie uma foto do defeito para nosso suporte assim que receber o pacote. 
                    Garantimos prioridade total no envio de uma nova peça perfeita para você.
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </BlurFade>

        </div>
      </div>
    </main>
  );
}