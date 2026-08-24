import type { LucideIcon } from "lucide-react"
import {
  Building2,
  Cpu,
  GraduationCap,
  Globe2,
  HeartHandshake,
  Landmark,
  Scale,
  Users,
} from "lucide-react"

export type PurposeSection = {
  eyebrow: string
  title: string
  body: string
  image: string
  alt: string
}

export const purposeSections: PurposeSection[] = [
  {
    eyebrow: "Social Impact",
    title: "사람을 수단이 아닌 출발점으로",
    body: "연구센터 사람과 사회는 통계 뒤에 가려진 개인의 서사를 복원하는 것을 첫 번째 목표로 삼습니다. 정책과 제도가 놓치는 삶의 결을 현장에서 길어 올려, 공적 논의의 근거로 만듭니다.",
    image: "/news/fieldwork.png",
    alt: "골목에서 연구자가 주민과 면담하는 모습",
  },
  {
    eyebrow: "Human-Centric Innovation",
    title: "기술이 사람을 소외시키지 않도록",
    body: "자동화와 디지털 전환이 노동과 돌봄의 자리를 바꾸는 지금, 우리는 기술의 속도보다 그 기술이 사람에게 남기는 흔적을 먼저 살핍니다. 인간 중심 설계를 사회과학의 언어로 번역합니다.",
    image: "/news/seminar.png",
    alt: "연구진이 세미나실에 모여 논의하는 모습",
  },
  {
    eyebrow: "Community Research",
    title: "공동체와 함께 쓰는 연구",
    body: "연구는 지역과 공동체 안에서 완성됩니다. 주민, 활동가, 정책 담당자와 함께 질문을 설계하고 결과를 공유하는 참여형 연구 방법을 지향합니다.",
    image: "/news/forum.png",
    alt: "주민들이 모인 공개 포럼 현장",
  },
]

export type ResearchArea = {
  icon: LucideIcon
  title: string
  keywords: string[]
  description: string
}

export const researchAreas: ResearchArea[] = [
  {
    icon: Users,
    title: "노동과 삶의 조건",
    keywords: ["불안정노동", "생애사", "노동정책"],
    description:
      "불안정 노동의 확산이 개인의 생애 설계와 지역 공동체에 남기는 흔적을 추적합니다. 노동 통계 뒤에 가려진 개별 서사를 기록합니다.",
  },
  {
    icon: HeartHandshake,
    title: "돌봄의 사회적 재구성",
    keywords: ["돌봄노동", "가족정책", "복지제도"],
    description:
      "가족 안에 갇혀 있던 돌봄을 공적 제도와 관계망의 문제로 다시 읽습니다. 돌봄 제공자와 수혜자 모두의 목소리를 함께 담습니다.",
  },
  {
    icon: Building2,
    title: "지역과 공동체",
    keywords: ["지역소멸", "관계망", "현장조사"],
    description:
      "축소되는 지역에서 사람들이 서로를 지탱하는 방식을 현장 조사로 기록합니다. 통계로 드러나지 않는 지역의 회복력을 살핍니다.",
  },
  {
    icon: Cpu,
    title: "인간 중심 기술과 사회",
    keywords: ["자동화", "디지털전환", "기술윤리"],
    description:
      "기술 변화가 노동과 일상에 남기는 영향을 인간 중심 관점에서 분석합니다. 효율성보다 사람이 우선하는 기술 설계를 제안합니다.",
  },
  {
    icon: Scale,
    title: "사회정책과 제도",
    keywords: ["정책평가", "제도설계", "공공성"],
    description:
      "현장의 목소리를 정책 언어로 옮기는 작업을 합니다. 제도의 사각지대를 데이터와 사례로 함께 증명합니다.",
  },
  {
    icon: GraduationCap,
    title: "청년과 세대",
    keywords: ["세대격차", "청년노동", "생애전환"],
    description:
      "청년 세대가 마주한 노동과 주거, 관계의 불안정성을 추적합니다. 세대 간 격차가 만들어지는 구조적 원인을 살핍니다.",
  },
]

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
    year: "2026",
    milestones: [
      {
        title: "연구센터 사람과 사회 공식 출범",
        description:
          "노동·돌봄·지역 공동체를 축으로 한 독립 연구기관으로 공식 설립되었습니다.",
        icon: Landmark,
      },
      {
        title: "제12차 정기 세미나 개최",
        description:
          "돌봄 노동의 가치 측정을 주제로 연구진과 현장 활동가가 함께했습니다.",
        icon: Users,
      },
    ],
  },
  {
    year: "2025",
    milestones: [
      {
        title: "고령 1인 가구 생활사 구술 조사 착수",
        description:
          "서울 서북권 3개 동을 대상으로 고령 1인 가구의 일상을 기록하는 장기 구술 조사를 시작했습니다.",
        icon: HeartHandshake,
      },
      {
        title: "공개 포럼 '축소되는 지역, 남는 사람들' 개최",
        description:
          "인구가 줄어드는 지역 공동체에서 사람들이 서로를 지탱하는 방식을 주민과 함께 논의했습니다.",
        icon: Globe2,
      },
    ],
  },
  {
    year: "2024",
    milestones: [
      {
        title: "독립 연구기관 전환 준비",
        description:
          "비정기 독서모임에서 정기 연구모임으로 체계를 갖추고, 첫 공동 연구 주제를 설정했습니다.",
        icon: GraduationCap,
      },
    ],
  },
]
