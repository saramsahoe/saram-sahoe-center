import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function VisionHero() {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
          Research Center — People &amp; Society
        </p>

        {/* Signature element: calligraphy-style vision statement */}
        <figure className="mt-8">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card px-6 py-12 shadow-sm sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* Vertical brush rule */}
            <span
              aria-hidden="true"
              className="absolute inset-y-8 left-0 w-[3px] rounded-full bg-accent sm:inset-y-12"
            />
            <blockquote className="max-w-4xl">
              <p className="font-serif text-[1.75rem] leading-[1.45] font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[3.25rem] lg:leading-[1.35]">
                사람은{" "}
                <em className="relative inline-block not-italic">
                  <span className="relative z-10 text-accent">아름다운</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 z-0 h-[0.3em] bg-accent/15"
                  />
                </em>{" "}
                에너지 입니다
              </p>
            </blockquote>
            <figcaption className="mt-8 font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase">
              Our Vision
            </figcaption>
          </div>
        </figure>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-2xl font-heading text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            인간 중심의 기술과 사회적 가치를 탐구하는 연구공동체
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              asChild
            >
              <Link href="/about/research">
                연구 분야 살펴보기
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about/purpose">단체 목적</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
