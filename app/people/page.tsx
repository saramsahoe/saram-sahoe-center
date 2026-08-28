import type { Metadata } from "next"

import { MembersDirectory } from "@/components/people/members-directory"
import { OrgChart } from "@/components/people/org-chart"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "함께하는 사람들",
  description: `${siteConfig.name} 구성원을 소개합니다.`,
}

export default function PeoplePage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
            People
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            함께하는 사람들
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            연구센터사람과사회를 함께 만들어가는 대표, 센터장, 교수진, 연구원,
            연구보조원을 소개합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <MembersDirectory />

        <Separator className="my-16" />

        <div>
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-accent uppercase">
            Organization
          </span>
          <h2 className="mt-3 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
            조직도
          </h2>
          <div className="mt-8">
            <OrgChart />
          </div>
        </div>
      </section>
    </>
  )
}
