export type MemberRole = "admin" | "researcher" | "user"

export type Profile = {
  id: string
  email: string
  fullName: string
  affiliation: string | null
  role: MemberRole
  createdAt: string
}

export const roleLabel: Record<MemberRole, string> = {
  admin: "관리자",
  researcher: "연구원",
  user: "일반회원",
}
