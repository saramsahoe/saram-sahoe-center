"use client"

import { useState } from "react"

import { AccountLookupForm } from "@/components/auth/account-lookup-form"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import type { AuthTab } from "@/components/auth/types"
import { SiteLogo } from "@/components/site-logo"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabCopy: Record<AuthTab, { title: string; description: string }> = {
  login: {
    title: "로그인",
    description: "연구센터 사람과 사회 계정으로 로그인하세요.",
  },
  signup: {
    title: "회원가입",
    description: "몇 가지 정보만 입력하면 바로 시작할 수 있어요.",
  },
  "find-id": {
    title: "아이디 찾기",
    description: "등록된 이메일로 아이디를 확인하세요.",
  },
  "find-password": {
    title: "비밀번호 찾기",
    description: "등록된 이메일로 비밀번호를 재설정하세요.",
  },
}

export function AuthTabs({
  defaultTab = "login",
}: {
  defaultTab?: AuthTab
}) {
  const [tab, setTab] = useState<AuthTab>(defaultTab)

  return (
    <div className="mx-auto w-full max-w-md">
      <Tabs value={tab} onValueChange={(value) => setTab(value as AuthTab)}>
        <TabsList className="flex-wrap justify-center">
          <TabsTrigger value="login">로그인</TabsTrigger>
          <TabsTrigger value="signup">회원가입</TabsTrigger>
          <TabsTrigger value="find-id">아이디 찾기</TabsTrigger>
          <TabsTrigger value="find-password">비밀번호 찾기</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader className="justify-items-center gap-3 text-center">
            {tab === "login" && <SiteLogo className="items-center" />}
            <CardTitle className="text-xl">{tabCopy[tab].title}</CardTitle>
            <CardDescription>{tabCopy[tab].description}</CardDescription>
          </CardHeader>

          <CardContent>
            <TabsContent value="login" className="mt-0">
              <LoginForm onSwitchTab={setTab} />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <SignupForm />
            </TabsContent>
            <TabsContent value="find-id" className="mt-0">
              <AccountLookupForm mode="find-id" />
            </TabsContent>
            <TabsContent value="find-password" className="mt-0">
              <AccountLookupForm mode="find-password" />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
