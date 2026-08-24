"use client"

import { Paperclip, Pin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { categoryMeta, type Post } from "@/lib/board-content"
import { cn } from "@/lib/utils"

export function PostList({
  pinnedPosts,
  posts,
  startNo,
  onSelect,
}: {
  pinnedPosts: Post[]
  posts: Post[]
  startNo: number
  onSelect: (post: Post) => void
}) {
  const allPosts = [...pinnedPosts, ...posts]

  if (allPosts.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        검색 결과가 없습니다.
      </p>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th
                scope="col"
                className="w-16 px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                No.
              </th>
              <th
                scope="col"
                className="w-28 px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                분류
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                제목
              </th>
              <th
                scope="col"
                className="w-24 px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                작성자
              </th>
              <th
                scope="col"
                className="w-28 px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                작성일
              </th>
              <th
                scope="col"
                className="w-20 px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase"
              >
                조회
              </th>
              <th scope="col" className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pinnedPosts.map((post) => (
              <tr
                key={post.id}
                onClick={() => onSelect(post)}
                className="cursor-pointer border-b border-border bg-accent/5 transition-colors last:border-0 hover:bg-accent/10"
              >
                <td className="px-4 py-3 text-center">
                  <Pin
                    className="mx-auto size-3.5 text-accent"
                    aria-label="중요 공지"
                  />
                </td>
                <td className="px-4 py-3">
                  <Badge variant={categoryMeta[post.category].badgeVariant}>
                    {categoryMeta[post.category].label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="font-heading text-[0.9375rem] font-semibold text-foreground">
                    {post.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {post.author}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {post.date}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {post.views.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {post.attachments.length > 0 && (
                    <Paperclip
                      className="mx-auto size-3.5 text-muted-foreground"
                      aria-label="첨부파일 있음"
                    />
                  )}
                </td>
              </tr>
            ))}

            {posts.map((post, index) => (
              <tr
                key={post.id}
                onClick={() => onSelect(post)}
                className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                  {startNo + index}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={categoryMeta[post.category].badgeVariant}>
                    {categoryMeta[post.category].label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="font-heading text-[0.9375rem] text-foreground">
                    {post.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {post.author}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {post.date}
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  {post.views.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {post.attachments.length > 0 && (
                    <Paperclip
                      className="mx-auto size-3.5 text-muted-foreground"
                      aria-label="첨부파일 있음"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <ul className="flex flex-col gap-2 md:hidden">
        {allPosts.map((post) => (
          <li key={post.id}>
            <button
              type="button"
              onClick={() => onSelect(post)}
              className={cn(
                "flex w-full flex-col gap-2 rounded-xl border border-border p-4 text-left transition-colors",
                post.pinned ? "bg-accent/5" : "bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2">
                {post.pinned && (
                  <Pin className="size-3.5 shrink-0 text-accent" />
                )}
                <Badge variant={categoryMeta[post.category].badgeVariant}>
                  {categoryMeta[post.category].label}
                </Badge>
                {post.attachments.length > 0 && (
                  <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>
              <p className="font-heading text-[0.9375rem] font-medium text-pretty text-foreground">
                {post.title}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[0.6875rem] text-muted-foreground">
                <span>{post.author}</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span>조회 {post.views.toLocaleString()}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
