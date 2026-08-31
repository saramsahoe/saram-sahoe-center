"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserNav } from "@/components/auth/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { SiteLogo } from "@/components/site-logo"
import { cn } from "@/lib/utils"
import { getActiveNavHref, mainNav } from "@/lib/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const activeHref = getActiveNavHref(pathname, mainNav)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav
          aria-label="주요 메뉴"
          className="ml-6 hidden flex-1 items-center gap-1 lg:flex"
        >
          {mainNav.map((item) => {
            const isActive = item.href === activeHref

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-2 font-heading text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.title}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 -bottom-[1.3125rem] h-[2px] rounded-full transition-all",
                    isActive ? "bg-accent opacity-100" : "opacity-0"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <UserNav />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
