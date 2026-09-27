"use client"

import { PenSquare, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { GalleryPost } from "@/lib/gallery-content"

export function GalleryDetailDialog({
  post,
  onOpenChange,
  onEdit,
  onDelete,
  isAdmin,
}: {
  post: GalleryPost | null
  onOpenChange: (open: boolean) => void
  onEdit: (post: GalleryPost) => void
  onDelete: (post: GalleryPost) => void
  isAdmin: boolean
}) {
  return (
    <Dialog open={post !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {post && (
          <>
            <DialogHeader>
              <Badge variant="outline" className="w-fit font-mono">
                {post.activityMonth}
              </Badge>
              <DialogTitle className="text-xl">{post.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {post.title}
              </DialogDescription>
            </DialogHeader>

            {isAdmin && (
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <Button type="button" variant="outline" size="sm" onClick={() => onEdit(post)}>
                  <PenSquare data-icon="inline-start" />
                  수정
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(post)}
                >
                  <Trash2 data-icon="inline-start" />
                  삭제
                </Button>
              </div>
            )}

            {post.content && (
              <p className="text-[0.9375rem] leading-relaxed text-pretty whitespace-pre-line text-foreground">
                {post.content}
              </p>
            )}

            {post.photos.length > 0 ? (
              <div className="flex flex-col gap-4">
                {post.photos.map((photo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={photo.path}
                    src={photo.url}
                    alt=""
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                등록된 사진이 없습니다.
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
