"use client"

import { Download, Eye, Lock, PenSquare, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PostMarkdown } from "@/components/board/post-markdown"
import { categoryMeta, type Post } from "@/lib/board-content"
import { formatFileSize } from "@/lib/utils"

export function PostDetailDialog({
  post,
  onOpenChange,
  onEdit,
}: {
  post: Post | null
  onOpenChange: (open: boolean) => void
  onEdit: (post: Post) => void
}) {
  return (
    <Dialog open={post !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {post && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant={categoryMeta[post.category].badgeVariant}
                  className="w-fit"
                >
                  {categoryMeta[post.category].label}
                </Badge>
                {!post.isPublic && (
                  <Badge variant="outline" className="w-fit gap-1">
                    <Lock className="size-3" strokeWidth={1.75} />
                    회원 전용
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{post.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {post.excerpt}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full border border-border bg-muted">
                  <UserRound
                    className="size-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </span>
                <div>
                  <p className="font-heading text-sm font-medium text-foreground">
                    {post.author}
                  </p>
                  <p className="font-mono text-[0.625rem] tracking-[0.1em] text-muted-foreground">
                    {post.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="size-3.5" />
                  조회 {post.views.toLocaleString()}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(post)}
                >
                  <PenSquare data-icon="inline-start" />
                  수정
                </Button>
              </div>
            </div>

            <PostMarkdown content={post.content} />

            {post.attachments.length > 0 && (
              <div className="border-t border-border pt-4">
                <h3 className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
                  Attachments
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.attachments.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <Download className="size-3.5" strokeWidth={1.5} />
                      {file.name}
                      <span className="text-muted-foreground/70">
                        {formatFileSize(file.size)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
