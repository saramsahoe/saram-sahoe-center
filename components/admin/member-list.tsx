"use client"

import { useState } from "react"
import { Ban, CheckCircle2, PenSquare } from "lucide-react"

import {
  setMemberActive,
  updateMemberEmail,
  updateMemberProfile,
} from "@/app/actions/admin"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import { memberRoles, roleLabel, type MemberRole, type Profile } from "@/lib/account-content"

export function MemberList({
  initialMembers,
  currentUserId,
}: {
  initialMembers: Profile[]
  currentUserId: string
}) {
  const [members, setMembers] = useState<Profile[]>(initialMembers)
  const [listError, setListError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const [editing, setEditing] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [affiliation, setAffiliation] = useState("")
  const [role, setRole] = useState<MemberRole>("user")
  const [email, setEmail] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  function openEdit(member: Profile) {
    setEditing(member)
    setName(member.fullName)
    setAffiliation(member.affiliation ?? "")
    setRole(member.role)
    setEmail(member.email)
    setFormError(null)
  }

  async function handleSave() {
    if (!editing) return
    setFormSubmitting(true)
    setFormError(null)

    const profileResult = await updateMemberProfile({
      userId: editing.id,
      fullName: name,
      affiliation,
      role,
    })

    if (profileResult.error) {
      setFormSubmitting(false)
      setFormError(profileResult.error)
      return
    }

    let emailResult: { error: string | null } = { error: null }
    if (email.trim() !== editing.email) {
      emailResult = await updateMemberEmail({ userId: editing.id, email })
    }

    setFormSubmitting(false)

    if (emailResult.error) {
      setFormError(emailResult.error)
      return
    }

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editing.id
          ? {
              ...m,
              fullName: name.trim(),
              affiliation: affiliation.trim() || null,
              role,
              email: email.trim(),
            }
          : m
      )
    )
    setEditing(null)
  }

  async function handleToggleActive(member: Profile) {
    const nextActive = !member.isActive
    const label = nextActive ? "활성화" : "비활성화"
    if (!window.confirm(`${member.fullName} 님을 ${label}할까요?`)) return

    setPendingId(member.id)
    setListError(null)
    const result = await setMemberActive({
      userId: member.id,
      isActive: nextActive,
    })
    setPendingId(null)

    if (result.error) {
      setListError(result.error)
      return
    }

    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, isActive: nextActive } : m))
    )
  }

  if (members.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        회원이 없습니다.
      </p>
    )
  }

  return (
    <div>
      {listError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                이름
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                이메일
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                소속
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                등급
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                상태
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                가입일
              </th>
              <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className={cn(
                  "border-b border-border last:border-0",
                  !member.isActive && "bg-muted/40 text-muted-foreground grayscale"
                )}
              >
                <td className="px-4 py-3 font-heading text-foreground">
                  {member.fullName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {member.email}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {member.affiliation ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={member.role === "admin" ? "accent" : "outline"}>
                    {roleLabel[member.role]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={member.isActive ? "outline" : "destructive"}>
                    {member.isActive ? "활성" : "비활성"}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {member.createdAt.slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(member)}
                    >
                      <PenSquare data-icon="inline-start" />
                      수정
                    </Button>
                    <Button
                      type="button"
                      variant={member.isActive ? "destructive" : "outline"}
                      size="sm"
                      disabled={
                        pendingId === member.id || member.id === currentUserId
                      }
                      onClick={() => handleToggleActive(member)}
                    >
                      {member.isActive ? (
                        <>
                          <Ban data-icon="inline-start" />
                          비활성화
                        </>
                      ) : (
                        <>
                          <CheckCircle2 data-icon="inline-start" />
                          활성화
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>회원 정보 수정</DialogTitle>
            <DialogDescription>
              이름, 등급, 이메일을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="member-name">이름</FieldLabel>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-affiliation">소속</FieldLabel>
              <Input
                id="member-affiliation"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="예: OO대학교 사회학과 교수"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="member-role">등급</FieldLabel>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as MemberRole)}
              >
                <SelectTrigger id="member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {memberRoles.map((option) => (
                    <SelectItem key={option} value={option}>
                      {roleLabel[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="member-email">이메일 (아이디)</FieldLabel>
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                취소
              </Button>
              <Button
                type="button"
                disabled={formSubmitting}
                onClick={handleSave}
                className="bg-button text-button-foreground hover:bg-button/90"
              >
                {formSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </FieldGroup>
        </DialogContent>
      </Dialog>
    </div>
  )
}
