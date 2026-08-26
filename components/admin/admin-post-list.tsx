"use client"

import { useState } from "react"
import { Lock, Trash2 } from "lucide-react"

import { deletePost, updatePost } from "@/app/actions/board"
import {
  PostFormDialog,
  type PostFormValues,
} from "@/components/board/post-form-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { categoryMeta, type Post } from "@/lib/board-content"

export function AdminPostList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [listError, setListError] = useState<string | null>(null)

  function openEditDialog(post: Post) {
    setEditingPost(post)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  async function handleSubmit(values: PostFormValues) {
    if (!editingPost) return
    setFormSubmitting(true)
    setFormError(null)

    const result = await updatePost({ id: editingPost.id, ...values })
    setFormSubmitting(false)

    if (result.error || !result.post) {
      setFormError(result.error ?? "게시글을 저장하지 못했습니다.")
      return
    }

    setPosts((prev) =>
      prev.map((post) => (post.id === editingPost.id ? result.post! : post))
    )
    setFormOpen(false)
    setEditingPost(null)
  }

  async function handleDelete(post: Post) {
    if (!window.confirm(`"${post.title}" 게시글을 삭제할까요?`)) return

    setDeletingId(post.id)
    setListError(null)
    const result = await deletePost(post.id)
    setDeletingId(null)

    if (result.error) {
      setListError(result.error)
      return
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }

  return (
    <div>
      {listError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                분류
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                제목
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                작성자
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                작성일
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                조회
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Badge variant={categoryMeta[post.category].badgeVariant}>
                    {categoryMeta[post.category].label}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    {!post.isPublic && (
                      <Lock
                        className="size-3 shrink-0 text-muted-foreground"
                        aria-label="회원 전용"
                      />
                    )}
                    <span className="font-heading text-foreground">
                      {post.title}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {post.author}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {post.date}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {post.views.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(post)}
                    >
                      수정
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === post.id}
                      onClick={() => handleDelete(post)}
                    >
                      <Trash2 data-icon="inline-start" />
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            게시글이 없습니다.
          </p>
        )}
      </div>

      <PostFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingPost(null)
            setFormError(null)
          }
        }}
        editingPost={editingPost}
        onSubmit={handleSubmit}
        error={formError}
        submitting={formSubmitting}
      />
    </div>
  )
}
