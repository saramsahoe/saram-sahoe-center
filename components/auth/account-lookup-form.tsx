"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2, SearchX } from "lucide-react"

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
  const [foundEmails, setFoundEmails] = useState<string[] | null>(null)
  const form = useForm<LookupValues>({ defaultValues: { identifier: "" } })

  async function handleSubmit(values: LookupValues) {
    setSubmitting(true)
    setError(null)
    setMessage(null)
    setFoundEmails(null)

    if (mode === "find-id") {
      const result = await findAccountId(values.identifier)
      setSubmitting(false)
      if (result.error) {
        setError(result.error)
        return
      }
      setFoundEmails(result.matches)
      return
    }

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
          {mode === "find-id"
            ? "가입 시 등록한 이름을 입력하시면 일치하는 계정의 이메일(아이디)을 바로 확인할 수 있습니다."
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
            ? "확인 중..."
            : mode === "find-id"
              ? "아이디 조회"
              : "비밀번호 재설정 메일 전송"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {foundEmails && foundEmails.length > 0 && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>계정을 찾았습니다</AlertTitle>
            <AlertDescription>
              <ul className="mt-1 flex flex-col gap-1">
                {foundEmails.map((email) => (
                  <li key={email} className="font-mono">
                    {email}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {foundEmails && foundEmails.length === 0 && (
          <Alert variant="destructive">
            <SearchX />
            <AlertTitle>일치하는 계정이 없습니다</AlertTitle>
            <AlertDescription>
              입력하신 이름으로 등록된 계정을 찾을 수 없습니다.
            </AlertDescription>
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
