"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogIn, LogOut, MapPin, Menu, UserPlus } from "lucide-react"

import { getMyProfile } from "@/app/actions/profile"
import { signOut } from "@/app/actions/auth"
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
import { createClient } from "@/lib/supabase/client"
import { getActiveNavHref, mainNav, siteConfig } from "@/lib/navigation"
import type { Profile } from "@/lib/account-content"

export function MobileNav({ initialProfile }: { initialProfile: Profile | null }) {
  const [open, setOpen] = React.useState(false)
  // UserNav(데스크톱 헤더)와 같은 패턴 — 서버에서 내려준 초기값으로 바로 그리고,
  // 로그인/로그아웃 시 실시간으로 갱신한다.
  const [profile, setProfile] = React.useState<Profile | null>(initialProfile)
  const [signingOut, setSigningOut] = React.useState(false)
  const pathname = usePathname()
  const activeHref = getActiveNavHref(pathname, mainNav)

  React.useEffect(() => {
    const supabase = createClient()

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setProfile(null)
          return
        }
        getMyProfile().then(setProfile)
      }
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  const close = () => setOpen(false)
  const isAdmin = profile?.role === "admin"

  function handleSignOut() {
    setSigningOut(true)
    signOut().then(() => {
      close()
      // signIn과 같은 이유로, 소프트 네비게이션 대신 완전히 새로 불러온다.
      window.location.assign("/")
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-gradient-to-r hover:from-[#EC6633] hover:to-[#5BC4EE] hover:text-white"
        >
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
          <SheetDescription className="font-mono text-[0.9375rem] tracking-[0.16em]">
            {siteConfig.nameEn}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <nav
          aria-label="모바일 주요 메뉴"
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4"
        >
          {mainNav.map((item) => {
            const isActive = item.href === activeHref

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
                  <span className="font-heading text-[1.40625rem] font-medium">
                    {item.title}
                  </span>
                </span>
                <span className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.14em] text-muted-foreground">
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
            <span className="font-mono text-[length:var(--cfg-eyebrow-size)] tracking-[0.14em] opacity-80">
              Location
            </span>
          </Link>
        </div>

        <SheetFooter className="gap-3 px-6 pb-8">
          <Separator className="mb-1" />
          {profile ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/mypage"
                onClick={close}
                className="rounded-md border border-border px-4 py-3 text-center font-heading text-sm font-medium text-foreground transition-colors hover:bg-secondary/70"
              >
                {profile.fullName} 님
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/members"
                  onClick={close}
                  className="rounded-md border border-border px-4 py-3 text-center font-heading text-sm font-medium text-foreground transition-colors hover:bg-secondary/70"
                >
                  관리자
                </Link>
              )}
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center"
                disabled={signingOut}
                onClick={handleSignOut}
              >
                <LogOut data-icon="inline-start" />
                로그아웃
              </Button>
            </div>
          ) : (
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
          )}
          <p className="mt-1 text-center font-mono text-[0.625rem] text-muted-foreground">
            {siteConfig.email}
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
