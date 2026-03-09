"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SlideProps {
  id: number;
  title?: string;
  subtitle?: string;
  image: string;
  cta: string;
  link: string;
  position: string;
  imageClass?: string; 
}

const slides: SlideProps[] = [
  {
    id: 1,
    image: "/banners/mes_consumidor.jpeg", 
    cta: "GARANTIR MINHAS CAMISETAS",
    link: "/loja",
    position: "bottom-center",
    imageClass: "object-contain bg-black" 
  },
  {
    id: 2,
    image: "/banners/girl_power.jpeg", 
    cta: "VER COLEÇÃO",
    link: "/categoria/games", 
    position: "bottom-center",
    imageClass: "object-cover object-center"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 10000); 

    return () => clearInterval(timer);
  }, [current]);

  const getAlignmentClasses = (position: string) => {
    switch (position) {
      case "bottom-right":
        return "justify-end items-end text-right pb-32 md:pb-40 pr-4 md:pr-12";
      case "bottom-center":
        return "justify-end items-center text-center pb-24 md:pb-32";
      case "center":
      default:
        return "justify-center items-center text-center";
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden border-b border-white/10 group bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
          
          <img 
            src={slides[current].image} 
            alt={`Banner ${current + 1}`} 
            className={`w-full h-full ${slides[current].imageClass || 'object-cover object-center'}`}
          />
        </motion.div>
      </AnimatePresence>

      <div className={`absolute inset-0 z-20 container mx-auto px-4 flex flex-col ${getAlignmentClasses(slides[current].position)} pointer-events-none`}>
        <motion.div
          key={`text-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl w-full pointer-events-auto flex flex-col items-center"
        >
          {slides[current].title && (
            <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-4 leading-tight tracking-tighter drop-shadow-2xl text-center">
              {slides[current].title}
            </h1>
          )}
          {slides[current].subtitle && (
            <p className="text-base md:text-xl text-gray-100 mb-8 font-light tracking-wide drop-shadow-lg max-w-2xl mx-auto text-center">
              {slides[current].subtitle}
            </p>
          )}
          
          <Link href={slides[current].link}>
            <Button className="h-12 md:h-14 px-8 md:px-12 text-base md:text-lg rounded-full font-bold bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20">
              {slides[current].cta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <button onClick={prev} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100">
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button onClick={next} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100">
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir para o slide ${idx + 1}`}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ease-in-out ${
              idx === current ? "bg-white w-8 md:w-10" : "bg-white/40 hover:bg-white/70 w-2 md:w-2.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}