import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { FavoritesSheet } from "@/components/favorites/favorites-sheet";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SmoothCursor } from "@/components/magicui/smooth-cursor";
import { Toaster } from "@/components/ui/sonner";
import { Meteors } from "@/components/magicui/meteors";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space-grotesk" 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains-mono" 
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sentai Tshirt",
    default: "Sentai Tshirt - A Loja Oficial do Geek",
  },
  description: "Moda Geek, Anime, Tokusatsu e muito mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden h-full w-full bg-background">
                <Meteors number={30} />
            </div>

            <SmoothScroll>
              <SmoothCursor />
              <CartSheet />
              <FavoritesSheet />
              <Toaster />

              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}