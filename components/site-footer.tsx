import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { mainNav, siteConfig } from "@/lib/navigation"

const legalNav = [
  { title: "이용약관", href: "/terms" },
  { title: "개인정보처리방침", href: "/privacy" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-heading text-sm font-semibold tracking-tight text-foreground">
                {siteConfig.name}
              </p>
              <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
                {siteConfig.nameEn}
              </p>
            </div>

            <dl className="flex flex-col gap-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-foreground/70">대표</dt>
                <dd>{siteConfig.representative}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-foreground/70">주소</dt>
                <dd className="text-pretty">{siteConfig.address}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-foreground/70">전화</dt>
                <dd>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-14 shrink-0 text-foreground/70">문의</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <nav
            aria-label="바닥글 메뉴"
            className="flex flex-col gap-3 md:items-end"
          >
            <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
              Sitemap
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 md:flex-col md:items-end md:gap-y-2.5">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.8125rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/location"
                  className="text-[0.8125rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  오시는 길
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
