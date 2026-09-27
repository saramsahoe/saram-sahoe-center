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
                    {/* 1. 카드 크기 확대: py-12 -> py-20, py-16 -> py-24, py-20 -> py-32 로 위아래 여백을 대폭 늘렸습니다 */}
                    <div className="relative overflow-hidden rounded-lg border border-border bg-card px-6 py-20 shadow-sm sm:px-12 sm:py-24 lg:px-16 lg:py-32">

                        {/* 2. 로고 뚜렷하게: opacity-[0.6] -> opacity-[0.85] (또는 opacity-100)으로 변경하고 크기도 살짝 키웠습니다 */}
                        <Image
                            aria-hidden="true"
                            src="/brand/logo-full.svg"
                            alt=""
                            width={480}
                            height={480}
                            className="pointer-events-none absolute right-0 top-1/2 z-0 h-auto w-[65%] max-w-[32rem] -translate-y-1/2 translate-x-[18%] opacity-[0.85] select-none"
                        />

                        {/* Vertical brush rule (왼쪽 세로 선 길이도 카드 크기에 맞게 조금 조정했습니다) */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-y-12 left-0 w-[3px] rounded-full bg-accent sm:inset-y-16"
                        />

                        <blockquote className="relative z-10 max-w-4xl">
                            {/* 3. 텍스트 크기 확대: 카드가 커진 만큼 글씨도 더 크게 조정했습니다 (text-4xl, 5xl, 6xl) */}
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