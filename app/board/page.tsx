import type { Metadata } from "next"

import { getPosts } from "@/app/actions/board"
import { getMyProfile } from "@/app/actions/profile"
import { BoardView } from "@/components/board/board-view"
import { PostsLoadError } from "@/components/board/posts-load-error"
import { siteConfig } from "@/lib/navigation"

export const metadata: Metadata = {
  title: "게시판",
  description: `${siteConfig.name} 공지사항, 보도자료, 소식, 세미나 게시판입니다.`,
}

// 비회원/일반회원은 공개글만, 정회원은 전체 글을 볼 수 있다 — 이 구분은
// posts RLS(posts_select_public_or_member, supabase/board_public_gallery_open.sql)가
// 알아서 걸러주므로, 페이지에서는 더 이상 접근 자체를 막지 않는다.
export default async function BoardPage() {
  const profile = await getMyProfile()
  const posts = await getPosts()
  const isAdmin = profile?.role === "admin"

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.22em] text-accent">
            Board
          </p>
          <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            게시판
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
              공지사항, 보도자료, 소식, 세미나 및 행사 안내를 확인하세요.
          </p>
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
                2026년도 이전 자료에 대한 문의는 contact@saramsahoe.org로 해주시기 바랍니다.
            </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {posts ? (
          <BoardView initialPosts={posts} isAdmin={isAdmin} />
        ) : (
          <PostsLoadError />
        )}
      </section>
    </>
  )
}
