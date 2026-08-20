import React, { useState } from "react";
import { Copy, Check, ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { ALBUM_SLIDES } from "@/data/slidesData";

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // High-performance 3D carousel full-viewport configuration
  const rotate = 44;
  const depth = 0.65;
  const perspective = 2.8;
  const cardWidth = "clamp(240px, 24vw, 440px)";

  const activeSlide = ALBUM_SLIDES[activeIndex] || ALBUM_SLIDES[0];

  const handleCopyLink = () => {
    const urlToCopy = activeSlide.url || `https://${activeSlide.website || "northonsmedia.com"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
    const urlToVisit = activeSlide.url || `https://${activeSlide.website || "northonsmedia.com"}`;
    window.open(urlToVisit, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative min-h-screen w-full w-screen flex flex-col items-center justify-center pt-8 pb-12 overflow-hidden bg-black select-none">
      {/* Massive ambient glowing backdrop spanning full viewport width */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1400px] h-[550px] rounded-full blur-[160px] opacity-35 transition-all duration-1000 ease-out"
        style={{
          backgroundColor: activeSlide.color || "#8b5cf6",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />

      {/* Big Headline: Northon's Media */}
      <div className="relative w-full max-w-5xl px-4 mx-auto flex flex-col items-center text-center z-30 mb-6">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white">
          <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]">
            Northon's Media
          </span>
        </h1>
      </div>

      {/* Full Screen Width 3D Coverflow Carousel */}
      <div className="w-full w-screen max-w-none relative z-20 py-2 overflow-hidden px-0">
        <CoverflowCarousel
          slides={ALBUM_SLIDES}
          rotate={rotate}
          depth={depth}
          perspective={perspective}
          cardWidth={cardWidth}
          showCaption={false}
          showPagination={false}
          showNavigation={false}
          onSelect={(index) => {
            setActiveIndex(index);
            setCopied(false);
          }}
          className="w-full w-screen max-w-none"
          cardClassName="shadow-[0_30px_70px_-10px_rgba(0,0,0,0.95)] hover:border-white/30 transition-all duration-300"
        />
      </div>

      {/* Info & Action Buttons Below Card (Mock Name, Linked Website, Copy Link, Visit) */}
      <div className="relative z-30 mt-6 flex flex-col items-center text-center px-4 animate-in fade-in duration-300">
        {/* Mock Name Title */}
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
          {activeSlide.title}
        </h3>

        {/* Linked Website URL display */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 font-mono mb-5">
          <Globe className="size-3.5 text-purple-400" />
          <span className="hover:text-white transition-colors">
            {activeSlide.url || `https://${activeSlide.website}`}
          </span>
        </div>

        {/* Two Buttons: Copy link & Visit */}
        <div className="flex items-center justify-center gap-3.5">
          {/* Copy link button */}
          <Button
            variant="outline"
            size="default"
            onClick={handleCopyLink}
            className="gap-2 rounded-full px-6 bg-zinc-900/90 border-white/15 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs sm:text-sm font-medium backdrop-blur-md transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="size-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-4 text-zinc-400" />
                <span>Copy link</span>
              </>
            )}
          </Button>

          {/* Visit button */}
          <Button
            variant="glow"
            size="default"
            onClick={handleVisit}
            className="gap-2 rounded-full px-7 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-medium text-xs sm:text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Visit</span>
            <ExternalLink className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
