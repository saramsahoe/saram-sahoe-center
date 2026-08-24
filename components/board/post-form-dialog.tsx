"use client"

import { useRef, useState, type FormEvent } from "react"
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  UploadCloud,
  X,
} from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  categoryFilters,
  type Post,
  type PostCategory,
} from "@/lib/board-content"

const toolbarButtons = [
  { icon: Bold, label: "굵게" },
  { icon: Italic, label: "기울임" },
  { icon: List, label: "목록" },
  { icon: Link2, label: "링크" },
  { icon: ImageIcon, label: "이미지" },
]

const categoryOptions = categoryFilters.filter(
  (item) => item.value !== "all"
) as { value: PostCategory; label: string }[]

export type PostFormValues = {
  title: string
  category: PostCategory
  content: string
}

export function PostFormDialog({
  open,
  onOpenChange,
  editingPost,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPost?: Post | null
  onSubmit: (values: PostFormValues) => void
}) {
  const [title, setTitle] = useState(editingPost?.title ?? "")
  const [category, setCategory] = useState<PostCategory>(
    editingPost?.category ?? "notice"
  )
  const [content, setContent] = useState(editingPost?.content ?? "")
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    setFiles((prev) => [...prev, ...Array.from(fileList)])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSubmit({ title: title.trim(), category, content: content.trim() })
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

            <Field>
              <FieldLabel htmlFor="post-content">내용</FieldLabel>
              <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-input bg-muted/40 px-2 py-1.5">
                {toolbarButtons.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="size-3.5" strokeWidth={1.75} />
                  </button>
                ))}
                <span className="ml-auto font-mono text-[0.5625rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Markdown
                </span>
              </div>
              <Textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                required
                className="min-h-48 rounded-t-none"
              />
            </Field>

            <Field>
              <FieldLabel>첨부파일</FieldLabel>
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
                <UploadCloud
                  className="size-6 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-foreground">
                  파일을 드래그하거나 클릭해서 업로드하세요
                </p>
                <p className="text-xs text-muted-foreground">
                  최대 10MB · PDF, HWP, DOCX, 이미지 파일 지원
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {files.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`${file.name} 삭제`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                임시저장
              </Button>
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                등록하기
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
