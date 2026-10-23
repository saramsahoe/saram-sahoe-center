"use client"

import { useState, type FormEvent } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Committee } from "@/lib/people-content"

export type CommitteeFormValues = { name: string; description: string }

export function CommitteeFormDialog({
  open,
  onOpenChange,
  editingCommittee,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCommittee?: Committee | null
  onSubmit: (values: CommitteeFormValues) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [name, setName] = useState(editingCommittee?.name ?? "")
  const [description, setDescription] = useState(editingCommittee?.description ?? "")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCommittee ? "위원회 수정" : "위원회 추가"}</DialogTitle>
          <DialogDescription>
            위원회 이름과 수행 역할을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="committee-name">
                위원회 이름 <span className="font-normal text-muted-foreground">(&quot;위원회&quot;는 빼고 입력)</span>
              </FieldLabel>
              <Input
                id="committee-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 거버넌스"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="committee-description">수행 역할</FieldLabel>
              <Textarea
                id="committee-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: OOO를 연구, 실천"
                className="min-h-20"
              />
            </Field>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-button text-button-foreground hover:bg-button/90"
              >
                {submitting ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
