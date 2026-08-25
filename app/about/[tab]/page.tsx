import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AboutTabs, type AboutTab } from "@/components/about/about-tabs"

const tabCopy: Record<AboutTab, { label: string; description: string }> = {
  mission: {
    label: "단체 목적",
    description: "연구센터 사람과 사회가 이 일을 하는 이유를 소개합니다.",
  },
  research: {
    label: "사업 및 활동분야",
    description: "노동, 돌봄, 지역 공동체를 축으로 한 사업 및 활동분야를 소개합니다.",
  },
  history: {
    label: "연혁",
    description: "연구센터 사람과 사회가 지금까지 걸어온 길을 소개합니다.",
  },
}

export function generateStaticParams() {
  return Object.keys(tabCopy).map((tab) => ({ tab }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tab: string }>
}): Promise<Metadata> {
  const { tab } = await params
  const copy = tabCopy[tab as AboutTab]

  if (!copy) {
    return {}
  }

  return { title: copy.label, description: copy.description }
}

export default async function AboutTabPage({
  params,
}: {
  params: Promise<{ tab: string }>
}) {
  const { tab } = await params
  const copy = tabCopy[tab as AboutTab]

  if (!copy) {
    notFound()
  }

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
            About Us
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            연구센터 사람과 사회를 소개합니다
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            우리가 이 일을 하는 이유, 지금 다루고 있는 연구 주제, 그리고
            지금까지 걸어온 길을 한 곳에서 확인하세요.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <AboutTabs activeTab={tab as AboutTab} />
      </section>
    </>
  )
}
