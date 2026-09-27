"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2, Mail } from "lucide-react"

import { requestPasswordReset } from "@/app/actions/auth"
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
import { siteConfig } from "@/lib/navigation"

type LookupValues = { identifier: string }

export function AccountLookupForm({
  mode,
}: {
  mode: "find-id" | "find-password"
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const form = useForm<LookupValues>({ defaultValues: { identifier: "" } })

  if (mode === "find-id") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Mail className="size-6" strokeWidth={1.5} />
        </span>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          이메일 조회는 본인 확인을 위해 화면에서 바로 제공하지 않습니다.
          <br />
          센터 이메일로 문의를 남겨 주시면 확인 후 도와드리겠습니다.
        </p>
        <Button
          size="lg"
          className="bg-button text-button-foreground hover:bg-button/90"
          asChild
        >
          <a href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}로 문의하기
          </a>
        </Button>
      </div>
    )
  }

  async function handleSubmit(values: LookupValues) {
    setSubmitting(true)
    setError(null)
    setMessage(null)

    const result = await requestPasswordReset(values.identifier)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setMessage(result.message ?? "요청이 접수되었습니다.")
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 메일을 보내드립니다.
        </p>

        <FormField
          control={form.control}
          name="identifier"
          rules={{
            required: "이메일을 입력해 주세요.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "올바른 이메일 형식이 아닙니다.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>등록된 이메일</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="bg-button text-button-foreground hover:bg-button/90"
        >
          {submitting ? "확인 중..." : "비밀번호 재설정 메일 전송"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>메일을 보냈습니다</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  )
}
