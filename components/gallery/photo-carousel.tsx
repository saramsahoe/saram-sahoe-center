"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { GalleryPhoto } from "@/lib/gallery-content"

/** 사진을 카드처럼 한 장씩 좌우로 넘겨 보는 캐러셀 (스와이프/버튼 둘 다 지원). */
export function PhotoCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function scrollToIndex(index: number) {
    const el = scrollerRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(index, photos.length - 1))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" })
  }

  function handleScroll() {
    const el = scrollerRef.current
    if (!el || el.clientWidth === 0) return
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (photos.length === 0) return null

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={photo.path}
            src={photo.url}
            alt=""
            className="aspect-[4/3] w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="이전 사진"
            className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70 disabled:opacity-0"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === photos.length - 1}
            aria-label="다음 사진"
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70 disabled:opacity-0"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            {photos.map((photo, index) => (
              <span
                key={photo.path}
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  index === activeIndex ? "bg-accent" : "bg-border"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
