import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/navigation"

export function SiteLogo({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={`${siteConfig.name} 홈으로 이동`}
      className="group flex items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-secondary">
        <Image
          src="/brand/saram-brushmark.png"
          alt=""
          width={72}
          height={72}
          priority
          className="size-9 scale-[1.75] object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
        />
      </span>
      <span className={cn("flex min-w-0 flex-col leading-none", className)}>
        <span className="truncate font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </span>
        <span className="mt-1 truncate font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase">
          People &amp; Society
        </span>
      </span>
    </Link>
  )
}
