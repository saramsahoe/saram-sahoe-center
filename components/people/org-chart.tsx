import { cn } from "@/lib/utils"

const committees = [
  "소통역량위원회",
  "미디어위원회",
  "거버넌스위원회",
  "평등나눔위원회",
  "분배성장위원회",
  "젠더역량위원회",
  "커리어지지위원회",
  "꿈성장위원회",
  "소리감성위원회",
  "창의감성위원회",
  "자문위원단",
]

function OrgNode({
  label,
  tone = "default",
  size = "md",
}: {
  label: string
  tone?: "primary" | "accent" | "default"
  size?: "lg" | "md" | "sm"
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-center font-heading font-semibold text-balance",
        size === "lg" && "size-28 text-sm",
        size === "md" && "size-20 text-xs",
        size === "sm" && "size-16 px-1 text-[0.625rem] leading-tight",
        tone === "primary" && "bg-foreground text-background",
        tone === "accent" && "bg-accent text-accent-foreground",
        tone === "default" && "border border-border bg-muted text-foreground"
      )}
    >
      {label}
    </div>
  )
}

function VConnector() {
  return <div aria-hidden="true" className="h-6 w-px bg-border" />
}

export function OrgChart() {
  return (
    <div className="flex flex-col items-center gap-2 overflow-x-auto px-2 py-4">
      <OrgNode label="이사장" tone="primary" size="lg" />
      <VConnector />

      <div className="flex flex-wrap items-center justify-center gap-8">
        <OrgNode label="감사" />
        <OrgNode label="이사회" />
      </div>
      <VConnector />

      <div className="flex flex-wrap items-center justify-center gap-8">
        <OrgNode label="소장" tone="accent" />
        <OrgNode label="사무국" />
      </div>
      <VConnector />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-11">
        {committees.map((committee) => (
          <OrgNode key={committee} label={committee} size="sm" />
        ))}
      </div>
    </div>
  )
}
