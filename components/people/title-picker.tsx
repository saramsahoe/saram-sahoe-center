"use client"

import { useState, type FormEvent } from "react"
import { Plus, X } from "lucide-react"

import { createTitleOption, deleteTitleOption } from "@/app/actions/org-title-options"
import { cn } from "@/lib/utils"
import type { TitleOption } from "@/lib/people-content"

/** 직함(뱃지) 다중 선택 + "기타" 신규 선택지 등록/삭제. */
export function TitlePicker({
  options,
  setOptions,
  selected,
  onChange,
}: {
  options: TitleOption[]
  setOptions: (next: TitleOption[]) => void
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [newLabel, setNewLabel] = useState("")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(label: string) {
    if (selected.includes(label)) {
      onChange(selected.filter((item) => item !== label))
    } else {
      onChange([...selected, label])
    }
  }

  async function handleAdd(event: FormEvent) {
    event.preventDefault()
    const label = newLabel.trim()
    if (!label) return

    setAdding(true)
    setError(null)
    const result = await createTitleOption(label)
    setAdding(false)

    if (result.error || !result.option) {
      setError(result.error ?? "직함을 추가하지 못했습니다.")
      return
    }

    setOptions([...options, result.option])
    onChange([...selected, result.option.label])
    setNewLabel("")
  }

  async function handleDelete(option: TitleOption) {
    if (option.isDefault) return
    if (!window.confirm(`"${option.label}" 직함 선택지를 삭제할까요?`)) return

    const result = await deleteTitleOption(option.id)
    if (result.error) {
      setError(result.error)
      return
    }
    setOptions(options.filter((item) => item.id !== option.id))
    onChange(selected.filter((item) => item !== option.label))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <span
            key={option.id}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selected.includes(option.label)
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:border-accent/50"
            )}
          >
            <button type="button" onClick={() => toggle(option.label)}>
              {option.label}
            </button>
            {!option.isDefault && (
              <button
                type="button"
                onClick={() => handleDelete(option)}
                aria-label={`${option.label} 선택지 삭제`}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            )}
          </span>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-2 flex items-center gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="기타 직함 입력 후 추가"
          className="h-8 w-40 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <button
          type="submit"
          disabled={adding || !newLabel.trim()}
          className="flex h-8 items-center gap-1 rounded-lg border border-dashed border-border px-2.5 text-xs text-muted-foreground transition-colors hover:border-accent/50 disabled:opacity-50"
        >
          <Plus className="size-3.5" />
          추가
        </button>
      </form>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}
