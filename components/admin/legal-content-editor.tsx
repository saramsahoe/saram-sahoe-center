"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, PenSquare } from "lucide-react"

import { PostMarkdown } from "@/components/board/post-markdown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

/**
 * 클릭하면 전문이 펼쳐지고, 더블클릭(또는 "수정" 버튼)하면 마크다운 원문을
 * 바로 고칠 수 있는 약관/정책류 본문 에디터. 이용약관/개인정보처리방침에서
 * 똑같이 재사용한다.
 */
export function LegalContentEditor({
  title,
  initialContent,
  onSave,
}: {
  title: string
  initialContent: string
  onSave: (content: string) => Promise<{ error: string | null }>
}) {
  const [content, setContent] = useState(initialContent)
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialContent)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function openEdit() {
    setDraft(content)
    setError(null)
    setEditing(true)
    setExpanded(true)
  }

  function cancelEdit() {
    setEditing(false)
    setError(null)
  }

  async function handleSave() {
    if (!draft.trim()) {
      setError("내용을 입력해 주세요.")
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await onSave(draft.trim())
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setContent(draft.trim())
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-border p-4">
        <p className="font-heading text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          마크다운 문법을 그대로 씁니다 — <code>## 제목</code>으로 조/항 구분, 빈 줄로
          문단 구분, <code>- 항목</code>으로 목록을 만들 수 있습니다.
        </p>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="mt-3 min-h-96 font-mono text-xs"
        />
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-3 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
            취소
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={submitting}
            onClick={handleSave}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            {submitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        onDoubleClick={openEdit}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <span className="font-heading text-sm font-semibold text-foreground">{title}</span>
        {expanded ? (
          <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-4">
          <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={openEdit}>
              <PenSquare data-icon="inline-start" className="size-3.5" />
              수정
            </Button>
          </div>
          <div className="mt-3">
            <PostMarkdown content={content} />
          </div>
        </div>
      )}
    </div>
  )
}
