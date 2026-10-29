"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"

import { getMyProfile } from "@/app/actions/profile"
import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/account-content"

export function UserNav({ initialProfile }: { initialProfile: Profile | null }) {
  // 서버에서 이미 로그인 상태를 확인해 내려주므로, 처음 화면을 그릴 때부터 바로
  // 맞는 상태(로그인/비로그인)로 보여줄 수 있다 — 클라이언트에서 다시 확인하는
  // 동안 깜빡이며 로딩 상태를 보여줄 필요가 없다.
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
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

  if (!profile) {
    return (
      <>
        <Button
          variant="ghost"
          size="lg"
          className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          asChild
        >
          <Link href="/login">로그인</Link>
        </Button>
        <Button
          size="lg"
          className="hidden bg-button text-button-foreground hover:bg-button/90 sm:inline-flex"
          asChild
        >
          <Link href="/signup">회원가입</Link>
        </Button>
      </>
    )
  }

  const isAdmin = profile.role === "admin"

  return (
    <div className="hidden items-center gap-3 sm:flex">
      {isAdmin && (
        <Link
          href="/admin/members"
          className="text-[1.3125rem] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          관리자
        </Link>
      )}
      <Link
        href="/mypage"
        className="text-[1.3125rem] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {profile.fullName} 님
      </Link>
      <Button
        variant="outline"
        size="lg"
        disabled={pending}
        onClick={() => startTransition(() => signOut())}
      >
        로그아웃
      </Button>
    </div>
  )
}
