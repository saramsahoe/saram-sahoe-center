"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// 사이트는 라벤더 배경 + 검은 글씨의 단일 톤으로 통일하기로 해서, 시스템 다크모드나
// 숨겨진 단축키(예전엔 "d")로 다크 테마가 켜지지 않도록 고정한다.
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
