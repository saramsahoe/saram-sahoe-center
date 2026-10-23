"use client"

import { useState, type FormEvent } from "react"

import type { OrgMemberInput } from "@/app/actions/org-members"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LinkListEditor, type EditableLink } from "@/components/people/link-list-editor"
import { TitlePicker } from "@/components/people/title-picker"
import {
  memberCategoryLabel,
  type Committee,
  type Member,
  type MemberCategory,
  type TitleOption,
} from "@/lib/people-content"

const categoryOptions: MemberCategory[] = ["director", "advisory", "office"]

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function arrayToLines(value: string[]): string {
  return value.join("\n")
}

export function MemberFormDialog({
  open,
  onOpenChange,
  editingMember,
  committees,
  titleOptions,
  setTitleOptions,
  onSubmit,
  error,
  submitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingMember?: Member | null
  committees: Committee[]
  titleOptions: TitleOption[]
  setTitleOptions: (next: TitleOption[]) => void
  onSubmit: (values: OrgMemberInput) => void | Promise<void>
  error?: string | null
  submitting?: boolean
}) {
  const [name, setName] = useState(editingMember?.name ?? "")
  const [category, setCategory] = useState<MemberCategory>(
    editingMember?.category ?? "director"
  )
  const [titles, setTitles] = useState<string[]>(editingMember?.titles ?? [])
  const [chairedCommitteeId, setChairedCommitteeId] = useState<string | null>(
    editingMember?.chairedCommitteeId ?? null
  )
  const [career, setCareer] = useState(arrayToLines(editingMember?.career ?? []))
  const [links, setLinks] = useState<EditableLink[]>(editingMember?.links ?? [])

  const isChair = titles.includes("위원장")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      category,
      titles,
      chairedCommitteeId: isChair ? chairedCommitteeId : null,
      career: linesToArray(career),
      links: links.filter((link) => link.label.trim() && link.url.trim()),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editingMember ? "구성원 수정" : "구성원 추가"}</DialogTitle>
          <DialogDescription>
            이름, 분류, 직함을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="member-name">이름</FieldLabel>
                <Input
                  id="member-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="member-category">분류</FieldLabel>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as MemberCategory)}
                >
                  <SelectTrigger id="member-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {memberCategoryLabel[option]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>직함 (뱃지, 복수 선택)</FieldLabel>
              <TitlePicker
                options={titleOptions}
                setOptions={setTitleOptions}
                selected={titles}
                onChange={setTitles}
              />
            </Field>

            {isChair && (
              <Field>
                <FieldLabel htmlFor="member-committee">
                  맡은 위원회{" "}
                  <span className="font-normal text-muted-foreground">
                    (&quot;OO위원회 위원장&quot;으로 표시됩니다)
                  </span>
                </FieldLabel>
                <Select
                  value={chairedCommitteeId ?? undefined}
                  onValueChange={(value) => setChairedCommitteeId(value)}
                >
                  <SelectTrigger id="member-committee">
                    <SelectValue placeholder="위원회를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {committees.map((committee) => (
                      <SelectItem key={committee.id} value={committee.id}>
                        {committee.name}위원회
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="member-career">
                주요 경력{" "}
                <span className="font-normal text-muted-foreground">(줄바꿈으로 구분)</span>
              </FieldLabel>
              <Textarea
                id="member-career"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="min-h-24"
              />
            </Field>

            <Field>
              <FieldLabel>참고 링크</FieldLabel>
              <LinkListEditor links={links} onChange={setLinks} />
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
