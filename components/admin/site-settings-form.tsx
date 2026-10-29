"use client"

import { useState, type FormEvent } from "react"

import { updateSiteSettings, type SiteSettings } from "@/app/actions/site-settings"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [seoTitle, setSeoTitle] = useState(initialSettings.seoTitle)
  const [seoDescription, setSeoDescription] = useState(initialSettings.seoDescription)
  const [seoKeywords, setSeoKeywords] = useState(initialSettings.seoKeywords)
  const [ogImageUrl, setOgImageUrl] = useState(initialSettings.ogImageUrl ?? "")
  const [naverMapUrl, setNaverMapUrl] = useState(initialSettings.naverMapUrl)
  const [naverMapClientId, setNaverMapClientId] = useState(
    initialSettings.naverMapClientId ?? ""
  )
  const [naverMapLat, setNaverMapLat] = useState(
    initialSettings.naverMapLat?.toString() ?? ""
  )
  const [naverMapLng, setNaverMapLng] = useState(
    initialSettings.naverMapLng?.toString() ?? ""
  )
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)

    const lat = naverMapLat.trim() ? Number(naverMapLat) : null
    const lng = naverMapLng.trim() ? Number(naverMapLng) : null
    if ((lat !== null && Number.isNaN(lat)) || (lng !== null && Number.isNaN(lng))) {
      setSubmitting(false)
      setError("위도/경도는 숫자로 입력해 주세요.")
      return
    }

    const result = await updateSiteSettings({
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImageUrl: ogImageUrl || null,
      naverMapUrl,
      naverMapClientId: naverMapClientId || null,
      naverMapLat: lat,
      naverMapLng: lng,
    })

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setMessage("저장했습니다.")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
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
          <FieldLabel htmlFor="og-image">
            공유 미리보기 이미지 URL{" "}
            <span className="font-normal text-muted-foreground">
              (카카오톡·페이스북 등에 링크 공유 시 보이는 이미지, 선택)
            </span>
          </FieldLabel>
          <Input
            id="og-image"
            value={ogImageUrl}
            onChange={(e) => setOgImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </Field>

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
            required
          />
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
            placeholder="Naver Cloud Platform Maps API Client ID"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Naver Cloud Platform(console.ncloud.com) → AI·NAVER API → Application 등록(Maps)에서
            발급받은 Client ID를 넣어 주세요. 등록 시 서비스 URL에 이 사이트 도메인도 추가해야 합니다.
          </p>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="naver-map-lat">위도 (latitude)</FieldLabel>
            <Input
              id="naver-map-lat"
              value={naverMapLat}
              onChange={(e) => setNaverMapLat(e.target.value)}
              placeholder="예: 37.5172"
              inputMode="decimal"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="naver-map-lng">경도 (longitude)</FieldLabel>
            <Input
              id="naver-map-lng"
              value={naverMapLng}
              onChange={(e) => setNaverMapLng(e.target.value)}
              placeholder="예: 127.0473"
              inputMode="decimal"
            />
          </Field>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
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
            disabled={submitting}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            {submitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
