"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn, MapPin, Menu, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { mainNav, siteConfig } from "@/lib/navigation"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[19rem] gap-0 bg-background p-0 sm:max-w-[19rem]"
      >
        <SheetHeader className="px-6 pt-6 pb-4 text-left">
          <SheetTitle className="font-heading text-base tracking-tight">
            {siteConfig.name}
          </SheetTitle>
          <SheetDescription className="font-mono text-[0.625rem] tracking-[0.16em] uppercase">
            {siteConfig.nameEn}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <nav
          aria-label="모바일 주요 메뉴"
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4"
        >
          {mainNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-baseline justify-between rounded-md px-3 py-3 transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-0.5 rounded-full transition-colors",
                      isActive ? "bg-accent" : "bg-transparent"
                    )}
                  />
                  <span className="font-heading text-[0.9375rem] font-medium">
                    {item.title}
                  </span>
                </span>
                <span className="font-mono text-[0.5625rem] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.caption}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="px-6">
          <Link
            href="/location"
            onClick={close}
            className="flex items-center justify-between rounded-md bg-button px-4 py-3.5 text-button-foreground transition-opacity hover:opacity-90"
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="size-4" aria-hidden="true" />
              <span className="font-heading text-sm font-semibold">
                오시는 길
              </span>
            </span>
            <span className="font-mono text-[0.5625rem] tracking-[0.14em] uppercase opacity-80">
              Location
            </span>
          </Link>
        </div>

        <SheetFooter className="gap-3 px-6 pb-8">
          <Separator className="mb-1" />
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center"
              asChild
            >
              <Link href="/login" onClick={close}>
                <LogIn data-icon="inline-start" />
                로그인
              </Link>
            </Button>
            <Button size="lg" className="w-full justify-center" asChild>
              <Link href="/signup" onClick={close}>
                <UserPlus data-icon="inline-start" />
                회원가입
              </Link>
            </Button>
          </div>
          <p className="mt-1 text-center font-mono text-[0.625rem] text-muted-foreground">
            {siteConfig.email}
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
