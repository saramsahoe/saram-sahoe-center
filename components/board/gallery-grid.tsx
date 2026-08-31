"use client"

import { Image as ImageIcon, Pin, PlayCircle } from "lucide-react"

import { extractGalleryMedia, type Post } from "@/lib/board-content"
import { cn } from "@/lib/utils"

const MAX_PREVIEW_ITEMS = 4

export function GalleryGrid({
  posts,
  onSelect,
}: {
  posts: Post[]
  onSelect: (post: Post) => void
}) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        검색 결과가 없습니다.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const media = extractGalleryMedia(post.content)
        const preview = media.slice(0, MAX_PREVIEW_ITEMS)
        const remaining = media.length - preview.length

        return (
          <button
            key={post.id}
            type="button"
            onClick={() => onSelect(post)}
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border text-left transition-colors",
              post.pinned
                ? "border-accent/40 bg-accent/5"
                : "border-border bg-card hover:border-accent/50"
            )}
          >
            {preview.length > 0 ? (
              <div
                className={cn(
                  "grid gap-0.5 bg-border",
                  preview.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}
              >
                {preview.map((item, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.type === "image" ? item.url : item.thumbnailUrl}
                      alt=""
                      className="size-full object-cover"
                      loading="lazy"
                    />
                    {item.type === "youtube" && (
                      <PlayCircle
                        className="absolute inset-0 m-auto size-8 text-white drop-shadow-md"
                        strokeWidth={1.5}
                      />
                    )}
                    {index === preview.length - 1 && remaining > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/55 font-mono text-sm text-white">
                        +{remaining}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
                <ImageIcon className="size-8" strokeWidth={1.5} />
              </div>
            )}
            <div className="flex flex-col gap-1 p-3">
              <div className="flex items-center gap-1.5">
                {post.pinned && (
                  <Pin className="size-3 shrink-0 text-accent" strokeWidth={1.75} />
                )}
                <p className="line-clamp-1 font-heading text-sm font-medium text-foreground">
                  {post.title}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[0.6875rem] text-muted-foreground">
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span>조회 {post.views.toLocaleString()}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
