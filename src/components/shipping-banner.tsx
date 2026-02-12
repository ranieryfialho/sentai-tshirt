"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export function ShippingBanner() {
  const bannerContent = (
    <div className="flex items-center gap-8 mx-4">
      {/* Texto menor (text-xs) e ícone menor (w-3 h-3) para uma barra mais fina */}
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        <Truck className="w-3 h-3" />
        Frete Grátis para todo o Brasil
      </span>
      <span className="w-1 h-1 rounded-full bg-primary-foreground/50" />
    </div>
  );

  return (
    // AJUSTE AQUI: Mudei de py-3 para py-1.5 para ficar bem fininho
    <div className="w-full bg-primary overflow-hidden py-1.5 border-y border-white/10 relative z-20 shadow-sm">
      <div className="flex w-max">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex"
        >
          <div className="flex">
            {bannerContent}
            {bannerContent}
            {bannerContent}
            {bannerContent}
            {bannerContent}
            {bannerContent}
          </div>
          <div className="flex">
            {bannerContent}
            {bannerContent}
            {bannerContent}
            {bannerContent}
            {bannerContent}
            {bannerContent}
          </div>
        </motion.div>
      </div>
    </div>
  );
}