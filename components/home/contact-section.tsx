"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Send } from "lucide-react"

import { submitInquiry } from "@/app/actions/contact"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">(
    "idle"
  )
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setStatus("submitting")
    setError(null)

    const result = await submitInquiry({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      message: String(formData.get("message") ?? ""),
    })

    if (result.error) {
      setStatus("idle")
      setError(result.error)
      return
    }

    setStatus("submitted")
    form.reset()
  }

  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Contact Us (문의하기)
          </h2>
          <span className="font-mono text-[0.5625rem] tracking-[0.16em] text-muted-foreground uppercase">
            Get in Touch
          </span>
        </div>

        <Separator className="mt-6" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
            연구 협력, 세미나 참여, 언론 문의 등 무엇이든 편하게 남겨주세요.
            담당 연구원이 영업일 기준 3일 이내에 이메일로 답변드립니다.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl" noValidate>
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="contact-name">이름</FieldLabel>
                  <Input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="홍길동"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact-email">이메일</FieldLabel>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="contact-org">
                  소속{" "}
                  <span className="font-normal text-muted-foreground">
                    (선택)
                  </span>
                </FieldLabel>
                <Input
                  id="contact-org"
                  name="organization"
                  autoComplete="organization"
                  placeholder="소속 기관 또는 단체"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="contact-message">문의 내용</FieldLabel>
                <Textarea
                  id="contact-message"
                  name="message"
                  required
                  placeholder="문의하실 내용을 남겨주세요."
                  className="min-h-32"
                />
              </Field>

              {status === "submitted" && (
                <Alert variant="success">
                  <CheckCircle2 />
                  <AlertTitle>문의가 접수되었습니다</AlertTitle>
                  <AlertDescription>
                    빠른 시일 내에 입력하신 이메일로 답변드리겠습니다.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "submitting"}
                  className="bg-button text-button-foreground hover:bg-button/90"
                >
                  {status === "submitting" ? "보내는 중..." : "문의 보내기"}
                  <Send data-icon="inline-end" />
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </section>
  )
}
