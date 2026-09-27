"use client"

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"

import { SortableList } from "@/components/admin/sortable-list"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { fileExtension, toWebp } from "@/lib/image-upload"
import {
  ALLOWED_GALLERY_PHOTO_MIME_TYPES,
  MAX_GALLERY_PHOTO_BYTES,
  type GalleryPhoto,
  type GalleryPost,
} from "@/lib/gallery-content"
import { formatFileSize } from "@/lib/utils"

export type GalleryFormValues = {
  activityMonth: string
  title: string
  content: string
  photos: { path: string; size: number }[]
}

export function GalleryFormDialog({
  open,
  onOpenChange,
  editingPost,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPost?: GalleryPost | null
  onSubmit: (values: GalleryFormValues) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [activityMonth, setActivityMonth] = useState(editingPost?.activityMonth ?? "")
  const [title, setTitle] = useState(editingPost?.title ?? "")
  const [content, setContent] = useState(editingPost?.content ?? "")
  const [photos, setPhotos] = useState<GalleryPhoto[]>(editingPost?.photos ?? [])
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 수정 중 새로 올린(원래 글에 없던) 사진만 취소 시 스토리지에서 정리한다.
  const initialPhotoPaths = useMemo(
    () => new Set((editingPost?.photos ?? []).map((photo) => photo.path)),
    [editingPost]
  )

  async function deleteFromStorage(path: string) {
    const supabase = createClient()
    await supabase.storage.from("gallery-photos").remove([path])
  }

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length === 0) return

    const errors: string[] = []
    const valid = files.filter((file) => {
      if (!ALLOWED_GALLERY_PHOTO_MIME_TYPES.includes(file.type)) {
        errors.push("jpg, png, webp, gif 이미지만 올릴 수 있습니다.")
        return false
      }
      if (file.size > MAX_GALLERY_PHOTO_BYTES) {
        errors.push(
          `사진은 ${formatFileSize(MAX_GALLERY_PHOTO_BYTES)} 이하만 올릴 수 있습니다.`
        )
        return false
      }
      return true
    })

    if (valid.length === 0) {
      setPhotoError(errors.join(" / "))
      return
    }

    setUploading(true)
    setPhotoError(null)
    const supabase = createClient()
    const uploaded: GalleryPhoto[] = []

    for (const file of valid) {
      const uploadFile = await toWebp(file)
      const path = `${crypto.randomUUID()}${fileExtension(uploadFile.name)}`
      const { error: uploadError } = await supabase.storage
        .from("gallery-photos")
        .upload(path, uploadFile, { contentType: uploadFile.type })

      if (uploadError) {
        errors.push(`업로드에 실패했습니다: ${uploadError.message}`)
        continue
      }

      const { data } = supabase.storage.from("gallery-photos").getPublicUrl(path)
      uploaded.push({ path, size: uploadFile.size, url: data.publicUrl })
    }

    setUploading(false)
    if (errors.length > 0) setPhotoError(errors.join(" / "))
    setPhotos((prev) => [...prev, ...uploaded])
  }

  async function removePhoto(path: string) {
    setPhotos((prev) => prev.filter((photo) => photo.path !== path))
    if (!initialPhotoPaths.has(path)) {
      await deleteFromStorage(path)
    }
  }

  async function handleCancel() {
    const newlyUploaded = photos.filter((photo) => !initialPhotoPaths.has(photo.path))
    await Promise.all(newlyUploaded.map((photo) => deleteFromStorage(photo.path)))
    onOpenChange(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activityMonth || !title.trim()) return
    onSubmit({
      activityMonth,
      title: title.trim(),
      content: content.trim(),
      photos: photos.map(({ path, size }) => ({ path, size })),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingPost ? "갤러리 수정" : "갤러리 추가"}</DialogTitle>
          <DialogDescription>
            활동연월, 제목, 내용을 입력하고 사진을 올려주세요. 사진은 드래그로 순서를 바꿀 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="gallery-month">활동연월</FieldLabel>
                <Input
                  id="gallery-month"
                  type="month"
                  value={activityMonth}
                  onChange={(e) => setActivityMonth(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="gallery-title">제목</FieldLabel>
                <Input
                  id="gallery-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="gallery-content">내용</FieldLabel>
              <Textarea
                id="gallery-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="min-h-32"
              />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel>
                사진{" "}
                <span className="font-normal text-muted-foreground">
                  (최대 {formatFileSize(MAX_GALLERY_PHOTO_BYTES)} · 드래그로 순서 변경, 첫 번째 사진이 대표사진)
                </span>
              </FieldLabel>

              {photos.length > 0 && (
                <SortableList
                  items={photos.map((photo) => ({ ...photo, id: photo.path }))}
                  onReorder={(next) => setPhotos(next)}
                  layout="grid"
                  className="grid grid-cols-3 gap-2 sm:grid-cols-4"
                  renderItem={(photo, dragHandle) => (
                    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt=""
                        className="size-full object-cover"
                      />
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/40 px-1 py-0.5">
                        {dragHandle}
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.path)}
                          aria-label="사진 삭제"
                          className="flex size-5 items-center justify-center rounded text-white transition-colors hover:bg-white/20"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                />
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-accent/50 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImagePlus className="size-4" />
                )}
                사진 추가
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_GALLERY_PHOTO_MIME_TYPES.join(",")}
                className="hidden"
                onChange={handleFilesSelected}
              />

              {photoError && (
                <Alert variant="destructive">
                  <AlertDescription>{photoError}</AlertDescription>
                </Alert>
              )}
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting || uploading}
                className="bg-button text-button-foreground hover:bg-button/90"
              >
                {submitting ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
