import { Meteors } from "@/components/magicui/meteors";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none transition-colors duration-500">

      <div className="absolute inset-0 bg-white dark:bg-background transition-colors duration-500" />

      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-black" />
      
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <Meteors number={40} />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-0 dark:opacity-30 transition-opacity duration-500">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div 
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-20 brightness-100 contrast-150 mix-blend-overlay"
      ></div>
    </div>
  );
}