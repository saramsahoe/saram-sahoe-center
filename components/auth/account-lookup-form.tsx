"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2 } from "lucide-react"

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

type LookupValues = { email: string }

export function AccountLookupForm({
  mode,
}: {
  mode: "find-id" | "find-password"
}) {
  const [sent, setSent] = useState(false)
  const form = useForm<LookupValues>({ defaultValues: { email: "" } })

  function handleSubmit(values: LookupValues) {
    // placeholder — wire up to Supabase auth (supabase.auth.resetPasswordForEmail, etc.)
    console.log(values)
    setSent(true)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {mode === "find-id"
            ? "가입 시 등록한 이메일 주소를 입력하시면 아이디 확인 메일을 보내드립니다."
            : "가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 메일을 보내드립니다."}
        </p>

        <FormField
          control={form.control}
          name="email"
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
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          인증 메일 전송 (Send Reset Link)
        </Button>

        {sent && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>메일을 보냈습니다</AlertTitle>
            <AlertDescription>
              입력하신 이메일로{" "}
              {mode === "find-id" ? "아이디 확인" : "비밀번호 재설정"} 안내를
              발송했습니다.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  )
}
