import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/navigation"

export function SiteLogo({
  className,
  variant = "main",
  onNavigate,
}: {
  className?: string
  /** main: 가로형 (헤더 등 좁고 넓은 공간), full: 세로형 (카드 헤더 등 여백이 있는 공간) */
  variant?: "main" | "full"
  onNavigate?: () => void
}) {
  const isFull = variant === "full"

  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={`${siteConfig.name} 홈으로 이동`}
      className={cn(
        "inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className
      )}
    >
      <Image
        src={isFull ? "/brand/logo-full.png" : "/brand/logo-main.png"}
        alt=""
        width={isFull ? 2241 : 1600}
        height={isFull ? 2176 : 1000}
        priority
        className={cn(
          "w-auto object-contain",
          isFull ? "h-28 sm:h-32" : "h-14"
        )}
      />
    </Link>
  )
}
