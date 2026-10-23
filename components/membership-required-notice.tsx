"use client"

import { useRouter } from "next/navigation"
import { LogIn, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const copy = {
  login: {
    icon: LogIn,
    title: "로그인이 필요합니다",
    description: "이 페이지는 로그인한 회원만 볼 수 있습니다.",
    cta: "로그인하러 가기",
    href: "/login",
  },
  upgrade: {
    icon: ShieldAlert,
    title: "정회원 승급이 필요합니다",
    description:
      "이 페이지는 정회원부터 이용할 수 있습니다. 정회원 승급 관련 문의는 관리자에게 연락해 주세요.",
    cta: "메인페이지로 이동",
    href: "/",
  },
} as const

/** 비로그인/일반회원(미승급) 사용자가 정회원 전용 페이지(게시판, 갤러리)에 들어왔을 때 보여준다. */
export function MembershipRequiredNotice({
  variant,
}: {
  variant: "login" | "upgrade"
}) {
  const router = useRouter()
  const { icon: Icon, title, description, cta, href } = copy[variant]

  return (
    <Dialog open onOpenChange={(open) => !open && router.push("/")}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Icon className="size-6" strokeWidth={1.5} />
          </span>
          <DialogTitle className="mt-2">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          className="w-full bg-button text-button-foreground hover:bg-button/90"
          onClick={() => router.push(href)}
        >
          {cta}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
