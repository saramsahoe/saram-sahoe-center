"use client"

import { useState, type FormEvent } from "react"
import { MapPin, PenSquare } from "lucide-react"

import { updateNaverMapUrl } from "@/app/actions/site-settings"
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
import { siteConfig } from "@/lib/navigation"

export function LocationMap({
  naverMapUrl,
  isAdmin,
}: {
  naverMapUrl: string
  isAdmin: boolean
}) {
  const [currentUrl, setCurrentUrl] = useState(naverMapUrl)
  const [editOpen, setEditOpen] = useState(false)
  const [draftUrl, setDraftUrl] = useState(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function openEdit() {
    setDraftUrl(currentUrl)
    setError(null)
    setEditOpen(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draftUrl.trim()) return

    setSubmitting(true)
    setError(null)
    const result = await updateNaverMapUrl(draftUrl.trim())
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setCurrentUrl(draftUrl.trim())
    setEditOpen(false)
  }

  return (
    <div>
      {/* 네이버 지도는 iframe 삽입을 막고 있어 실제 지도 대신 정적 미리보기를 보여주고,
          클릭하면 네이버 지도 페이지로 바로 이동시킨다. */}
      <a
        href={currentUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`네이버 지도에서 ${siteConfig.name} 위치 보기`}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[21/9]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-80 [background-image:repeating-linear-gradient(90deg,transparent,transparent_79px,var(--border)_79px,var(--border)_80px),repeating-linear-gradient(0deg,transparent,transparent_79px,var(--border)_79px,var(--border)_80px)]"
        />

        <span className="absolute top-4 left-4 inline-flex items-center rounded-sm bg-background/90 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-muted-foreground uppercase backdrop-blur">
          클릭하면 네이버 지도로 이동
        </span>

        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="relative mb-2 w-max max-w-[15rem] rounded-lg border border-border bg-card px-3.5 py-2.5 text-center shadow-md transition-transform group-hover:-translate-y-0.5 sm:max-w-xs">
            <p className="font-heading text-sm font-semibold text-foreground">
              연구센터 사람과 사회
            </p>
            <p className="mt-0.5 text-[0.6875rem] leading-snug text-pretty text-muted-foreground">
              {siteConfig.address}
            </p>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card"
            />
          </div>
          <MapPin
            className="size-9 text-accent drop-shadow-sm"
            strokeWidth={1.5}
          />
        </div>
      </a>

      {isAdmin && (
        <div className="mt-2 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={openEdit}>
            <PenSquare data-icon="inline-start" className="size-3.5" />
            지도 위치 수정
          </Button>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>지도 위치 수정</DialogTitle>
            <DialogDescription>
              네이버 지도에서 공유 &gt; 링크 복사한 URL을 붙여넣어 주세요.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="naver-map-url-input">네이버 지도 URL</FieldLabel>
                <Input
                  id="naver-map-url-input"
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  placeholder="https://map.naver.com/p/entry/place/..."
                  required
                />
              </Field>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-button text-button-foreground hover:bg-button/90"
                >
                  {submitting ? "저장 중..." : "저장하기"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
