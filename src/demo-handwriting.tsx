"use client";

import { HandwritingSvg } from "@/components/ui/handwriting-svg";

export default function HandwritingDemo() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center bg-black p-8 rounded-2xl">
      <HandwritingSvg
        text="Northon's Media"
        width={380}
        height={160}
        fontSize={72}
        strokeWidth={2}
        duration={2.5}
        className="text-pink-400"
      />
    </div>
  );
}
