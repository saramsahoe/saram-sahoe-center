"use client"

import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"

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
  ALLOWED_NEWS_PHOTO_MIME_TYPES,
  MAX_NEWS_PHOTO_BYTES,
  type NewsSlide,
} from "@/lib/home-content"
import { formatFileSize } from "@/lib/utils"

export type NewsFormValues = {
  category: string
  title: string
  summary: string
  date: string
  photoPath: string | null
}

export function NewsFormDialog({
  open,
  onOpenChange,
  editingSlide,
  existingCategories,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSlide?: NewsSlide | null
  existingCategories: string[]
  onSubmit: (values: NewsFormValues) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [category, setCategory] = useState(editingSlide?.category ?? "")
  const [title, setTitle] = useState(editingSlide?.title ?? "")
  const [summary, setSummary] = useState(editingSlide?.summary ?? "")
  const [date, setDate] = useState(editingSlide?.date ?? "")
  const [photoPath, setPhotoPath] = useState<string | null>(editingSlide?.photoPath ?? null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(editingSlide?.photoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 원래 있던 사진(수정 진입 시점)과 다르면, 이번 세션에서 새로 올린 사진이라는 뜻이라
  // 취소/삭제/교체 시 스토리지에서 바로 지운다.
  const initialPhotoPath = editingSlide?.photoPath ?? null

  async function deleteFromStorage(path: string) {
    const supabase = createClient()
    await supabase.storage.from("news-photos").remove([path])
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!ALLOWED_NEWS_PHOTO_MIME_TYPES.includes(file.type)) {
      setPhotoError("jpg, png, webp, gif 이미지만 올릴 수 있습니다.")
      return
    }
    if (file.size > MAX_NEWS_PHOTO_BYTES) {
      setPhotoError(`사진은 ${formatFileSize(MAX_NEWS_PHOTO_BYTES)} 이하만 올릴 수 있습니다.`)
      return
    }

    setUploading(true)
    setPhotoError(null)
    const supabase = createClient()
    const uploadFile = await toWebp(file)
    const path = `${crypto.randomUUID()}${fileExtension(uploadFile.name)}`
    const { error: uploadError } = await supabase.storage
      .from("news-photos")
      .upload(path, uploadFile, { contentType: uploadFile.type })
    setUploading(false)

    if (uploadError) {
      setPhotoError(`업로드에 실패했습니다: ${uploadError.message}`)
      return
    }

    // 저장하지 않은 채 다른 사진으로 교체하는 경우, 방금 전 업로드는 바로 정리한다.
    if (photoPath && photoPath !== initialPhotoPath) {
      await deleteFromStorage(photoPath)
    }

    const { data } = supabase.storage.from("news-photos").getPublicUrl(path)
    setPhotoPath(path)
    setPhotoUrl(data.publicUrl)
  }

  async function removePhoto() {
    if (photoPath && photoPath !== initialPhotoPath) {
      await deleteFromStorage(photoPath)
    }
    setPhotoPath(null)
    setPhotoUrl(null)
  }

  async function handleCancel() {
    if (photoPath && photoPath !== initialPhotoPath) {
      await deleteFromStorage(photoPath)
    }
    onOpenChange(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!category.trim() || !title.trim() || !photoUrl) return
    onSubmit({
      category: category.trim(),
      title: title.trim(),
      summary: summary.trim(),
      date: date.trim(),
      photoPath,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingSlide ? "소식 수정" : "소식 추가"}</DialogTitle>
          <DialogDescription>
            메인 화면 소식 캐러셀에 보일 내용을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="news-category">
                  태그{" "}
                  <span className="font-normal text-muted-foreground">(예: SEMINAR)</span>
                </FieldLabel>
                <Input
                  id="news-category"
                  list="news-category-options"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="SEMINAR"
                  required
                />
                <datalist id="news-category-options">
                  {existingCategories.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </Field>
              <Field>
                <FieldLabel htmlFor="news-date">
                  연도{" "}
                  <span className="font-normal text-muted-foreground">(예: 2020 ~ 2022)</span>
                </FieldLabel>
                <Input
                  id="news-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="2020 ~ 2022"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="news-title">제목</FieldLabel>
              <Input
                id="news-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="news-summary">문구</FieldLabel>
              <Textarea
                id="news-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-20"
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
                  (최대 {formatFileSize(MAX_NEWS_PHOTO_BYTES)})
                </span>
              </FieldLabel>
              {photoUrl ? (
                <div className="relative w-full overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="사진 삭제"
                    className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground transition-colors hover:border-accent/50 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="size-4" />
                  )}
                  사진 추가
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_NEWS_PHOTO_MIME_TYPES.join(",")}
                className="hidden"
                onChange={handleFileSelected}
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
                disabled={submitting || uploading || !photoUrl}
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
