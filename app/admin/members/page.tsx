import type { Metadata } from "next"

import { getAllMembers } from "@/app/actions/admin"
import { Badge } from "@/components/ui/badge"
import { roleLabel } from "@/lib/account-content"

export const metadata: Metadata = {
  title: "회원 관리",
}

export default async function AdminMembersPage() {
  const result = await getAllMembers()

  if (!Array.isArray(result)) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {result.error}
      </p>
    )
  }

  if (result.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        회원이 없습니다.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
              이름
            </th>
            <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
              소속
            </th>
            <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
              등급
            </th>
            <th className="px-4 py-3 font-mono text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
              가입일
            </th>
          </tr>
        </thead>
        <tbody>
          {result.map((member) => (
            <tr
              key={member.id}
              className="border-b border-border last:border-0"
            >
              <td className="px-4 py-3 font-heading text-foreground">
                {member.fullName}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {member.affiliation ?? "-"}
              </td>
              <td className="px-4 py-3">
                <Badge variant={member.role === "admin" ? "accent" : "outline"}>
                  {roleLabel[member.role]}
                </Badge>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {member.createdAt.slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
