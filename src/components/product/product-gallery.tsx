"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  discountPercentage: number;
}

export function ProductGallery({ images, discountPercentage }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = images[selectedIndex]?.src || "/placeholder.png";

  return (
    <div className="space-y-4">
      {/* Imagem Principal: bg e border dinâmicos */}
      <div className="aspect-square relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-2xl shadow-black/20 group">
        <AnimatePresence mode="wait">
          <motion.img 
            key={selectedIndex}
            src={currentImage} 
            alt="Product Image"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {discountPercentage > 0 && (
          <div className="absolute top-6 right-6 bg-secondary text-white font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 backdrop-blur-md z-10">
            -{discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Miniaturas: bg e border dinâmicos */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button 
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex-shrink-0 w-24 h-24 rounded-xl border overflow-hidden transition-all bg-black/5 dark:bg-white/5 relative",
                selectedIndex === idx 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
              )}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}