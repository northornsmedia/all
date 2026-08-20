import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { SplashScreen } from "@/components/SplashScreen";

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col relative overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Animated Handwriting SVG Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Floating Replay Splash Button in Top Corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40">
        <button
          onClick={() => setShowSplash(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 text-xs font-medium backdrop-blur-md transition-all shadow-lg"
          title="Replay Intro Splash"
        >
          <RotateCcw className="size-3 text-purple-400" />
          <span>Replay Splash</span>
        </button>
      </div>

      {/* Pure Hero Coverflow View */}
      <main className="flex-1 flex flex-col justify-center">
        <HeroSection />
      </main>
    </div>
  );
}

export default App;
