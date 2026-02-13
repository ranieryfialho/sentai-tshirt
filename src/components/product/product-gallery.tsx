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
      <div className="aspect-square relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl shadow-black/20 group">
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
          <div className="absolute top-6 right-6 bg-secondary text-white font-bold px-4 py-2 rounded-full shadow-lg border border-white/10 backdrop-blur-md z-10">
            -{discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button 
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex-shrink-0 w-24 h-24 rounded-xl border overflow-hidden transition-all bg-white/5 relative",
                selectedIndex === idx 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-white/10 hover:border-white/30"
              )}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
              {selectedIndex === idx && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}