export type MemberRole = "admin" | "member" | "user"

export type Profile = {
  id: string
  email: string
  fullName: string
  affiliation: string | null
  role: MemberRole
  isActive: boolean
  createdAt: string
}

export const roleLabel: Record<MemberRole, string> = {
  admin: "관리자",
  member: "정회원",
  user: "일반회원",
}

export const memberRoles: MemberRole[] = ["user", "member", "admin"]
