"use client"

import { useMemo, useState } from "react"

import { MemberCard } from "@/components/people/member-card"
import { cn } from "@/lib/utils"
import { members, type MemberCategory } from "@/lib/people-content"

const filters: { value: MemberCategory | "all"; label: string }[] = [
  { value: "all", label: "전체 (All)" },
  { value: "faculty", label: "센터장 / 교수진 (Faculty)" },
  { value: "researcher", label: "연구원 (Researchers)" },
  { value: "staff", label: "연구보조원 (Staff / Students)" },
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

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMembers.map((member) => (
          <li key={member.id}>
            <MemberCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  )
}
