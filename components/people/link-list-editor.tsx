"use client"

import { Plus, X } from "lucide-react"

import { Input } from "@/components/ui/input"

export type EditableLink = { label: string; url: string }

/** 참고 링크를 "+" 버튼으로 한 줄씩 [라벨] [URL] 입력해 추가하는 에디터. */
export function LinkListEditor({
  links,
  onChange,
}: {
  links: EditableLink[]
  onChange: (next: EditableLink[]) => void
}) {
  function updateLink(index: number, patch: Partial<EditableLink>) {
    onChange(links.map((link, i) => (i === index ? { ...link, ...patch } : link)))
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index))
  }

  function addLink() {
    onChange([...links, { label: "", url: "" }])
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={link.label}
            onChange={(e) => updateLink(index, { label: e.target.value })}
            placeholder="라벨 (예: 이메일)"
            className="w-32 shrink-0"
          />
          <Input
            value={link.url}
            onChange={(e) => updateLink(index, { url: e.target.value })}
            placeholder="URL (예: mailto:... 또는 https://...)"
          />
          <button
            type="button"
            onClick={() => removeLink(index)}
            aria-label="링크 삭제"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLink}
        className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent/50"
      >
        <Plus className="size-3.5" />
        링크 추가
      </button>
    </div>
  )
}
