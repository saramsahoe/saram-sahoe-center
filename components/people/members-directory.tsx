"use client"

import { useMemo, useState } from "react"
import { PenSquare } from "lucide-react"

import {
  createOrgMember,
  deleteOrgMember,
  reorderOrgMembers,
  updateOrgMember,
  type OrgMemberInput,
} from "@/app/actions/org-members"
import { SortableList } from "@/components/admin/sortable-list"
import { MemberCard } from "@/components/people/member-card"
import { MemberFormDialog } from "@/components/people/member-form-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Member, MemberCategory } from "@/lib/people-content"

const filters: { value: MemberCategory | "all"; label: string }[] = [
  { value: "all", label: "전체 (All)" },
  { value: "board", label: "이사회 (Board)" },
  { value: "committee", label: "위원회 (Committee)" },
  { value: "office", label: "사무국 (Office)" },
]

export function MembersDirectory({
  initialMembers,
  isAdmin = false,
}: {
  initialMembers: Member[]
  isAdmin?: boolean
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [active, setActive] = useState<MemberCategory | "all">("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const visibleMembers = useMemo(
    () =>
      active === "all"
        ? members
        : members.filter((member) => member.category === active),
    [members, active]
  )

  function openAddDialog() {
    setEditingMember(null)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  function openEditDialog(member: Member) {
    setEditingMember(member)
    setFormError(null)
    setFormOpen(true)
    setFormKey((key) => key + 1)
  }

  async function handleSubmit(values: OrgMemberInput) {
    setFormSubmitting(true)
    setFormError(null)

    const result = editingMember
      ? await updateOrgMember({ id: editingMember.id, ...values })
      : await createOrgMember(values)

    setFormSubmitting(false)

    if (result.error || !result.member) {
      setFormError(result.error ?? "구성원 정보를 저장하지 못했습니다.")
      return
    }

    if (editingMember) {
      setMembers((prev) =>
        prev.map((member) => (member.id === editingMember.id ? result.member! : member))
      )
    } else {
      setMembers((prev) => [...prev, result.member!])
    }

    setFormOpen(false)
    setEditingMember(null)
  }

  async function handleDelete(member: Member) {
    if (!window.confirm(`"${member.name}" 구성원을 삭제할까요?`)) return

    const result = await deleteOrgMember(member.id)
    if (result.error) {
      window.alert(result.error)
      return
    }
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
  }

  // 현재 탭에 보이는 목록만 순서를 바꾼다. "전체" 탭에서 드래그하면 nextVisible이
  // 전체 멤버이므로 otherMembers가 비어, 결과적으로 전역 순서 전체를 다시 정의한다.
  async function handleReorder(nextVisible: Member[]) {
    const visibleIds = new Set(nextVisible.map((member) => member.id))
    const otherMembers = members.filter((member) => !visibleIds.has(member.id))
    setMembers([...otherMembers, ...nextVisible])
    await reorderOrgMembers(nextVisible.map((member) => member.id))
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="구성원 분류 필터"
          className="inline-flex flex-wrap items-center gap-1 rounded-full bg-muted p-1"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active === filter.value}
              onClick={() => setActive(filter.value)}
              className={cn(
                "rounded-full px-4 py-2 font-heading text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === filter.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isAdmin && (
          <Button
            type="button"
            onClick={openAddDialog}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            <PenSquare data-icon="inline-start" />
            구성원 추가
          </Button>
        )}
      </div>

      {visibleMembers.length === 0 ? (
        <p className="mt-8 py-10 text-center text-sm text-muted-foreground">
          해당 분류의 구성원이 없습니다.
        </p>
      ) : isAdmin ? (
        <SortableList
          items={visibleMembers}
          onReorder={handleReorder}
          layout="grid"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          renderItem={(member, dragHandle) => (
            <div className="relative h-full">
              <div className="absolute top-2 left-2 z-10 rounded-md bg-background/80">
                {dragHandle}
              </div>
              <MemberCard
                member={member}
                isAdmin={isAdmin}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            </div>
          )}
        />
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMembers.map((member) => (
            <li key={member.id}>
              <MemberCard
                member={member}
                isAdmin={isAdmin}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <MemberFormDialog
          key={formKey}
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) {
              setEditingMember(null)
              setFormError(null)
            }
          }}
          editingMember={editingMember}
          onSubmit={handleSubmit}
          error={formError}
          submitting={formSubmitting}
        />
      )}
    </div>
  )
}
