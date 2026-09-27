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
  ALLOWED_HISTORY_PHOTO_MIME_TYPES,
  MAX_HISTORY_PHOTO_BYTES,
  type HistoryEntry,
} from "@/lib/history-content"
import { formatFileSize } from "@/lib/utils"

export type HistoryFormValues = {
  year: string
  title: string
  description: string
  photoPath: string | null
}

export function HistoryFormDialog({
  open,
  onOpenChange,
  editingEntry,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingEntry?: HistoryEntry | null
  onSubmit: (values: HistoryFormValues) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [year, setYear] = useState(editingEntry?.year ?? "")
  const [title, setTitle] = useState(editingEntry?.title ?? "")
  const [description, setDescription] = useState(editingEntry?.description ?? "")
  const [photoPath, setPhotoPath] = useState<string | null>(editingEntry?.photoPath ?? null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(editingEntry?.photoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 원래 있던 사진(수정 진입 시점)과 다르면, 이번 세션에서 새로 올린 사진이라는 뜻이라
  // 취소/삭제 시 스토리지에서 바로 지운다.
  const initialPhotoPath = editingEntry?.photoPath ?? null

  async function deleteFromStorage(path: string) {
    const supabase = createClient()
    await supabase.storage.from("history-photos").remove([path])
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!ALLOWED_HISTORY_PHOTO_MIME_TYPES.includes(file.type)) {
      setPhotoError("jpg, png, webp, gif 이미지만 올릴 수 있습니다.")
      return
    }
    if (file.size > MAX_HISTORY_PHOTO_BYTES) {
      setPhotoError(`사진은 ${formatFileSize(MAX_HISTORY_PHOTO_BYTES)} 이하만 올릴 수 있습니다.`)
      return
    }

    setUploading(true)
    setPhotoError(null)
    const supabase = createClient()
    const uploadFile = await toWebp(file)
    const path = `${crypto.randomUUID()}${fileExtension(uploadFile.name)}`
    const { error: uploadError } = await supabase.storage
      .from("history-photos")
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

    const { data } = supabase.storage.from("history-photos").getPublicUrl(path)
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
    if (!year.trim() || !title.trim()) return
    onSubmit({
      year: year.trim(),
      title: title.trim(),
      description: description.trim(),
      photoPath,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingEntry ? "연혁 수정" : "연혁 추가"}</DialogTitle>
          <DialogDescription>연도, 제목, 설명을 입력하고 사진을 올려주세요 (선택).</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="history-year">
                  연도 <span className="font-normal text-muted-foreground">(예: 2024 또는 2023~2025)</span>
                </FieldLabel>
                <Input
                  id="history-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="history-title">제목</FieldLabel>
                <Input
                  id="history-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="history-description">설명</FieldLabel>
              <Textarea
                id="history-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20"
              />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel>사진 (선택)</FieldLabel>
              {photoUrl ? (
                <div className="relative w-40 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="" className="w-full" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="사진 삭제"
                    className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-accent/50 disabled:opacity-50"
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
                accept={ALLOWED_HISTORY_PHOTO_MIME_TYPES.join(",")}
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
