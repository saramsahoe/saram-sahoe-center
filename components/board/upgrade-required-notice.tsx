"use client"

import { useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function UpgradeRequiredNotice() {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={(open) => !open && router.push("/")}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" strokeWidth={1.5} />
          </span>
          <DialogTitle className="mt-2">정회원 승급이 필요합니다</DialogTitle>
          <DialogDescription>
            게시판은 정회원부터 이용할 수 있습니다. 정회원 승급 관련 문의는
            관리자에게 연락해 주세요.
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => router.push("/")}
        >
          메인페이지로 이동
        </Button>
      </DialogContent>
    </Dialog>
  )
}
