"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

import {
  sendSignupVerificationCode,
  signUp,
  verifySignupVerificationCode,
} from "@/app/actions/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Separator } from "@/components/ui/separator"

type SignupValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
  affiliation: string
  agreeTerms: boolean
  agreePrivacy: boolean
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [otpCode, setOtpCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpMessage, setOtpMessage] = useState<string | null>(null)
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)

  const form = useForm<SignupValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      affiliation: "",
      agreeTerms: false,
      agreePrivacy: false,
    },
  })

  const agreeTerms = useWatch({ control: form.control, name: "agreeTerms" })
  const agreePrivacy = useWatch({ control: form.control, name: "agreePrivacy" })
  const allAgreed = agreeTerms && agreePrivacy
  const email = useWatch({ control: form.control, name: "email" })
  const emailVerified = otpVerified && email === verifiedEmail

  async function handleSendCode() {
    const valid = await form.trigger("email")
    if (!valid) return

    setOtpSending(true)
    setOtpError(null)
    setOtpMessage(null)
    const result = await sendSignupVerificationCode(email)
    setOtpSending(false)

    if (result.error) {
      setOtpError(result.error)
      return
    }
    setOtpSent(true)
    setOtpMessage(result.message ?? "인증번호를 보냈습니다.")
  }

  async function handleVerifyCode() {
    if (!otpCode.trim()) {
      setOtpError("인증번호를 입력해 주세요.")
      return
    }

    setOtpVerifying(true)
    setOtpError(null)
    const result = await verifySignupVerificationCode(email, otpCode)
    setOtpVerifying(false)

    if (result.error) {
      setOtpError(result.error)
      return
    }
    setOtpVerified(true)
    setVerifiedEmail(email)
    setOtpMessage("이메일 인증이 완료되었습니다.")
  }

  async function handleSubmit(values: SignupValues) {
    if (!emailVerified) {
      setError("이메일 인증을 먼저 완료해 주세요.")
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccessMessage(null)
    const result = await signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      affiliation: values.affiliation,
    })
    setSubmitting(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    if (result?.message) {
      setSuccessMessage(result.message)
      form.reset()
    }
  }

  function toggleAll(checked: boolean) {
    form.setValue("agreeTerms", checked, { shouldValidate: true })
    form.setValue("agreePrivacy", checked, { shouldValidate: true })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "이름을 입력해 주세요." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input autoComplete="name" placeholder="홍길동" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormLabel>이메일 (이메일 인증)</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={emailVerified}
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  disabled={otpSending || emailVerified}
                  onClick={handleSendCode}
                >
                  {emailVerified
                    ? "인증완료"
                    : otpSending
                      ? "발송 중..."
                      : otpSent
                        ? "재발송"
                        : "인증"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {otpSent && !emailVerified && (
          <div className="flex gap-2">
            <Input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="인증번호 6자리"
              inputMode="numeric"
              maxLength={6}
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              disabled={otpVerifying}
              onClick={handleVerifyCode}
            >
              {otpVerifying ? "확인 중..." : "확인"}
            </Button>
          </div>
        )}

        {otpError && (
          <Alert variant="destructive">
            <AlertDescription>{otpError}</AlertDescription>
          </Alert>
        )}

        {otpMessage && !otpError && (
          <Alert variant="success">
            <AlertDescription>{otpMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "비밀번호를 입력해 주세요.",
              minLength: { value: 8, message: "8자 이상 입력해 주세요." },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
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
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className="pr-9"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={
                        showConfirm ? "비밀번호 숨기기" : "비밀번호 표시"
                      }
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirm ? (
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
        </div>

        <FormField
          control={form.control}
          name="affiliation"
          rules={{ required: "소속 기관 또는 직책을 입력해 주세요." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>소속 기관 / 직책</FormLabel>
              <FormControl>
                <Input placeholder="예: OO대학교 사회학과 교수" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 font-heading text-sm font-medium text-foreground">
            <Checkbox
              checked={allAgreed}
              onCheckedChange={(checked) => toggleAll(checked === true)}
            />
            전체 동의 (Select All)
          </label>

          <Separator />

          <FormField
            control={form.control}
            name="agreeTerms"
            rules={{ required: "이용약관에 동의해 주세요." }}
            render={({ field }) => (
              <FormItem className="flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  [필수] 이용약관 동의
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreePrivacy"
            rules={{ required: "개인정보처리방침에 동의해 주세요." }}
            render={({ field }) => (
              <FormItem className="flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  [필수] 개인정보처리방침 동의
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>가입 신청이 완료되었습니다</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting || !emailVerified}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {submitting
            ? "가입 처리 중..."
            : emailVerified
              ? "가입 완료 (Create Account)"
              : "이메일 인증을 완료해 주세요"}
        </Button>
      </form>
    </Form>
  )
}
