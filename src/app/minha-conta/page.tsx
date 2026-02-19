"use client";

import Link from "next/link";
import { User, Heart, Package, Settings, LogOut, ExternalLink } from "lucide-react";

export default function MinhaContaPage() {
  const nuvemshopAuthUrl = "https://sentaitshirt.lojavirtualnuvem.com.br/account/login/";

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
       <div className="text-xs text-muted-foreground uppercase tracking-wider mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="font-semibold text-foreground">Minha Conta</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 flex items-center gap-4 border-b">
              <div className="w-12 h-12 rounded-full border bg-muted flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Bem-vindo(a),</p>
                <p className="font-medium text-lg leading-tight">Visitante</p>
              </div>
            </div>

            <nav className="p-4 flex flex-col gap-1">
              <Link
                href="/favoritos"
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <Heart className="w-5 h-5" />
                Meus Favoritos
              </Link>

              <div className="flex items-center gap-3 w-full p-3 rounded-lg bg-primary text-primary-foreground transition-colors text-sm font-medium">
                <Package className="w-5 h-5" />
                Meus Pedidos
              </div>

              <a
                href={nuvemshopAuthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Dados Pessoais
                </div>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </nav>

            <div className="p-4 border-t">
              <a 
                href={nuvemshopAuthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <LogOut className="w-5 h-5" />
                Fazer Login / Cadastrar
              </a>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl md:text-4xl font-light mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground mb-8">
              Acompanhe o status das suas compras recentes.
            </p>

            <div className="border border-muted rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-foreground opacity-80" />
              </div>
              <h2 className="text-2xl font-light mb-4">Acompanhe seus Pedidos</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                Para garantir a máxima segurança dos seus dados pessoais e de pagamento, o histórico detalhado das suas compras é gerenciado no nosso <strong className="font-semibold text-foreground">Portal do Cliente Seguro</strong>.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                </div>
                Ambiente Protegido pela Nuvemshop
              </div>

              <a 
                href={nuvemshopAuthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 py-4 rounded-md transition-colors uppercase text-sm tracking-wider flex items-center gap-2"
              >
                Acessar Meus Pedidos
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <p className="text-xs text-muted-foreground mt-4">
                Você será redirecionado para uma nova aba.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}