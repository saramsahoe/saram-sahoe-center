"use client"

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"

import { getAttachmentsUsage } from "@/app/actions/board"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn, formatFileSize } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  ALLOWED_INLINE_IMAGE_MIME_TYPES,
  categoryFilters,
  isAllowedAttachmentExtension,
  MAX_ATTACHMENTS_BYTES_PER_POST,
  MAX_INLINE_IMAGE_BYTES,
  type AttachmentRecord,
  type Post,
  type PostCategory,
} from "@/lib/board-content"

const categoryOptions = categoryFilters.filter(
  (item) => item.value !== "all"
) as { value: PostCategory; label: string }[]

export type PostFormValues = {
  title: string
  category: PostCategory
  content: string
  isPublic: boolean
  attachments: AttachmentRecord[]
}

function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-가-힣 ]/g, "_")
}

// 편집 화면에서 보여주는 첨부파일 목록은 서명(만료) URL 형태(Post.attachments)라서,
// 그 안에 담긴 실제 스토리지 경로를 다시 꺼내야 수정 시 재사용/삭제할 수 있다.
function pathFromSignedUrl(url: string): string | null {
  const marker = "/object/sign/attachments/"
  const index = url.indexOf(marker)
  if (index === -1) return null
  const rest = url.slice(index + marker.length)
  const queryIndex = rest.indexOf("?")
  const encoded = queryIndex === -1 ? rest : rest.slice(0, queryIndex)
  return decodeURIComponent(encoded)
}

export function PostFormDialog({
  open,
  onOpenChange,
  editingPost,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPost?: Post | null
  onSubmit: (values: PostFormValues) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [title, setTitle] = useState(editingPost?.title ?? "")
  const [category, setCategory] = useState<PostCategory>(
    editingPost?.category ?? "notice"
  )
  const [content, setContent] = useState(editingPost?.content ?? "")
  const [isPublic, setIsPublic] = useState(editingPost?.isPublic ?? true)
  const [attachments, setAttachments] = useState<AttachmentRecord[]>(() =>
    (editingPost?.attachments ?? []).flatMap((file) => {
      const path = pathFromSignedUrl(file.url)
      return path ? [{ name: file.name, path, size: file.size }] : []
    })
  )
  const [dragActive, setDragActive] = useState(false)
  const [attachmentUploading, setAttachmentUploading] = useState(false)
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // 수정 중 새로 업로드한 첨부파일 중, 취소 시 정리해야 할 대상을 구분하기 위한 원본 목록.
  const initialAttachmentPaths = useMemo(
    () =>
      new Set(
        (editingPost?.attachments ?? []).flatMap((file) => {
          const path = pathFromSignedUrl(file.url)
          return path ? [path] : []
        })
      ),
    [editingPost]
  )

  async function deleteFromStorage(bucket: string, path: string) {
    const supabase = createClient()
    await supabase.storage.from(bucket).remove([path])
  }

  async function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setAttachmentError(null)

    const candidates = Array.from(fileList)
    const rejected = candidates.filter(
      (file) => !isAllowedAttachmentExtension(file.name)
    )
    const newFiles = candidates.filter((file) =>
      isAllowedAttachmentExtension(file.name)
    )

    const rejectedMessage =
      rejected.length > 0
        ? `허용되지 않는 파일 형식입니다: ${rejected.map((f) => f.name).join(", ")}`
        : null
    if (rejectedMessage) setAttachmentError(rejectedMessage)
    if (newFiles.length === 0) return

    const existingTotal = attachments.reduce((sum, file) => sum + file.size, 0)
    const newTotal = newFiles.reduce((sum, file) => sum + file.size, 0)

    if (existingTotal + newTotal > MAX_ATTACHMENTS_BYTES_PER_POST) {
      setAttachmentError(
        [
          rejectedMessage,
          `첨부파일은 게시글당 최대 ${formatFileSize(MAX_ATTACHMENTS_BYTES_PER_POST)}까지 업로드할 수 있습니다.`,
        ]
          .filter(Boolean)
          .join(" / ")
      )
      return
    }

    const usage = await getAttachmentsUsage()
    if (usage && usage.used + newTotal > usage.limit) {
      setAttachmentError(
        [
          rejectedMessage,
          `전체 첨부파일 저장 공간(${formatFileSize(usage.limit)})을 초과하여 업로드할 수 없습니다.`,
        ]
          .filter(Boolean)
          .join(" / ")
      )
      return
    }

    setAttachmentUploading(true)
    const supabase = createClient()
    const uploaded: AttachmentRecord[] = []

    for (const file of newFiles) {
      const path = `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(path, file)

      if (uploadError) {
        setAttachmentError(`'${file.name}' 업로드에 실패했습니다: ${uploadError.message}`)
        continue
      }

      uploaded.push({ name: file.name, path, size: file.size })
    }

    setAttachments((prev) => [...prev, ...uploaded])
    setAttachmentUploading(false)
  }

  async function removeFile(index: number) {
    const file = attachments[index]
    setAttachments((prev) => prev.filter((_, i) => i !== index))
    if (file && !initialAttachmentPaths.has(file.path)) {
      await deleteFromStorage("attachments", file.path)
    }
  }

  function insertAtCursor(text: string) {
    const el = contentRef.current
    if (!el) {
      setContent((prev) => `${prev}${text}`)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = content.slice(0, start) + text + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      const cursor = start + text.length
      el.setSelectionRange(cursor, cursor)
    })
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    const el = contentRef.current
    if (!el) {
      insertAtCursor(`${before}${placeholder}${after}`)
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.slice(start, end) || placeholder
    const next = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      const cursorStart = start + before.length
      el.setSelectionRange(cursorStart, cursorStart + selected.length)
    })
  }

  function applyListPrefix() {
    const el = contentRef.current
    if (!el) {
      insertAtCursor("- 목록 항목")
      return
    }
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.slice(start, end) || "목록 항목"
    const prefixed = selected
      .split("\n")
      .map((line) => `- ${line}`)
      .join("\n")
    const next = content.slice(0, start) + prefixed + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start, start + prefixed.length)
    })
  }

  function applyLink() {
    const url = window.prompt("연결할 URL을 입력하세요", "https://")
    if (!url) return
    wrapSelection("[", `](${url})`, "링크 텍스트")
  }

  function handleImageButtonClick() {
    imageInputRef.current?.click()
  }

  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!ALLOWED_INLINE_IMAGE_MIME_TYPES.includes(file.type)) {
      setAttachmentError("jpg, png, webp, gif 이미지만 삽입할 수 있습니다.")
      return
    }

    if (file.size > MAX_INLINE_IMAGE_BYTES) {
      setAttachmentError(
        `이미지는 ${formatFileSize(MAX_INLINE_IMAGE_BYTES)} 이하만 삽입할 수 있습니다.`
      )
      return
    }

    setImageUploading(true)
    setAttachmentError(null)
    const supabase = createClient()
    const path = `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(path, file)
    setImageUploading(false)

    if (uploadError) {
      setAttachmentError(`이미지 업로드에 실패했습니다: ${uploadError.message}`)
      return
    }

    const { data } = supabase.storage.from("post-images").getPublicUrl(path)
    insertAtCursor(`\n![](${data.publicUrl})\n`)
  }

  function handleBoldClick() {
    wrapSelection("**", "**", "굵은 텍스트")
  }

  function handleItalicClick() {
    wrapSelection("*", "*", "기울임 텍스트")
  }

  async function handleCancel() {
    // 저장하지 않고 닫을 때, 이번 세션에서 새로 올린(원래 글에 없던) 첨부파일은 정리한다.
    const newlyUploaded = attachments.filter(
      (file) => !initialAttachmentPaths.has(file.path)
    )
    await Promise.all(
      newlyUploaded.map((file) => deleteFromStorage("attachments", file.path))
    )
    onOpenChange(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSubmit({
      title: title.trim(),
      category,
      content: content.trim(),
      isPublic,
      attachments,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingPost ? "게시글 수정" : "글쓰기"}</DialogTitle>
          <DialogDescription>
            {editingPost
              ? "게시글 내용을 수정한 뒤 등록하기를 눌러주세요."
              : "제목과 내용을 입력하고 등록하기를 눌러주세요."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
              <Field>
                <FieldLabel htmlFor="post-title">제목</FieldLabel>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="post-category">카테고리</FieldLabel>
                <Select
                  value={category}
                  onValueChange={(value) =>
                    setCategory(value as PostCategory)
                  }
                >
                  <SelectTrigger id="post-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              전체 공개
              <span className="font-normal text-muted-foreground">
                (해제하면 로그인한 회원만 볼 수 있습니다)
              </span>
            </label>

            <Field>
              <FieldLabel htmlFor="post-content">내용</FieldLabel>
              <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-input bg-muted/40 px-2 py-1.5">
                <button
                  type="button"
                  aria-label="굵게"
                  onClick={handleBoldClick}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Bold className="size-3.5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="기울임"
                  onClick={handleItalicClick}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Italic className="size-3.5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="목록"
                  onClick={applyListPrefix}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <List className="size-3.5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="링크"
                  onClick={applyLink}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Link2 className="size-3.5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="이미지"
                  onClick={handleImageButtonClick}
                  disabled={imageUploading}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  {imageUploading ? (
                    <Loader2 className="size-3.5 animate-spin" strokeWidth={1.75} />
                  ) : (
                    <ImageIcon className="size-3.5" strokeWidth={1.75} />
                  )}
                </button>
                <span className="ml-auto font-mono text-[0.5625rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Markdown
                </span>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept={ALLOWED_INLINE_IMAGE_MIME_TYPES.join(",")}
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>
              <Textarea
                ref={contentRef}
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                required
                className="min-h-48 rounded-t-none"
              />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel>
                첨부파일{" "}
                <span className="font-normal text-muted-foreground">
                  (게시글당 최대 {formatFileSize(MAX_ATTACHMENTS_BYTES_PER_POST)})
                </span>
              </FieldLabel>
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  addFiles(e.dataTransfer.files)
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  dragActive
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                {attachmentUploading ? (
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                ) : (
                  <UploadCloud
                    className="size-6 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                )}
                <p className="text-sm text-foreground">
                  {attachmentUploading
                    ? "업로드 중..."
                    : "파일을 드래그하거나 클릭해서 업로드하세요"}
                </p>
                <p className="text-xs text-muted-foreground">
                  최대 {formatFileSize(MAX_ATTACHMENTS_BYTES_PER_POST)} · 이미지, PDF, HWP(X), MS오피스, TXT/CSV, ZIP, MP3/MP4 지원
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_ATTACHMENT_EXTENSIONS.join(",")}
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {attachmentError && (
                <Alert variant="destructive">
                  <AlertDescription>{attachmentError}</AlertDescription>
                </Alert>
              )}

              {attachments.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {attachments.map((file, index) => (
                    <li
                      key={`${file.path}-${index}`}
                      className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      <span className="truncate">{file.name}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <span>{formatFileSize(file.size)}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          aria-label={`${file.name} 삭제`}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting || attachmentUploading || imageUploading}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {submitting ? "등록 중..." : "등록하기"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
