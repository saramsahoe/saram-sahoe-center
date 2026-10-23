/**
 * 연구센터 사람과사회 구성원 정보 (org_members 테이블)
 * director : 이사/위원장
 * advisory : 자문위원
 * office   : 사무국
 * (위원회는 사람이 아니라 별도 조직 단위 — Committee 타입, org_committees 테이블 참고)
 */
export type MemberCategory = "director" | "advisory" | "office"

export type Member = {
  id: string
  name: string
  category: MemberCategory
  /** 뱃지로 보여줄 직함들 (복수 선택). "위원장"이 포함돼 있으면 chairedCommitteeName과 합쳐 "OO위원회 위원장"으로 표시한다. */
  titles: string[]
  /** "위원장" 직함을 선택했을 때 어느 위원회를 맡는지. */
  chairedCommitteeId: string | null
  chairedCommitteeName: string | null
  /** 주요 경력 — 카드 전면에 바로 노출된다. */
  career: string[]
  /** 참고 링크 (이메일, 홈페이지, 기사 등 전부 라벨+URL로 통일) */
  links: { label: string; url: string }[]
  sortOrder: number
}

/** 사람이 아닌 조직 단위. 이름 + 수행 역할 2가지만 가진다. */
export type Committee = {
  id: string
  name: string
  description: string
  sortOrder: number
}

/** 멤버 폼의 "직함" 다중 선택 선택지. 기본값(isDefault)은 삭제할 수 없다. */
export type TitleOption = {
  id: string
  label: string
  isDefault: boolean
}

export const DEFAULT_TITLE_LABELS = ["대표", "이사", "위원장", "사무총장", "자문위원"]

export const memberCategoryLabel: Record<MemberCategory, string> = {
  director: "이사/위원장",
  advisory: "자문위원",
  office: "사무국",
}
