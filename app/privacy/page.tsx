import type { Metadata } from "next"

import { getSiteSettings } from "@/app/actions/site-settings"
import { PostMarkdown } from "@/components/board/post-markdown"
import { Separator } from "@/components/ui/separator"
import { privacySections } from "@/lib/legal-content"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${siteConfig.name} 개인정보처리방침입니다.`,
}

// 관리자 > 사이트 설정에서 수정한 내용(마크다운)을 보여준다. 조회 실패 시에는
// lib/legal-content.ts의 기존 내용으로 대체한다.
const FALLBACK_CONTENT = privacySections
  .map(
    (section) =>
      `## ${section.heading}\n\n${section.body.map((line) => `- ${line}`).join("\n")}`
  )
  .join("\n\n")

export default async function PrivacyPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.22em] text-accent">
            Privacy Policy
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            개인정보처리방침
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            {siteConfig.name}(이하 &apos;센터&apos;)는 이용자의 개인정보를
            중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
            시행일: 2026년 1월 1일
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-10">
          <PostMarkdown content={settings?.privacyContent || FALLBACK_CONTENT} />

          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              개인정보 보호책임자
            </h2>
            <Separator className="mt-3 mb-4" />
            <dl className="flex flex-col gap-1.5 text-[0.9375rem] text-muted-foreground">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-foreground/70">담당</dt>
                <dd>{siteConfig.representative}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-foreground/70">이메일</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-foreground/70">전화</dt>
                <dd>{siteConfig.phone}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
