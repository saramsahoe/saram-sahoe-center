"use client"

import { useMemo, useState } from "react"

import { MemberCard } from "@/components/people/member-card"
import { cn } from "@/lib/utils"
import { members, type MemberCategory } from "@/lib/people-content"

const filters: { value: MemberCategory | "all"; label: string }[] = [
  { value: "all", label: "전체 (All)" },
  { value: "board", label: "이사회 (Board)" },
  { value: "committee", label: "위원회 (Committee)" },
  { value: "office", label: "사무국 (Office)" },
]

export function MembersDirectory() {
  const [active, setActive] = useState<MemberCategory | "all">("all")

  const visibleMembers = useMemo(
    () =>
      active === "all"
        ? members
        : members.filter((member) => member.category === active),
    [active]
  )

  return (
    <div>
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

      {visibleMembers.length === 0 ? (
        <p className="mt-8 py-10 text-center text-sm text-muted-foreground">
          해당 분류의 구성원이 없습니다.
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMembers.map((member) => (
            <li key={member.id}>
              <MemberCard member={member} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
