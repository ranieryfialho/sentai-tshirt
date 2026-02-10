import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { SmoothCursor } from "@/components/magicui/smooth-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CartSheet } from "@/components/cart/cart-sheet";

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
          <SmoothCursor />
          <AnimatedBackground />
          <CartSheet />

          <SmoothScroll>
            <Header />
            <div className="flex-1 relative z-10">
              {children}
            </div>
            <Footer />
          </SmoothScroll>
          
        </ThemeProvider>
      </body>
    </html>
  );
}