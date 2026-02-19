"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useState } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const isTouchOrSmallScreen = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isTouchOrSmallScreen);
    };
    
    checkDevice();
    
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
      }}
    >
      {/* @ts-expect-error: Conflito de tipagem entre React 19 e a biblioteca lenis legada */}
      {children}
    </ReactLenis>
  );
}