"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2, Eye, EyeOff, Mail } from "lucide-react"

import {
  requestPasswordResetCode,
  resetPasswordWithCode,
  verifyPasswordResetCode,
} from "@/app/actions/auth"
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
type ResetStep = "email" | "code" | "password" | "done"

export function AccountLookupForm({
  mode,
}: {
  mode: "find-id" | "find-password"
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const form = useForm<LookupValues>({ defaultValues: { identifier: "" } })

  const [step, setStep] = useState<ResetStep>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

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

  async function handleRequestCode(values: LookupValues) {
    setSubmitting(true)
    setError(null)

    const result = await requestPasswordResetCode(values.identifier)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setEmail(values.identifier)
    setMessage(result.message ?? null)
    setStep("code")
  }

  async function handleVerifyCode() {
    if (!code.trim()) {
      setError("인증번호를 입력해 주세요.")
      return
    }

    setSubmitting(true)
    setError(null)
    const result = await verifyPasswordResetCode(email, code)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setMessage(null)
    setStep("password")
  }

  async function handleResetPassword() {
    if (newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setSubmitting(true)
    setError(null)
    const result = await resetPasswordWithCode({ email, newPassword })
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setMessage(result.message ?? null)
    setStep("done")
  }

  if (step === "done") {
    return (
      <Alert variant="success">
        <CheckCircle2 />
        <AlertTitle>비밀번호가 변경되었습니다</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  if (step === "code") {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          <strong className="text-foreground">{email}</strong>(으)로 보낸 6자리 인증번호를 입력해 주세요.
        </p>

        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="인증번호 6자리"
          inputMode="numeric"
          maxLength={6}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && !error && (
          <Alert variant="success">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          size="lg"
          disabled={submitting}
          onClick={handleVerifyCode}
          className="bg-button text-button-foreground hover:bg-button/90"
        >
          {submitting ? "확인 중..." : "인증번호 확인"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setStep("email")
            setCode("")
            setError(null)
            setMessage(null)
          }}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          이메일 다시 입력하기
        </button>
      </div>
    )
  }

  if (step === "password") {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          새로 사용할 비밀번호를 입력해 주세요.
        </p>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 (8자 이상)"
            autoComplete="new-password"
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <Input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 확인"
          autoComplete="new-password"
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          size="lg"
          disabled={submitting}
          onClick={handleResetPassword}
          className="bg-button text-button-foreground hover:bg-button/90"
        >
          {submitting ? "변경 중..." : "비밀번호 변경"}
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRequestCode)}
        className="flex flex-col gap-5"
      >
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          가입 시 등록한 이메일 주소를 입력하시면 인증번호를 보내드립니다.
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
          {submitting ? "전송 중..." : "인증번호 전송"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  )
}
