"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { AuthTab } from "@/components/auth/types"

type LoginValues = {
  email: string
  password: string
  remember: boolean
}

export function LoginForm({
  onSwitchTab,
}: {
  onSwitchTab: (tab: AuthTab) => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginValues>({
    defaultValues: { email: "", password: "", remember: false },
  })

  function handleSubmit(values: LoginValues) {
    // placeholder — wire up to Supabase auth (supabase.auth.signInWithPassword)
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "이메일 또는 아이디를 입력해 주세요." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일 / 아이디</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="username"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{ required: "비밀번호를 입력해 주세요." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-9"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal text-muted-foreground">
                로그인 유지 (Remember me)
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          로그인 (Login)
        </Button>

        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => onSwitchTab("find-id")}
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            아이디 찾기
          </button>
          <span aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => onSwitchTab("find-password")}
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            비밀번호 찾기
          </button>
          <span aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => onSwitchTab("signup")}
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            회원가입
          </button>
        </div>
      </form>
    </Form>
  )
}
