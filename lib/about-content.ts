import type { LucideIcon } from "lucide-react"
import { Landmark } from "lucide-react"

// ── 단체 목적 (설립 목적) ────────────────────────────────────────
export const missionPurposes: string[] = [
  "여성 역량개발 및 강화를 위한 사업",
  "리더십 개발 및 훈련을 통한 새로운 인재 양성",
]

// ── 사업 및 활동분야 ──────────────────────────────────────────────
export const businessActivities: string[] = [
  "인재육성을 위한 역량강화 및 리더십 교육",
  "리더십 역량개발 관련 전문교육 및 자격증 발급",
  "리더십 역량강화 관련 연구, 교육방법개발, 세미나 등 개최",
]

export type ProgramGroup = {
  title: string
  items: string[]
}

export type Program = {
  title: string
  groups: ProgramGroup[]
}

export const programs: Program[] = [
  {
    title: "자아성찰 프로그램",
    groups: [
      {
        title: "리더의 자아성찰 훈련",
        items: [
          "도가 명상을 통한 자신의 몸과 호흡에 대한 집중",
          "매일 성찰훈련을 통한 자아 회복과 역량 강화",
          "호흡을 통한 내조와 내관 역량을 증강",
        ],
      },
      {
        title: "아동, 청소년의 자아성찰 훈련",
        items: [
          "심리적 치유와 예술 활동을 통한 훈련",
          "호흡을 통한 가라앉힘 훈련",
          "정서적, 심리적 고요함을 경험하는 훈련",
        ],
      },
    ],
  },
  {
    title: "역지사지 프로그램",
    groups: [
      {
        title: "리더십 역량 강화",
        items: [
          "자아 성찰을 기반으로 하는 역지사지 역량 강화",
          "리더십 유형 검사, 리더십 유형에 따른 훈련",
          "리더십과 팔로우십을 동시에 훈련",
        ],
      },
      {
        title: "함께하는 공동체(가족, 조직, 사회) 역량 강화",
        items: [
          "새로운 가족 유형과 구성원의 모습 이해",
          "세대 이해와 함께 성장하는 구성원의 역량 강화",
          "조직의 규범, 인권 감수성 강화를 통한 성장",
        ],
      },
    ],
  },
  {
    title: "전문성 개발 프로그램",
    groups: [
      {
        title: "세상에 대한 이해",
        items: [
          "인권 감수성 증진 훈련",
          "세대 이해와 통합적 관점을 갖기 위한 프로그램",
          "환경, 기술, 과학, 기후 등 미래 세대를 위한 프로그램",
        ],
      },
      {
        title: "미래 사회를 대비한 창의적 사고",
        items: ["청소년을 위한 미래 직업에 대한 이해", "직업 교육 및 체험과 훈련"],
      },
    ],
  },
]

// ── 연혁 ──────────────────────────────────────────────────────────
export type HistoryMilestone = {
  title: string
  description: string
  icon: LucideIcon
}

export type HistoryYear = {
  year: string
  milestones: HistoryMilestone[]
}

export const historyTimeline: HistoryYear[] = [
  {
    year: "2014",
    milestones: [
      {
        title: "연구센터사람과사회 설립",
        description:
          "2014년 8월 28일, 여성 역량개발 및 강화, 리더십 개발과 훈련을 통한 인재 양성을 목적으로 설립되었습니다.",
        icon: Landmark,
      },
    ],
  },
]
