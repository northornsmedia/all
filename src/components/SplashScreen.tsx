import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { HandwritingSvg } from "@/components/ui/handwriting-svg";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Automatically transition to hero after handwriting animation finishes
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(16px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black cursor-pointer select-none overflow-hidden"
      title="Click anywhere to continue"
    >
      {/* Soft circular glowing ambient backlight with zero hard box boundaries */}
      <div className="absolute w-[600px] h-[350px] rounded-full bg-rose-600/25 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
      <div className="absolute w-[380px] h-[220px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />

      {/* Pure, big handwritten "Northon's Media" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-center px-4"
      >
        <HandwritingSvg
          text="Northon's Media"
          width={840}
          height={240}
          fontSize={88}
          strokeWidth={2.4}
          duration={2.6}
          delay={0.2}
          className="text-rose-500"
          strokeClassName="drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]"
        />
      </motion.div>
    </motion.div>
  );
}

export default SplashScreen;
