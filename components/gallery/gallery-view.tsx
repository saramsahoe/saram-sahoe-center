"use client"

import { useMemo, useState } from "react"
import { PenSquare } from "lucide-react"

import {
  createGalleryPost,
  deleteGalleryPost,
  updateGalleryPost,
} from "@/app/actions/gallery"
import { GalleryDetailDialog } from "@/components/gallery/gallery-detail-dialog"
import {
  GalleryFormDialog,
  type GalleryFormValues,
} from "@/components/gallery/gallery-form-dialog"
import { GalleryMasonry } from "@/components/gallery/gallery-masonry"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GalleryPost, GallerySortMode } from "@/lib/gallery-content"

const sortOptions: { value: GallerySortMode; label: string }[] = [
  { value: "activity", label: "활동연월순" },
  { value: "created", label: "최근등록순" },
]

export function GalleryView({
  initialPosts,
  isAdmin,
}: {
  initialPosts: GalleryPost[]
  isAdmin: boolean
}) {
  const [posts, setPosts] = useState<GalleryPost[]>(initialPosts)
  const [sortMode, setSortMode] = useState<GallerySortMode>("activity")
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const sortedPosts = useMemo(() => {
    const next = [...posts]
    if (sortMode === "activity") {
      next.sort((a, b) => b.activityMonth.localeCompare(a.activityMonth))
    } else {
      next.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    return next
  }, [posts, sortMode])

  function openAddDialog() {
    setEditingPost(null)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  function openEditDialog(post: GalleryPost) {
    setEditingPost(post)
    setSelectedPost(null)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  async function handleSubmit(values: GalleryFormValues) {
    setFormSubmitting(true)
    setFormError(null)

    const result = editingPost
      ? await updateGalleryPost({ id: editingPost.id, ...values })
      : await createGalleryPost(values)

    setFormSubmitting(false)

    if (result.error || !result.post) {
      setFormError(result.error ?? "갤러리 게시글을 저장하지 못했습니다.")
      return
    }

    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) => (post.id === editingPost.id ? result.post! : post))
      )
    } else {
      setPosts((prev) => [result.post!, ...prev])
    }

    setFormOpen(false)
    setEditingPost(null)
  }

  async function handleDelete(post: GalleryPost) {
    if (!window.confirm(`"${post.title}" 갤러리 게시글을 삭제할까요?`)) return

    const result = await deleteGalleryPost(post.id)
    if (result.error) {
      window.alert(result.error)
      return
    }

    setPosts((prev) => prev.filter((p) => p.id !== post.id))
    setSelectedPost(null)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="갤러리 정렬"
          className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1"
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={sortMode === option.value}
              onClick={() => setSortMode(option.value)}
              className={cn(
                "rounded-full px-4 py-2 font-heading text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                sortMode === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isAdmin && (
          <Button
            type="button"
            onClick={openAddDialog}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            <PenSquare data-icon="inline-start" />
            갤러리 추가
          </Button>
        )}
      </div>

      <div className="mt-6">
        <GalleryMasonry posts={sortedPosts} onSelect={setSelectedPost} />
      </div>

      <GalleryDetailDialog
        post={selectedPost}
        onOpenChange={(open) => {
          if (!open) setSelectedPost(null)
        }}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

      {isAdmin && (
        <GalleryFormDialog
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
      )}
    </div>
  )
}
