"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  fallbackSrc?: string;
  alt: string;
  title?: string;
  subtitle?: string;
  url?: string;
  website?: string;
  meta?: { label: string; value: string }[];
  color?: string;
  genre?: string;
  audioPreview?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
  onSelect?: (index: number) => void;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.65,
  perspective = 2.8,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(240px, 24vw, 440px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  label = "Cover carousel",
  className,
  cardClassName,
  onSelect,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    startX: number;
    startPos: number;
    lastX: number;
    lastTime: number;
    v: number;
    moved: boolean;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const updateSelected = React.useCallback(
    (index: number) => {
      setSelected(index);
      if (onSelect) {
        onSelect(index);
      }
    },
    [onSelect]
  );

  // Paint straight to the DOM with GPU 3D transform matrices.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  // Enhanced smooth cubic-easing animation for fluid card gliding
  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      const nextIdx = indexAt(target);
      updateSelected(nextIdx);

      const startPos = posRef.current;
      const distance = target - startPos;

      if (Math.abs(distance) < 0.001) {
        posRef.current = target;
        paint();
        return;
      }

      const startTime = performance.now();
      // Smooth consistent glide duration
      const duration = Math.min(550, Math.max(360, Math.abs(distance) * 220));

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Fluid cubic-out easing formula: fast start, soft deceleration
        const ease = 1 - Math.pow(1 - progress, 3.2);

        posRef.current = startPos + distance * ease;
        paint();

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          posRef.current = target;
          paint();
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint, updateSelected],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  // Shortest ring delta navigation for direct card clicks (e.g. clicking 2nd card)
  const goTo = React.useCallback(
    (index: number) => {
      const currentSelected = indexAt(targetRef.current);
      let offset = index - currentSelected;
      if (loop) {
        if (offset > count / 2) offset -= count;
        if (offset < -count / 2) offset += count;
      }

      const target = targetRef.current + offset;
      settle(clamp(target));
    },
    [clamp, count, indexAt, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const currentRounded = Math.round(posRef.current);
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startPos: currentRounded,
      lastX: event.clientX,
      lastTime: performance.now(),
      v: 0,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 5) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const dt = Math.max(now - drag.lastTime, 1);
    drag.v = ((event.clientX - drag.lastX) / dt) * 1000;
    drag.lastX = event.clientX;
    drag.lastTime = now;

    // Constrain live drag visual offset to max 1 card so it never wildly skips
    const dragFraction = -dx / pitch;
    const boundedFraction = Math.max(-1.1, Math.min(1.1, dragFraction));
    
    posRef.current = clamp(drag.startPos + boundedFraction);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const wasMoved = drag.moved;
    const startBasePos = drag.startPos;
    const dx = event.clientX - drag.startX;
    const velocity = drag.v;
    dragRef.current = null;

    if (wasMoved) {
      // STRICT SINGLE-CARD ADVANCE LOGIC:
      // Always advances by exactly +1, -1, or 0 cards based on swipe direction & threshold
      let step = 0;
      if (dx < -30 || velocity < -200) {
        step = 1; // Dragged left -> advance to next card (+1)
      } else if (dx > 30 || velocity > 200) {
        step = -1; // Dragged right -> advance to previous card (-1)
      }

      const nextTarget = startBasePos + step;
      settle(clamp(nextTarget));
    }
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full select-none", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dragRef.current && dragRef.current.moved) return;
                    goTo(index);
                  }}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl will-change-transform cursor-pointer border border-white/10 transition-all duration-300 group hover:border-white/30",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  {/* Subtle gloss overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none z-10" />

                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (slide.fallbackSrc && target.src !== slide.fallbackSrc) {
                        target.src = slide.fallbackSrc;
                      }
                    }}
                    className="h-full w-full select-none object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* Bottom title & website overlay */}
                  {slide.title && (
                    <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/95 via-black/65 to-transparent z-20 flex flex-col items-start pointer-events-none">
                      <span className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-md">
                        {slide.title}
                      </span>
                      {slide.website && (
                        <span className="text-[10px] sm:text-xs text-zinc-300 font-mono truncate max-w-full">
                          {slide.website}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-3 sm:left-8 md:left-12 top-1/2 z-[300] -translate-y-1/2 rounded-full bg-black/70 hover:bg-black/95 p-3 text-white backdrop-blur-md shadow-2xl border border-white/15 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-3 sm:right-8 md:right-12 top-1/2 z-[300] -translate-y-1/2 rounded-full bg-black/70 hover:bg-black/95 p-3 text-white backdrop-blur-md shadow-2xl border border-white/15 transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-2 flex flex-col items-center px-6 duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="inline-flex items-center gap-2 mb-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
            {active.subtitle || "Platform Showcase"}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-center">
            {active.title}
          </h3>
          {active.alt && (
            <p className="mt-1 text-sm text-muted-foreground max-w-md text-center line-clamp-1">
              {active.alt}
            </p>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === selected
                  ? "w-8 bg-primary opacity-100 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                  : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/80 opacity-40 hover:opacity-100",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
