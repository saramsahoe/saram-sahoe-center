import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { mainNav } from "@/lib/navigation"

const focusAreas = [
  {
    tag: "Labor",
    title: "노동과 삶의 조건",
    body: "불안정 노동의 확산이 개인의 생애 설계와 지역 공동체에 남기는 흔적을 추적합니다.",
  },
  {
    tag: "Care",
    title: "돌봄의 사회적 재구성",
    body: "가족 안에 갇혀 있던 돌봄을 공적 제도와 관계망의 문제로 다시 읽습니다.",
  },
  {
    tag: "Community",
    title: "지역과 공동체",
    body: "축소되는 지역에서 사람들이 서로를 지탱하는 방식을 현장 조사로 기록합니다.",
  },
]

export default function Page() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
              Research Center — Est. 2026
            </p>
            <h1 className="mt-6 font-heading text-4xl leading-[1.15] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              사람에서 시작해, 사회를 다시 읽습니다
            </h1>
            <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground sm:text-base">
              연구센터 사람과 사회는 노동, 돌봄, 지역 공동체를 축으로 한국 사회의
              변화를 기록하는 독립 연구 기관입니다. 현장의 목소리와 학술적 방법을
              함께 두고, 공적 논의에 필요한 근거를 만듭니다.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/research">
                  연구 분야 살펴보기
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/mission">단체 목적</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            주요 연구 축
          </h2>
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
            Focus Areas
          </span>
        </div>

        <Separator className="mt-6" />

        <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <li key={area.tag} className="bg-background p-6 lg:p-8">
              <span className="inline-flex items-center rounded-sm bg-info/10 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-info uppercase">
                {area.tag}
              </span>
              <h3 className="mt-5 font-heading text-base font-semibold tracking-tight text-foreground">
                {area.title}
              </h3>
              <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
                {area.body}
              </p>
            </li>
          ))}
        </ul>

        <nav aria-label="빠른 이동" className="mt-16">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-heading text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  )
}
