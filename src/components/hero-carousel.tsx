"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "VISTA SUA PAIXÃO GEEK",
    subtitle: "A maior coleção de estampas exclusivas do Brasil.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
    cta: "Explorar Loja",
    link: "/categoria/camisetas"
  },
  {
    id: 2,
    title: "LEVEL UP NO SEU ESTILO",
    subtitle: "Camisetas inspiradas nos maiores clássicos dos games.",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2665&auto=format&fit=crop",
    cta: "Ver Coleção Games",
    link: "/categoria/camisetas?filter=games"
  },
  {
    id: 3,
    title: "MODO OTATKU: ATIVADO",
    subtitle: "Do Shonen ao Seinen, vista seu anime favorito.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2670&auto=format&fit=crop",
    cta: "Ver Coleção Animes",
    link: "/categoria/camisetas?filter=animes"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden border-b border-white/10 group bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src={slides[current].image} 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-center items-center text-center">
        <motion.div
          key={`text-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 leading-none tracking-tighter drop-shadow-xl">
            {slides[current].title}
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 font-light tracking-wide">
            {slides[current].subtitle}
          </p>
          <Link href={slides[current].link}>
            <Button className="h-14 px-10 text-lg rounded-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-transform hover:scale-105">
              {slides[current].cta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100">
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? "bg-primary w-8" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}