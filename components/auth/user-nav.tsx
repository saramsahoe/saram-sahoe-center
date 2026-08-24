"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoaded(true)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
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
          className="hidden bg-accent text-accent-foreground hover:bg-accent/90 sm:inline-flex"
          asChild
        >
          <Link href="/signup">회원가입</Link>
        </Button>
      </>
    )
  }

  const name = (user.user_metadata?.name as string | undefined) ?? user.email

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <span className="text-sm text-muted-foreground">{name} 님</span>
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
