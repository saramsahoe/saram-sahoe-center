"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

import { getMyProfile } from "@/app/actions/profile"
import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()

    async function syncUser(nextUser: User | null) {
      setUser(nextUser)
      if (!nextUser) {
        setDisplayName(null)
        setIsAdmin(false)
        return
      }
      const profile = await getMyProfile()
      setDisplayName(profile?.fullName ?? nextUser.email ?? null)
      setIsAdmin(profile?.role === "admin")
    }

    supabase.auth.getUser().then(({ data }) => {
      syncUser(data.user).finally(() => setLoaded(true))
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        syncUser(session?.user ?? null)
      }
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  if (!loaded) {
    return <div className="h-8 w-24" aria-hidden="true" />
  }

  if (!user) {
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

  return (
    <div className="hidden items-center gap-3 sm:flex">
      {isAdmin && (
        <Link
          href="/admin/members"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          관리자
        </Link>
      )}
      <Link
        href="/mypage"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {displayName} 님
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
