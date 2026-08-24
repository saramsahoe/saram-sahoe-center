import { ExternalLink, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/navigation"

const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(siteConfig.address)}`
const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(siteConfig.address)}`

export function LocationMap() {
  return (
    <div>
      {/* Placeholder preview — mount point for the Naver Cloud Platform Maps SDK in production */}
      <div
        id="naver-map"
        role="img"
        aria-label={`${siteConfig.name} 위치 지도`}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[21/9]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(90deg,transparent,transparent_79px,var(--border)_79px,var(--border)_80px),repeating-linear-gradient(0deg,transparent,transparent_79px,var(--border)_79px,var(--border)_80px)]"
        />

        <span className="absolute top-4 left-4 inline-flex items-center rounded-sm bg-background/90 px-2 py-0.5 font-mono text-[0.5625rem] tracking-[0.14em] text-muted-foreground uppercase backdrop-blur">
          Map Preview
        </span>

        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="relative mb-2 w-max max-w-[15rem] rounded-lg border border-border bg-card px-3.5 py-2.5 text-center shadow-md sm:max-w-xs">
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
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <a href={naverMapUrl} target="_blank" rel="noopener noreferrer">
            네이버 지도에서 열기 (Open in Naver Map)
            <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer">
            카카오맵으로 보기 (Kakao Map)
            <ExternalLink data-icon="inline-end" />
          </a>
        </Button>
      </div>
    </div>
  )
}
