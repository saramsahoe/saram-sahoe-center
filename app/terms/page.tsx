import type { Metadata } from "next"

import { getSiteSettings } from "@/app/actions/site-settings"
import { PostMarkdown } from "@/components/board/post-markdown"
import { termsSections } from "@/lib/legal-content"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "이용약관",
  description: `${siteConfig.name} 웹사이트 이용약관입니다.`,
}

// 관리자 > 사이트 설정에서 수정한 내용(마크다운)을 보여준다. 조회 실패 시에는
// lib/legal-content.ts의 기존 내용으로 대체한다.
const FALLBACK_CONTENT = termsSections
  .map((section) => `## ${section.heading}\n\n${section.body.join("\n\n")}`)
  .join("\n\n")

export default async function TermsPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.22em] text-accent">
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
        <PostMarkdown content={settings?.termsContent || FALLBACK_CONTENT} />
      </section>
    </>
  )
}
