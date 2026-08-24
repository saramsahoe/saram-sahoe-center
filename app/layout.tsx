import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/** Korean serif reserved for the calligraphy-style vision statement */
const fontSerif = Nanum_Myeongjo({
  subsets: ["korean", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "연구센터 사람과 사회",
    template: "%s | 연구센터 사람과 사회",
  },
  description:
    "사람과 사회의 관계를 연구하는 독립 연구센터입니다. 노동, 돌봄, 지역 공동체에 관한 학술 연구와 공적 담론을 만듭니다.",
  keywords: ["연구센터", "사람과 사회", "사회과학 연구", "노동 연구", "돌봄 연구"],
  openGraph: {
    title: "연구센터 사람과 사회",
    description: "사람과 사회의 관계를 연구하는 독립 연구센터",
    locale: "ko_KR",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
      </head>
      <body>
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
