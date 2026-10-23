"use client"

import { useMemo, useState } from "react"
import { PenSquare } from "lucide-react"

import {
  createOrgCommittee,
  deleteOrgCommittee,
  reorderOrgCommittees,
  updateOrgCommittee,
} from "@/app/actions/org-committees"
import {
  createOrgMember,
  deleteOrgMember,
  reorderOrgMembers,
  updateOrgMember,
  type OrgMemberInput,
} from "@/app/actions/org-members"
import { SortableList } from "@/components/admin/sortable-list"
import { CommitteeCard } from "@/components/people/committee-card"
import {
  CommitteeFormDialog,
  type CommitteeFormValues,
} from "@/components/people/committee-form-dialog"
import { MemberCard } from "@/components/people/member-card"
import { MemberFormDialog } from "@/components/people/member-form-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  memberCategoryLabel,
  type Committee,
  type Member,
  type MemberCategory,
  type TitleOption,
} from "@/lib/people-content"

type FilterValue = MemberCategory | "committee" | "all"

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "director", label: memberCategoryLabel.director },
  { value: "committee", label: "위원회" },
  { value: "advisory", label: memberCategoryLabel.advisory },
  { value: "office", label: memberCategoryLabel.office },
]

export function MembersDirectory({
  initialMembers,
  initialCommittees,
  initialTitleOptions,
  isAdmin = false,
}: {
  initialMembers: Member[]
  initialCommittees: Committee[]
  initialTitleOptions: TitleOption[]
  isAdmin?: boolean
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [committees, setCommittees] = useState<Committee[]>(initialCommittees)
  const [titleOptions, setTitleOptions] = useState<TitleOption[]>(initialTitleOptions)
  const [active, setActive] = useState<FilterValue>("all")

  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const [committeeFormOpen, setCommitteeFormOpen] = useState(false)
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null)
  const [committeeFormKey, setCommitteeFormKey] = useState(0)
  const [committeeFormError, setCommitteeFormError] = useState<string | null>(null)
  const [committeeFormSubmitting, setCommitteeFormSubmitting] = useState(false)

  const visibleMembers = useMemo(
    () =>
      active === "all" || active === "committee"
        ? members
        : members.filter((member) => member.category === active),
    [members, active]
  )

  // ── 구성원 ──────────────────────────────────────────────────────
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

  // ── 위원회 ──────────────────────────────────────────────────────
  function openAddCommitteeDialog() {
    setEditingCommittee(null)
    setCommitteeFormError(null)
    setCommitteeFormOpen(true)
    setCommitteeFormKey((key) => key + 1)
  }

  function openEditCommitteeDialog(committee: Committee) {
    setEditingCommittee(committee)
    setCommitteeFormError(null)
    setCommitteeFormOpen(true)
    setCommitteeFormKey((key) => key + 1)
  }

  async function handleCommitteeSubmit(values: CommitteeFormValues) {
    setCommitteeFormSubmitting(true)
    setCommitteeFormError(null)

    const result = editingCommittee
      ? await updateOrgCommittee({ id: editingCommittee.id, ...values })
      : await createOrgCommittee(values)

    setCommitteeFormSubmitting(false)

    if (result.error || !result.committee) {
      setCommitteeFormError(result.error ?? "위원회 정보를 저장하지 못했습니다.")
      return
    }

    if (editingCommittee) {
      setCommittees((prev) =>
        prev.map((committee) =>
          committee.id === editingCommittee.id ? result.committee! : committee
        )
      )
    } else {
      setCommittees((prev) => [...prev, result.committee!])
    }

    setCommitteeFormOpen(false)
    setEditingCommittee(null)
  }

  async function handleCommitteeDelete(committee: Committee) {
    if (!window.confirm(`"${committee.name}위원회"를 삭제할까요?`)) return

    const result = await deleteOrgCommittee(committee.id)
    if (result.error) {
      window.alert(result.error)
      return
    }
    setCommittees((prev) => prev.filter((c) => c.id !== committee.id))
  }

  async function handleCommitteeReorder(next: Committee[]) {
    setCommittees(next)
    await reorderOrgCommittees(next.map((committee) => committee.id))
  }

  const onCommitteeTab = active === "committee"

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
            onClick={onCommitteeTab ? openAddCommitteeDialog : openAddDialog}
            className="bg-button text-button-foreground hover:bg-button/90"
          >
            <PenSquare data-icon="inline-start" />
            {onCommitteeTab ? "위원회 추가" : "구성원 추가"}
          </Button>
        )}
      </div>

      {onCommitteeTab ? (
        committees.length === 0 ? (
          <p className="mt-8 py-10 text-center text-sm text-muted-foreground">
            등록된 위원회가 없습니다.
          </p>
        ) : isAdmin ? (
          <SortableList
            items={committees}
            onReorder={handleCommitteeReorder}
            layout="grid"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            renderItem={(committee, dragHandle) => (
              <div className="relative h-full">
                <div className="absolute top-2 left-2 z-10 rounded-md bg-background/80">
                  {dragHandle}
                </div>
                <CommitteeCard
                  committee={committee}
                  isAdmin={isAdmin}
                  onEdit={openEditCommitteeDialog}
                  onDelete={handleCommitteeDelete}
                />
              </div>
            )}
          />
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((committee) => (
              <li key={committee.id}>
                <CommitteeCard committee={committee} />
              </li>
            ))}
          </ul>
        )
      ) : visibleMembers.length === 0 ? (
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
          committees={committees}
          titleOptions={titleOptions}
          setTitleOptions={setTitleOptions}
          onSubmit={handleSubmit}
          error={formError}
          submitting={formSubmitting}
        />
      )}

      {isAdmin && (
        <CommitteeFormDialog
          key={committeeFormKey}
          open={committeeFormOpen}
          onOpenChange={(open) => {
            setCommitteeFormOpen(open)
            if (!open) {
              setEditingCommittee(null)
              setCommitteeFormError(null)
            }
          }}
          editingCommittee={editingCommittee}
          onSubmit={handleCommitteeSubmit}
          error={committeeFormError}
          submitting={committeeFormSubmitting}
        />
      )}
    </div>
  )
}
