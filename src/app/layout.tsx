import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Meteors } from "@/components/magicui/meteors";
import { SmoothCursor } from "@/components/magicui/smooth-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CartSheet } from "@/components/cart/cart-sheet";
import { FavoritesSheet } from "@/components/favorites/favorites-sheet"; // ⭐ NOVO

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Sentai Tshirt",
  description: "Loja Geek/Gamer Headless",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col selection:bg-primary selection:text-white cursor-none",
          inter.variable,
          jetbrainsMono.variable,
          spaceGrotesk.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* BACKGROUND FIXO */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-white dark:bg-background transition-colors duration-500" />
            <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-black" />
            <Meteors number={40} />
            <div className="absolute inset-0 overflow-hidden opacity-0 dark:opacity-30 transition-opacity duration-500">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
          </div>

          <SmoothCursor />
          <CartSheet />
          <FavoritesSheet /> {/* ⭐ NOVO */}

          {/* CONTEÚDO NA FRENTE */}
          <div className="relative z-10">
            <SmoothScroll>
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </SmoothScroll>
          </div>
          
        </ThemeProvider>
      </body>
    </html>
  );
}