import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getMyProfile } from "@/app/actions/profile"
import { ProfileForm } from "@/components/mypage/profile-form"
import { SiteLogo } from "@/components/site-logo"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "내 정보",
}

export default async function MyPage() {
  const profile = await getMyProfile()
  if (!profile) {
    redirect("/login")
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader className="justify-items-center gap-3 text-center">
            <SiteLogo className="items-center" />
            <CardTitle className="text-xl">내 정보</CardTitle>
            <CardDescription>
              회원 정보를 확인하고 수정할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
