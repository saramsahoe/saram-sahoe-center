/**
 * 연구센터 사람과사회 구성원 정보 (org_members 테이블)
 * board: 이사/위원장
 * committee: 위원회
 * office: 사무국
 */
export type MemberCategory = "board" | "committee" | "office"

export type Member = {
  id: string
  name: string
  role: string
  /** role이 여러 개일 때 뱃지를 나눠 보여준다. 없으면 role 하나만 표시한다. */
  roles?: string[]
  category: MemberCategory
  interests: string[]
  bio: string
  /** 소속 및 직위 */
  affiliation?: string
  /** 주요 활동 분야 */
  activity?: string[]
  /** 주요 경력 */
  career?: string[]
  publications: string[]
  projects: string[]
  email?: string
  scholarUrl?: string
  websiteUrl?: string
  /** 참고 링크 (기사, 저자 소개 등) */
  links?: { label: string; url: string }[]
  sortOrder: number
}
