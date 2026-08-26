import type { Metadata } from "next"

import { getAllMembers } from "@/app/actions/admin"
import { getCurrentUser } from "@/app/actions/auth"
import { MemberList } from "@/components/admin/member-list"

export const metadata: Metadata = {
  title: "회원 관리",
}

export default async function AdminMembersPage() {
  const [result, currentUser] = await Promise.all([
    getAllMembers(),
    getCurrentUser(),
  ])

  if (!Array.isArray(result)) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {result.error}
      </p>
    )
  }

  return (
    <MemberList initialMembers={result} currentUserId={currentUser?.id ?? ""} />
  )
}
