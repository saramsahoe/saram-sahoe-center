import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/navigation"

export function VisionHero() {
    return (
        <section className="border-b border-border bg-secondary/40">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <p className="font-mono text-[0.9375rem] uppercase tracking-[0.22em] text-accent">
                    {siteConfig.nameEn}
                </p>

                {/* Signature element: calligraphy-style vision statement */}
                <figure className="mt-8">
                    {/* 1. 카드 세로 크기 대폭 확대: py 여백을 기존보다 훨씬 크게(py-28, sm:py-36, lg:py-48) 늘려 로고가 세로로 안 잘리게 했습니다. */}
                    <div className="relative overflow-hidden rounded-lg border border-border bg-card px-6 py-28 shadow-sm sm:px-12 sm:py-36 lg:px-16 lg:py-48">

                        {/* 2. 가로 잘림 해결: 우측으로 밀어내던 translate-x-[18%]를 삭제하고, right-4 lg:right-12 를 주어 안전하게 우측 안쪽으로 배치했습니다. */}
                        <Image
                            aria-hidden="true"
                            src="/brand/logo-full.svg"
                            alt=""
                            width={480}
                            height={480}
                            className="pointer-events-none absolute right-4 top-1/2 z-0 h-auto w-[65%] max-w-[32rem] -translate-y-1/2 lg:right-12 opacity-[0.85] select-none"
                        />

                        {/* Vertical brush rule (카드 높이가 커진 만큼 선의 상하 여백도 살짝 넓혔습니다) */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-y-16 left-0 w-[3px] rounded-full bg-accent sm:inset-y-20 lg:inset-y-28"
                        />

                        <blockquote className="relative z-10 max-w-4xl">
                            <p className="text-balance font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.35]">
                                사람은{" "}
                                <em className="relative inline-block not-italic">
                  <span className="relative z-10 text-accent">
                    아름다운 에너지
                  </span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-0 bottom-1 z-0 h-[0.3em] bg-accent/15"
                                    />
                                </em>{" "}
                                입니다
                            </p>
                        </blockquote>
                        <figcaption className="relative z-10 mt-10 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                            Our Vision
                        </figcaption>
                    </div>
                </figure>

                <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <p className="max-w-2xl text-pretty font-heading text-base leading-relaxed text-muted-foreground sm:text-lg">
                        인간 중심의 기술과 사회적 가치를 탐구하는 교육 및 연구공동체
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            size="lg"
                            className="bg-button text-button-foreground hover:bg-button/90"
                            asChild
                        >
                            <Link href="/about/research">
                                사업 및 활동분야 살펴보기
                                <ArrowRight data-icon="inline-end" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/about/mission">목적 및 비전</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}