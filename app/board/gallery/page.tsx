import type { Metadata } from "next"

import { getPosts } from "@/app/actions/board"
import { getMyProfile } from "@/app/actions/profile"
import { BoardView } from "@/components/board/board-view"
import { UpgradeRequiredNotice } from "@/components/board/upgrade-required-notice"
import { mockPosts } from "@/lib/board-content"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "갤러리",
  description: `${siteConfig.name} 활동 사진과 영상을 모아보는 갤러리입니다.`,
}

export default async function BoardGalleryPage() {
  const profile = await getMyProfile()
  if (!profile || profile.role === "user") {
    return <UpgradeRequiredNotice />
  }

  const posts = await getPosts()

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
            Gallery
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            갤러리
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            행사와 활동 현장의 사진, 영상을 모아봅니다. 게시판의 다른 글도 여기서 함께 확인할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <BoardView initialPosts={posts ?? mockPosts} initialCategory="gallery" />
      </section>
    </>
  )
}
