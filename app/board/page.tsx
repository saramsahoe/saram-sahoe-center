import type { Metadata } from "next"

import { BoardView } from "@/components/board/board-view"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "게시판",
  description: `${siteConfig.name} 공지사항, 보도자료, 연구소식, 세미나 게시판입니다.`,
}

export default function BoardPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
            Board
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            게시판
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            공지사항, 보도자료, 연구 소식, 세미나 및 행사 안내를 확인하세요.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <BoardView />
      </section>
    </>
  )
}
