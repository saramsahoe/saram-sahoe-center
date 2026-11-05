import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/navigation"

export function VisionHero() {
    return (
        <section className="border-b border-border bg-secondary/40">
            <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <p className="font-mono text-[0.9375rem] tracking-[0.22em] text-accent">
                    {siteConfig.nameEn}
                </p>

                {/* Signature element: calligraphy-style vision statement */}
                <figure className="mt-8">
                    {/* 카드 세로 크기 대폭 확대: py 여백을 기존보다 훨씬 크게(py-28, sm:py-36, lg:py-48) 늘려 로고가 세로로 안 잘리게 했습니다.
                        isolate: 이 카드 내부(로고 이미지 + 텍스트)끼리만 mix-blend-mode가 적용되도록 격리한다.
                        이게 없으면 블렌딩이 카드 바깥(상단 헤더 배경 등)까지 영향을 미치거나, 반대로
                        전혀 적용되지 않는 것처럼 보일 수 있다. */}
                    <div className="relative isolate overflow-hidden rounded-lg border border-border bg-card px-6 py-28 shadow-sm sm:px-12 sm:py-36 lg:px-16 lg:py-48">

                        {/* 로고를 더 작게, 더 오른쪽으로 당겨 배치 — overflow-hidden이 카드 밖으로
                            나가는 부분을 잘라준다. 텍스트와 겹치는 부분은 아래 mix-blend-mode가
                            자동으로 처리한다. */}
                        <Image
                            aria-hidden="true"
                            src="/brand/logo-without-copywriting.svg"
                            alt=""
                            width={480}
                            height={480}
                            className="pointer-events-none absolute -right-2 top-1/2 z-0 h-auto w-[42%] max-w-[18rem] -translate-y-1/2 select-none lg:-right-6 lg:max-w-[22rem]"
                        />

                        {/* Vertical brush rule (카드 높이가 커진 만큼 선의 상하 여백도 살짝 넓혔습니다) */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-y-16 left-0 w-[3px] rounded-full bg-accent sm:inset-y-20 lg:inset-y-28"
                        />

                        {/* z-10을 주지 않는 게 중요하다: z-index가 있으면 blockquote 자신이
                            새 스태킹 컨텍스트를 만들어버려서, 안의 mix-blend-mode 글씨가 카드
                            배경·로고까지 내려다보지 못하고 늘 흰색으로만 보이게 된다. position만
                            relative로 둬서 "레벨 0" 포지션 요소로만 참여시키고, DOM 순서가
                            로고(앞) → blockquote(뒤)이기 때문에 z-index 없이도 텍스트가 로고
                            위에 그려진다. */}
                        <blockquote className="relative max-w-4xl">
                            {/* 로고와 겹쳐도 글씨가 묻히지 않도록 mix-blend-mode로 배경색을 자동
                                반전시킨다 — 밝은 카드 배경 위에서는 그대로 어둡게, 로고의 어두운
                                부분과 겹치면 자동으로 밝게 보인다. 강조색이 있는 "아름다운 에너지"
                                부분은 고유 색을 유지하려고 이 처리에서 제외했다. */}
                            <p className="text-balance font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.35]">
                                <span className="text-white mix-blend-difference">
                                    사람은
                                </span>{" "}
                                <em className="relative inline-block not-italic">
                  <span className="relative z-10 text-accent">
                    아름다운 에너지
                  </span>
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-x-0 bottom-1 z-0 h-[0.3em] bg-accent/15"
                                    />
                                </em>{" "}
                                <span className="text-white mix-blend-difference">
                                    입니다
                                </span>
                            </p>
                        </blockquote>
                        <figcaption className="relative z-10 mt-10 font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.18em] text-muted-foreground">
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