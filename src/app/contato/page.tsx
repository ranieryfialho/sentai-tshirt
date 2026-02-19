import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Entre em Contato
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tem alguma dúvida sobre seu pedido, sugestão de estampa ou quer apenas dar um oi? Nossa base de operações está pronta para responder.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          <BlurFade delay={0.2} inView>
            <div className="space-y-8">
              <div className="flex gap-4 items-start p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-lg text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">E-mail</h3>
                  <p className="text-muted-foreground mb-2">Para suporte geral e parcerias.</p>
                  <a href="mailto:sentaitshirt@gmail.com" className="text-primary hover:underline">sentaitshirt@gmail.com</a>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                  <p className="text-muted-foreground mb-2">Resposta rápida em horário comercial.</p>
                  <a href="https://api.whatsapp.com/send/?phone=5585999066003&text&type=phone_number&app_absent=0" className="text-green-500 hover:underline">(85) 99906-6003</a>
                </div>
              </div>

              <div className="flex gap-4 items-start p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">HQ Sentai</h3>
                  <p className="text-muted-foreground">
                    Rua Teste, 42 - Sala 7<br />
                    Ceará - CE
                  </p>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.3} inView>
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Envie uma mensagem
              </h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Nome</label>
                    <Input placeholder="Seu nome" className="bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/10 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Sobrenome</label>
                    <Input placeholder="Sobrenome" className="bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/10 focus-visible:ring-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">E-mail</label>
                  <Input type="email" placeholder="seu@email.com" className="bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/10 focus-visible:ring-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Mensagem</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 mt-2">
                  ENVIAR MENSAGEM
                </Button>
              </form>
            </div>
          </BlurFade>

        </div>
      </div>
    </main>
  );
}