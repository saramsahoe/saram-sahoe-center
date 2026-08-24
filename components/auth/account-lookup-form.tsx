"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2 } from "lucide-react"

import { findAccountId, requestPasswordReset } from "@/app/actions/auth"
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

  async function handleSubmit(values: LookupValues) {
    setSubmitting(true)
    setError(null)
    setMessage(null)

    const result =
      mode === "find-id"
        ? await findAccountId(values.identifier)
        : await requestPasswordReset(values.identifier)

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
          {mode === "find-id"
            ? "가입 시 등록한 이름을 입력하시면 해당 계정의 이메일(아이디)로 안내 메일을 보내드립니다."
            : "가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 메일을 보내드립니다."}
        </p>

        {mode === "find-id" ? (
          <FormField
            control={form.control}
            name="identifier"
            rules={{ required: "이름을 입력해 주세요." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="홍길동"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
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
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {submitting
            ? "전송 중..."
            : mode === "find-id"
              ? "아이디 안내 메일 전송"
              : "비밀번호 재설정 메일 전송"}
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
