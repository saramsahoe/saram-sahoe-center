"use client"

import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { ImagePlus, Loader2, Lock, Unlock, X } from "lucide-react"

import { updateSiteSettings, type SiteSettings } from "@/app/actions/site-settings"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { fileExtension, toWebp } from "@/lib/image-upload"
import { createClient } from "@/lib/supabase/client"
import { formatFileSize } from "@/lib/utils"

const ALLOWED_OG_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_OG_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [seoTitle, setSeoTitle] = useState(initialSettings.seoTitle)
  const [seoDescription, setSeoDescription] = useState(initialSettings.seoDescription)
  const [seoKeywords, setSeoKeywords] = useState(initialSettings.seoKeywords)
  const [ogImageUrl, setOgImageUrl] = useState(initialSettings.ogImageUrl)
  const [ogImagePath, setOgImagePath] = useState(initialSettings.ogImagePath)
  const [ogImageUploading, setOgImageUploading] = useState(false)
  const [ogImageError, setOgImageError] = useState<string | null>(null)
  const ogImageInputRef = useRef<HTMLInputElement>(null)

  const [naverMapUrl, setNaverMapUrl] = useState(initialSettings.naverMapUrl)
  const [naverMapClientId, setNaverMapClientId] = useState(
    initialSettings.naverMapClientId ?? ""
  )
  // 네이버 지도 설정은 실수로 건드리기 쉬워서, 기본적으로 잠겨 있고 "수정"을
  // 눌러야만 편집할 수 있게 해둔다.
  const [mapUnlocked, setMapUnlocked] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const initialOgImagePath = initialSettings.ogImagePath

  async function deleteFromStorage(path: string) {
    const supabase = createClient()
    await supabase.storage.from("site-images").remove([path])
  }

  async function handleOgImageSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!ALLOWED_OG_IMAGE_MIME_TYPES.includes(file.type)) {
      setOgImageError("jpg, png, webp, gif 이미지만 올릴 수 있습니다.")
      return
    }
    if (file.size > MAX_OG_IMAGE_BYTES) {
      setOgImageError(`이미지는 ${formatFileSize(MAX_OG_IMAGE_BYTES)} 이하만 올릴 수 있습니다.`)
      return
    }

    setOgImageUploading(true)
    setOgImageError(null)
    const supabase = createClient()
    const uploadFile = await toWebp(file)
    const path = `${crypto.randomUUID()}${fileExtension(uploadFile.name)}`
    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(path, uploadFile, { contentType: uploadFile.type })
    setOgImageUploading(false)

    if (uploadError) {
      setOgImageError(`업로드에 실패했습니다: ${uploadError.message}`)
      return
    }

    if (ogImagePath && ogImagePath !== initialOgImagePath) {
      await deleteFromStorage(ogImagePath)
    }

    const { data } = supabase.storage.from("site-images").getPublicUrl(path)
    setOgImagePath(path)
    setOgImageUrl(data.publicUrl)
  }

  async function removeOgImage() {
    if (ogImagePath && ogImagePath !== initialOgImagePath) {
      await deleteFromStorage(ogImagePath)
    }
    setOgImagePath(null)
    setOgImageUrl(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setWarning(null)
    setMessage(null)

    const result = await updateSiteSettings({
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImageUrl,
      ogImagePath,
      naverMapUrl,
      naverMapClientId: naverMapClientId || null,
    })

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setMessage("저장했습니다.")
    setWarning(result.warning ?? null)
    setMapUnlocked(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl">
      <FieldGroup>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 사이트 관련 설정 */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="font-heading text-sm font-semibold text-foreground">
              사이트 관련 설정
            </p>

            <div className="mt-4 flex flex-col gap-5">
              <Field>
                <FieldLabel htmlFor="seo-title">
                  사이트 제목{" "}
                  <span className="font-normal text-muted-foreground">
                    (구글 검색 결과 제목, 브라우저 탭 제목)
                  </span>
                </FieldLabel>
                <Input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="seo-description">
                  사이트 설명{" "}
                  <span className="font-normal text-muted-foreground">
                    (구글 검색 결과에 보이는 소개 문구)
                  </span>
                </FieldLabel>
                <Textarea
                  id="seo-description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="min-h-20"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="seo-keywords">
                  검색 키워드{" "}
                  <span className="font-normal text-muted-foreground">(쉼표로 구분)</span>
                </FieldLabel>
                <Textarea
                  id="seo-keywords"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="연구센터,사람과 사회,젠더,리더십"
                  className="min-h-16"
                />
              </Field>

              <Field>
                <FieldLabel>
                  공유 미리보기 이미지{" "}
                  <span className="font-normal text-muted-foreground">
                    (카카오톡·페이스북 등에 링크 공유 시 보이는 이미지, 최대{" "}
                    {formatFileSize(MAX_OG_IMAGE_BYTES)}, 선택)
                  </span>
                </FieldLabel>
                {ogImageUrl ? (
                  <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ogImageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
                    <button
                      type="button"
                      onClick={removeOgImage}
                      aria-label="이미지 삭제"
                      className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => ogImageInputRef.current?.click()}
                    disabled={ogImageUploading}
                    className="flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground transition-colors hover:border-accent/50 disabled:opacity-50"
                  >
                    {ogImageUploading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ImagePlus className="size-4" />
                    )}
                    이미지 업로드
                  </button>
                )}
                <input
                  ref={ogImageInputRef}
                  type="file"
                  accept={ALLOWED_OG_IMAGE_MIME_TYPES.join(",")}
                  className="hidden"
                  onChange={handleOgImageSelected}
                />
                {ogImageError && (
                  <Alert variant="destructive">
                    <AlertDescription>{ogImageError}</AlertDescription>
                  </Alert>
                )}
              </Field>
            </div>
          </div>

          {/* 네이버 지도 설정 — 실수로 바뀌기 쉬워서 한 묶음으로 모아두고 기본적으로 잠가둔다. */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-sm font-semibold text-foreground">
                네이버 지도 설정
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMapUnlocked((prev) => !prev)}
              >
                {mapUnlocked ? (
                  <>
                    <Lock data-icon="inline-start" className="size-3.5" />
                    잠그기
                  </>
                ) : (
                  <>
                    <Unlock data-icon="inline-start" className="size-3.5" />
                    수정
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-5">
              <Field>
                <FieldLabel htmlFor="naver-map-url">
                  오시는 길 — 네이버 지도 URL{" "}
                  <span className="font-normal text-muted-foreground">
                    (지도를 클릭하면 이동할 주소. 네이버 지도 &gt; 공유 &gt; 링크 복사)
                  </span>
                </FieldLabel>
                <Input
                  id="naver-map-url"
                  value={naverMapUrl}
                  onChange={(e) => setNaverMapUrl(e.target.value)}
                  readOnly={!mapUnlocked}
                  className={!mapUnlocked ? "bg-muted text-muted-foreground" : undefined}
                  required
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  이 URL에서 위도/경도를 자동으로 계산해서 저장합니다 — 따로 입력할 필요가
                  없습니다.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="naver-map-client-id">
                  네이버 지도 동적 임베드 — Client ID{" "}
                  <span className="font-normal text-muted-foreground">
                    (선택. 비워두면 정적 미리보기로 표시됩니다)
                  </span>
                </FieldLabel>
                <Input
                  id="naver-map-client-id"
                  value={naverMapClientId}
                  onChange={(e) => setNaverMapClientId(e.target.value)}
                  readOnly={!mapUnlocked}
                  className={!mapUnlocked ? "bg-muted text-muted-foreground" : undefined}
                  placeholder="Naver Cloud Platform Maps API Client ID"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Naver Cloud Platform(console.ncloud.com) → AI·NAVER API → Application 등록(Maps)에서
                  발급받은 Client ID를 넣어 주세요. 등록 시 서비스 URL에 이 사이트 도메인도 추가해야 합니다.
                </p>
              </Field>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {warning && (
          <Alert>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant="success">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div>
          <Button
            type="submit"
            disabled={submitting || ogImageUploading}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            {submitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
