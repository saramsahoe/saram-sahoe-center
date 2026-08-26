import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { requireAdmin } from "@/app/actions/admin"

export const metadata: Metadata = {
  title: "관리자",
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const isAdmin = await requireAdmin()
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <p className="font-mono text-[0.625rem] tracking-[0.22em] text-accent uppercase">
        Admin
      </p>
      <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
        관리자
      </h1>

      <nav
        aria-label="관리자 메뉴"
        className="mt-6 inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1"
      >
        <Link
          href="/admin/members"
          className="rounded-full px-4 py-2 font-heading text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
        >
          회원 관리
        </Link>
        <Link
          href="/admin/posts"
          className="rounded-full px-4 py-2 font-heading text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
        >
          게시글 관리
        </Link>
      </nav>

      <div className="mt-8">{children}</div>
    </section>
  )
}
