import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  talentFrameworkApproach,
  talentFrameworkCompetencies,
  talentFrameworkDetails,
  talentFrameworkEffectiveness,
  talentFrameworkPrograms,
  talentFrameworkTarget,
  type FrameworkTheme,
  type FrameworkTriple,
} from "@/lib/about-content"

// 배려(pink)/성찰(blue)/창조(mint) 세 축을 시각적으로 구분하는 색상.
// 사이트 공통 accent 색과는 별개로, 이 다이어그램 전용 팔레트를 쓴다.
const theme: Record<
  FrameworkTheme,
  { bg: string; border: string; text: string; bullet: string; pill: string }
> = {
  pink: {
    bg: "bg-[#fff5f5]",
    border: "border-[#fed7d7]",
    text: "text-[#c53030]",
    bullet: "bg-[#e53e3e]",
    pill: "bg-[#ffe3e3] text-[#c53030]",
  },
  blue: {
    bg: "bg-[#f4f6ff]",
    border: "border-[#dbe4ff]",
    text: "text-[#2b4cb8]",
    bullet: "bg-[#4c6ef5]",
    pill: "bg-[#e2e9ff] text-[#2b4cb8]",
  },
  mint: {
    bg: "bg-[#f0fbf9]",
    border: "border-[#c6f6e5]",
    text: "text-[#059669]",
    bullet: "bg-[#10b981]",
    pill: "bg-[#d1fae5] text-[#059669]",
  },
}

function SideLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-11 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] px-3 text-center text-sm font-bold whitespace-pre text-[#475569] md:h-full">
      {children}
    </div>
  )
}

function HArrow() {
  return (
    <div className="flex items-center justify-center py-1 text-base leading-none font-bold text-[#94a3b8] md:py-0">
      ⇄
    </div>
  )
}

function UpArrows() {
  return (
    <div className="hidden md:grid md:grid-cols-[140px_1fr] md:items-center md:gap-6">
      <div />
      <div className="grid grid-cols-[1fr_32px_1fr_32px_1fr] text-center text-sm leading-none text-[#94a3b8]">
        <span>↑</span>
        <span />
        <span>↑</span>
        <span />
        <span>↑</span>
      </div>
    </div>
  )
}

function ColumnBox({
  value,
  colored,
}: {
  value: string
  colored: FrameworkTheme | null
}) {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-center rounded-xl border px-3 text-center text-sm font-bold",
        colored
          ? cn(theme[colored].bg, theme[colored].border, theme[colored].text)
          : "border-[#e2e8f0] bg-white text-[#334155]"
      )}
    >
      {value}
    </div>
  )
}

function FrameworkRow({
  label,
  values,
  colored,
}: {
  label: string
  values: FrameworkTriple<string>
  colored: boolean
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr] md:gap-6">
      <SideLabel>{label}</SideLabel>
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_32px_1fr_32px_1fr] md:gap-0">
        <ColumnBox value={values.pink} colored={colored ? "pink" : null} />
        <HArrow />
        <ColumnBox value={values.blue} colored={colored ? "blue" : null} />
        <HArrow />
        <ColumnBox value={values.mint} colored={colored ? "mint" : null} />
      </div>
    </div>
  )
}

export function TalentFramework() {
  const target = talentFrameworkTarget
  const details = talentFrameworkDetails

  return (
    <div className="rounded-3xl border border-[#dbe3eb] bg-white p-6 shadow-sm sm:p-10">
      {/* 최종 목표 */}
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[140px_1fr] md:gap-6">
        <SideLabel>최종 목표</SideLabel>
        <div className="flex min-h-[60px] flex-wrap items-center justify-center rounded-2xl border border-[#e2e8f0] bg-gradient-to-r from-[#fff5f5] via-white to-[#f0fbf9] px-4 py-3 text-center text-base font-bold sm:text-lg">
          <span className="font-extrabold text-[#e11d48]">{target.highlights.pink}</span>
          <span className="mx-1.5 font-semibold text-[#64748b]">·</span>
          <span className="font-extrabold text-[#3b5bdb]">{target.highlights.blue}</span>
          <span className="mx-1.5 font-semibold text-[#64748b]">·</span>
          <span className="font-extrabold text-[#0d9488]">{target.highlights.mint}</span>
          <span className="ml-1 text-[#1f2937]">{target.suffix}</span>
        </div>
      </div>

      <div className="my-4" />
      <FrameworkRow label="목표 역량" values={talentFrameworkCompetencies} colored />
      <div className="my-4" />
      <UpArrows />
      <div className="my-4" />
      <FrameworkRow label="효과성" values={talentFrameworkEffectiveness} colored={false} />
      <div className="my-4" />
      <UpArrows />
      <div className="my-4" />

      {/* 구성 내용 */}
      <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[140px_1fr] md:gap-6">
        <SideLabel>{"구 성 내 용"}</SideLabel>
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_32px_1fr_32px_1fr] md:gap-0">
          <div className={cn("flex min-h-[220px] flex-col gap-4 rounded-2xl border p-4", theme.pink.bg, theme.pink.border)}>
            <div className={cn("flex h-10 items-center justify-center rounded-lg px-2 text-center text-sm font-bold", theme.pink.pill)}>
              {details.pink.heading}
            </div>
            <ul className="flex flex-col gap-3">
              {details.pink.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13px] leading-relaxed font-semibold text-pretty text-[#374151]">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", theme.pink.bullet)} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <HArrow />

          <div className={cn("flex min-h-[220px] flex-col gap-4 rounded-2xl border p-4", theme.blue.bg, theme.blue.border)}>
            <div className={cn("flex h-10 items-center justify-center rounded-lg px-2 text-center text-sm font-bold", theme.blue.pill)}>
              {details.blue.heading}
            </div>
            <ul className="flex flex-col gap-3">
              {details.blue.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13px] leading-relaxed font-semibold text-pretty text-[#374151]">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", theme.blue.bullet)} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <HArrow />

          <div className={cn("flex min-h-[220px] flex-col gap-4 rounded-2xl border p-4", theme.mint.bg, theme.mint.border)}>
            <div className={cn("flex h-10 items-center justify-center rounded-lg px-2 text-center text-sm font-bold", theme.mint.pill)}>
              {details.mint.heading}
            </div>
            <ul className="flex flex-col gap-3">
              {details.mint.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13px] leading-relaxed font-semibold text-pretty text-[#374151]">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", theme.mint.bullet)} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="my-4" />
      <UpArrows />
      <div className="my-4" />
      <FrameworkRow label="프로그램" values={talentFrameworkPrograms} colored={false} />
      <div className="my-4" />
      <UpArrows />
      <div className="my-4" />
      <FrameworkRow label="접근 방법" values={talentFrameworkApproach} colored />

      <p className="mt-9 text-center text-xs font-semibold tracking-[0.2em] text-[#94a3b8] uppercase">
        Research Center for Humanity &amp; Society · 인재양성 프레임워크
      </p>
    </div>
  )
}
