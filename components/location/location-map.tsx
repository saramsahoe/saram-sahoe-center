"use client"

import { useState, type FormEvent } from "react"
import { PenSquare } from "lucide-react"

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
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[21/9]">
        <iframe
          src={currentUrl}
          title={`${siteConfig.name} 위치 지도`}
          className="size-full border-0"
          loading="lazy"
        />

        {/* 지도를 클릭하면 바로 네이버 지도 페이지로 이동한다 — 지도 내부 조작은 막고 링크 역할만 한다. */}
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`네이버 지도에서 ${siteConfig.name} 위치 보기`}
          className="absolute inset-0"
        />

        {isAdmin && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-3 right-3 bg-background"
            aria-label="지도 위치 수정"
            onClick={openEdit}
          >
            <PenSquare className="size-4" />
          </Button>
        )}
      </div>

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
