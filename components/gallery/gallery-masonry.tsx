"use client"

import { ImageIcon } from "lucide-react"

import type { GalleryPost } from "@/lib/gallery-content"

// 더 이상 masonry(컬럼당 세로로 쌓는 방식)가 아니라 일반 행 단위 grid다 —
// 컴포넌트/파일 이름은 호출부 변경을 줄이기 위해 그대로 두었다.
export function GalleryMasonry({
  posts,
  onSelect,
}: {
  posts: GalleryPost[]
  onSelect: (post: GalleryPost) => void
}) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        등록된 갤러리 게시글이 없습니다.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => {
        const cover = post.photos[0]

        return (
          <button
            key={post.id}
            type="button"
            onClick={() => onSelect(post)}
            className="block w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-accent/50"
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover.url} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon className="size-8" strokeWidth={1.5} />
              </div>
            )}
            <div className="flex flex-col gap-1 p-3">
              <p className="line-clamp-1 font-heading text-sm font-medium text-foreground">
                {post.title}
              </p>
              <p className="font-mono text-[0.6875rem] text-muted-foreground">
                {post.activityMonth}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
