"use client";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { ALBUM_SLIDES } from "@/data/slidesData";

// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO
export default function DemoOne() {
  return (
    <div className="w-full overflow-hidden bg-background py-6">
      <CoverflowCarousel slides={ALBUM_SLIDES} showCaption showNavigation showPagination />
    </div>
  );
}
