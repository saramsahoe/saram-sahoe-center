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
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
        <Image
          src="/icon.svg"
          alt=""
          width={36}
          height={36}
          priority
          className="size-7 object-contain"
        />
      </span>
      <span className={cn("flex min-w-0 flex-col leading-none", className)}>
        <span className="truncate font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </span>
        <span className="mt-1 truncate font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase">
          {siteConfig.nameEn}
        </span>
      </span>
    </Link>
  )
}
