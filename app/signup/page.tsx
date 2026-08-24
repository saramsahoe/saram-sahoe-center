import type { Metadata } from "next"

import { AuthTabs } from "@/components/auth/auth-tabs"

export const metadata: Metadata = {
  title: "회원가입",
}

export default function SignupPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <AuthTabs defaultTab="signup" />
    </section>
  )
}
