import Link from "next/link";
import { CreditCard, Instagram, Facebook, Twitter, Smartphone } from "lucide-react"; // Se não tiver Twitter, pode usar X ou remover

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-slate-50 dark:bg-black/50 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <span className="font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                Sentai<span className="text-primary">Tshirt</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Sua loja especializada em cultura pop, geek e tokusatsu. 
              Vista sua paixão com qualidade e estilo exclusivo.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors bg-background border border-border p-2 rounded-full hover:border-primary/50">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors bg-background border border-border p-2 rounded-full hover:border-primary/50">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors bg-background border border-border p-2 rounded-full hover:border-primary/50">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Institucional */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Institucional</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="text-muted-foreground hover:text-primary transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/personalizados" className="text-muted-foreground hover:text-primary transition-colors">
                  Pedidos Personalizados
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Categorias */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Explorar</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/categoria/camisetas" className="text-muted-foreground hover:text-primary transition-colors">
                  Camisetas
                </Link>
              </li>
              <li>
                <Link href="/categoria/colecionaveis" className="text-muted-foreground hover:text-primary transition-colors">
                  Colecionáveis
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-muted-foreground hover:text-primary transition-colors">
                  Últimos Lançamentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Pagamento e Segurança */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Pagamento Seguro</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-7 bg-white rounded border border-gray-200" title="Cartão de Crédito">
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex items-center justify-center w-10 h-7 bg-white rounded border border-gray-200" title="Pix">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              {/* Você pode adicionar SVGs reais de bandeiras aqui se quiser */}
            </div>
            
            <h3 className="font-bold text-foreground mb-2 text-xs uppercase tracking-wider">Atendimento</h3>
            <p className="text-sm text-muted-foreground">
              Seg. a Sex. das 9h às 18h<br />
              sentaitshirt@gmail.com
            </p>
          </div>

        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} Sentai Tshirt. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <span>Desenvolvido com</span>
            <span className="text-red-500">♥</span>
            <span>para fãs.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}