"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

type ResetValues = { password: string; confirmPassword: string }

export function ResetPasswordForm() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const form = useForm<ResetValues>({
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    const supabase = createClient()

    // 재설정 메일의 링크를 클릭하면 Supabase가 URL을 읽어 복구 세션을 만든다.
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session))
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  async function handleSubmit(values: ResetValues) {
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    })

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    setDone(true)
    window.setTimeout(() => router.push("/login"), 1500)
  }

  if (!ready) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          유효하지 않거나 만료된 링크입니다. 비밀번호 찾기를 다시 시도해 주세요.
        </AlertDescription>
      </Alert>
    )
  }

  if (done) {
    return (
      <Alert variant="success">
        <CheckCircle2 />
        <AlertTitle>비밀번호가 변경되었습니다</AlertTitle>
        <AlertDescription>잠시 후 로그인 페이지로 이동합니다.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "새 비밀번호를 입력해 주세요.",
            minLength: { value: 8, message: "8자 이상 입력해 주세요." },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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
          name="confirmPassword"
          rules={{
            required: "비밀번호를 다시 입력해 주세요.",
            validate: (value) =>
              value === form.getValues("password") ||
              "비밀번호가 일치하지 않습니다.",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="bg-button text-button-foreground hover:bg-button/90"
        >
          {submitting ? "변경 중..." : "비밀번호 변경"}
        </Button>
      </form>
    </Form>
  )
}
