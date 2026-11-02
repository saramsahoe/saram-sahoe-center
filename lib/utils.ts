import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { themeConfig } from "@/lib/theme-config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** "#RRGGBB" 형태의 두 색 사이를 t(0~1)만큼 선형 보간한 "#RRGGBB" 색을 반환한다. */
export function interpolateHexColor(from: string, to: string, t: number): string {
  const parse = (hex: string) => {
    const n = parseInt(hex.replace("#", ""), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const [r1, g1, b1] = parse(from)
  const [r2, g2, b2] = parse(to)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t)
  const toHex = (n: number) => n.toString(16).padStart(2, "0")
  return `#${toHex(mix(r1, r2))}${toHex(mix(g1, g2))}${toHex(mix(b1, b2))}`
}

/** 목록 안에서의 위치(index/total)에 따라 navHover 스펙트럼 상의 색을 계산한다. */
export function navHoverColorAt(index: number, total: number): string {
  const t = total > 1 ? index / (total - 1) : 0
  return interpolateHexColor(themeConfig.navHover.from, themeConfig.navHover.to, t)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value < 10 ? 1 : 0)}${units[unitIndex]}`
}
