"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}) {
  if (pageCount <= 1) {
    return null
  }

  return (
    <nav
      aria-label="게시글 페이지네이션"
      className="mt-8 flex items-center justify-center gap-1"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="이전 페이지"
      >
        <ChevronLeft />
      </Button>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange(p)}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg font-mono text-xs transition-colors",
            p === page
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {p}
        </button>
      ))}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="다음 페이지"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}
