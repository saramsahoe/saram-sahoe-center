import type { Metadata } from "next"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { SiteLogo } from "@/components/site-logo"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "비밀번호 재설정",
}

export default function ResetPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="justify-items-center gap-3 text-center">
            <SiteLogo className="items-center" />
            <CardTitle className="text-xl">비밀번호 재설정</CardTitle>
            <CardDescription>
              새로 사용할 비밀번호를 입력해 주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
