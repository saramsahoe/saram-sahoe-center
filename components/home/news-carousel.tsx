"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { newsSlides } from "@/lib/home-content"

export function NewsCarousel() {
  const [index, setIndex] = useState(0)
  const slide = newsSlides[index]

  function goTo(next: number) {
    setIndex((next + newsSlides.length) % newsSlides.length)
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            소식
          </h2>
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
            Latest News
          </span>
        </div>

        <Separator className="mt-6" />

        <div className="relative mt-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted sm:aspect-[21/9]">
            <Image
              key={slide.id}
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
            />

            <span className="absolute top-4 left-4 inline-flex items-center rounded-sm bg-accent px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-accent-foreground uppercase sm:top-6 sm:left-6">
              {slide.category}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
              <p className="font-mono text-[0.625rem] tracking-[0.18em] text-white/70 uppercase">
                {slide.date}
              </p>
              <h3 className="mt-2 max-w-2xl font-heading text-lg leading-snug font-semibold text-balance text-white sm:text-2xl">
                {slide.title}
              </h3>
              <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-pretty text-white/80 sm:block">
                {slide.summary}
              </p>
            </div>

            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2 sm:px-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur hover:bg-background"
                onClick={() => goTo(index - 1)}
                aria-label="이전 소식"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur hover:bg-background"
                onClick={() => goTo(index + 1)}
                aria-label="다음 소식"
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {newsSlides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 소식 보기: ${item.title}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
