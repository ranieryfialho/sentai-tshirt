"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function SmoothCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // Novo estado para detectar links/botões

  // Física "Smart & Fast" (Mantida)
  const springConfig = { damping: 50, stiffness: 1000 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Lógica de Detecção de Hover (Inteligência)
      const target = e.target as HTMLElement;
      
      // Verifica se o elemento (ou pai) é interativo
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a');

      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        x: "-2px", // Ajuste fino da ponta
        y: "-2px",
      }}
    >
      <motion.div
        animate={{
          // Se estiver clicando: diminui (0.8)
          // Se estiver sobre um link/botão (Hover): aumenta um pouco (1.2)
          // Estado normal: 1
          scale: isClicking ? 0.8 : (isHovering ? 1.2 : 1),
          rotate: isHovering ? -15 : 0, // Leve inclinação ao passar sobre links para dar dinamismo
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* SVG Seta Outline */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <motion.path
            d="M5.5 3.5L19 10.5L11.5 12.5L10 19L3 5.5L5.5 3.5Z"
            // Cores dinâmicas:
            // Normal: Preto transparente com borda Branca
            // Hover (Link): Fica sólido (Primary Color) para indicar ação
            fill={isHovering ? "rgba(59, 130, 246, 0.8)" : "rgba(0,0,0,0.4)"} 
            stroke={isHovering ? "rgba(59, 130, 246, 1)" : "white"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              fill: isHovering ? "rgba(37, 99, 235, 0.6)" : "rgba(0,0,0,0.4)",
              stroke: isHovering ? "rgba(96, 165, 250, 1)" : "white"
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}