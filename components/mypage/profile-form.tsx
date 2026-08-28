"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"

import { updateMyPassword, updateMyProfile } from "@/app/actions/profile"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { roleLabel, type Profile } from "@/lib/account-content"

type ProfileValues = { fullName: string; affiliation: string }
type PasswordValues = { password: string; confirmPassword: string }

export function ProfileForm({ profile }: { profile: Profile }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [pwSubmitting, setPwSubmitting] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwMessage, setPwMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<ProfileValues>({
    defaultValues: {
      fullName: profile.fullName,
      affiliation: profile.affiliation ?? "",
    },
  })

  const passwordForm = useForm<PasswordValues>({
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function handleSubmit(values: ProfileValues) {
    setSubmitting(true)
    setError(null)
    setMessage(null)

    const result = await updateMyProfile(values)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    setMessage("정보가 수정되었습니다.")
  }

  async function handlePasswordSubmit(values: PasswordValues) {
    setPwSubmitting(true)
    setPwError(null)
    setPwMessage(null)

    const result = await updateMyPassword({ password: values.password })
    setPwSubmitting(false)

    if (result.error) {
      setPwError(result.error)
      return
    }
    setPwMessage("비밀번호가 변경되었습니다.")
    passwordForm.reset()
  }

  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
            <div>
              <p className="text-xs text-muted-foreground">이메일 (아이디)</p>
              <p className="text-sm text-foreground">{profile.email}</p>
            </div>
            <Badge variant="outline">{roleLabel[profile.role]}</Badge>
          </div>

          <FormField
            control={form.control}
            name="fullName"
            rules={{ required: "이름을 입력해 주세요." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affiliation"
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>저장되었습니다</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            {submitting ? "저장 중..." : "수정하기"}
          </Button>
        </form>
      </Form>

      <Separator />

      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="flex flex-col gap-5"
        >
          <h3 className="font-heading text-sm font-semibold text-foreground">
            비밀번호 변경
          </h3>

          <FormField
            control={passwordForm.control}
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
            control={passwordForm.control}
            name="confirmPassword"
            rules={{
              required: "비밀번호를 다시 입력해 주세요.",
              validate: (value) =>
                value === passwordForm.getValues("password") ||
                "비밀번호가 일치하지 않습니다.",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {pwError && (
            <Alert variant="destructive">
              <AlertDescription>{pwError}</AlertDescription>
            </Alert>
          )}

          {pwMessage && (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertDescription>{pwMessage}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" variant="outline" disabled={pwSubmitting}>
            {pwSubmitting ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
