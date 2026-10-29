import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Gowun_Batang } from "next/font/google"

import "./globals.css"
import { getSiteSettings } from "@/app/actions/site-settings"
import { getMyProfile } from "@/app/actions/profile"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { themeConfig } from "@/lib/theme-config"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/** Korean serif reserved for the calligraphy-style vision statement — softer, more refined than Nanum Myeongjo */
const fontSerif = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
})

const FALLBACK_TITLE = "연구센터 사람과 사회"
const FALLBACK_DESCRIPTION = "인간 중심의 기술과 가치를 연구하는 교육 및 연구공동체입니다."
const FALLBACK_KEYWORDS = [
  "연구센터",
  "사람과 사회",
  "연구센터사람과사회",
  "사회과학 연구",
  "젠더",
  "휴머니즘",
  "여성 역량개발",
  "리더십",
  "여성과 리더십",
]

// /admin/settings에서 관리자가 직접 수정하는 site_settings 테이블 값을 사용한다.
// 조회 실패 시(설정 전 등) 기존 하드코딩 값으로 대체한다.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.seoTitle || FALLBACK_TITLE
  const description = settings?.seoDescription || FALLBACK_DESCRIPTION
  const keywords = settings?.seoKeywords
    ? settings.seoKeywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
    : FALLBACK_KEYWORDS

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "https://saramsahoe.org",
      siteName: "연구센터사람과사회",
      locale: "ko_KR",
      type: "website",
      images: settings?.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    verification: {
      google: "gKxUB0heHyFKYlcGvDLupjej1yVns0Y037zui5PCB88",
      other: {
        "naver-site-verification": "83ddd2aac39604ef4dffec7225d0b28b2234a73b",
      },
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  userScalable: true,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getMyProfile()

  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "bg-background antialiased",
        fontMono.variable,
        fontSerif.variable,
        "font-sans",
        geist.variable
      )}
    >
      <head>
        {/* Pretendard — optimized Korean + Latin sans-serif */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* lib/theme-config.ts 값을 CSS 변수로 주입 — 이 파일만 고치면 전체 색상이 바뀐다 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--cfg-bg-from:${themeConfig.background.gradientFrom};--cfg-bg-to:${themeConfig.background.gradientTo};--cfg-footer-bg:${themeConfig.footer.background};--cfg-footer-fg:${themeConfig.footer.text};--cfg-button-bg:${themeConfig.button.background};--cfg-button-fg:${themeConfig.button.text};--cfg-card-bg:${themeConfig.card.background};--cfg-heading-fg:${themeConfig.heading.color};--cfg-content-fg:${themeConfig.content.color};--cfg-accent:${themeConfig.accent.color};--cfg-accent-fg:${themeConfig.accent.text};--cfg-eyebrow-size:${themeConfig.typography.eyebrowSize};}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <SiteHeader initialProfile={profile} />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
