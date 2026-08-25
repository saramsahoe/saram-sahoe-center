import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { termsSections } from "@/lib/legal-content"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "이용약관",
  description: `${siteConfig.name} 웹사이트 이용약관입니다.`,
}

export default function TermsPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
            Terms of Service
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            이용약관
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            시행일: 2026년 1월 1일
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-10">
          {termsSections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {section.heading}
              </h2>
              <Separator className="mt-3 mb-4" />
              <div className="flex flex-col gap-2">
                {section.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
