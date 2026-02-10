"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({ number = 40, className }: MeteorsProps) => {
  const meteors = new Array(number).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] rotate-[215deg]",
            
            // --- AJUSTES DE COR E OPACIDADE ---
            
            // LIGHT MODE (Suavizado):
            // bg-slate-800/40 -> Preto mas com 40% de transparência (mais sutil)
            // shadow-[...] -> Sombra bem leve
            "bg-slate-800/40 shadow-[0_0_0_1px_rgba(30,41,59,0.1)]",
            
            // DARK MODE (Corrigido):
            // dark:bg-slate-400/50 -> Cinza azulado (não branco puro), 50% opacidade
            // dark:shadow -> Sombra compatível
            "dark:bg-slate-400/50 dark:shadow-[0_0_0_1px_rgba(148,163,184,0.1)]",

            // --- CAUDA (TRAIL) ---
            
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r",
            
            // LIGHT TRAIL: Do preto suave (30%) para transparente
            "before:from-slate-800/30 before:to-transparent",
            
            // DARK TRAIL: Do cinza azulado (40%) para transparente (Evita o "risco de giz" branco)
            "dark:before:from-slate-400/40 dark:before:to-transparent",
            
            className
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (1200 - -800) + -800) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </>
  );
};