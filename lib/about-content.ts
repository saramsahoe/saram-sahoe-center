import type { LucideIcon } from "lucide-react"
import {
  Award,
  BadgeCheck,
  Building2,
  Compass,
  FileSignature,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Landmark,
  Mic,
  Music2,
  Sparkles,
} from "lucide-react"

// ── 목적 및 비전 (설립 목적) ────────────────────────────────────────
export const missionPurposes: string[] = [
  "여성 역량개발 및 강화를 위한 사업",
  "리더십 개발 및 훈련을 통한 새로운 인재 양성",
]

export const directorGreeting = {
  paragraphs: [
    `"연구센터 사람과 사회"는 전인적이고 통합적인 리더십 개발을 목표로 연구하고 실천하는 곳입니다.`,
    `4차 산업혁명이 진행 중인 현재는 역사상 유례없는 패러다임의 급격한 변화로 인해 다양성의 공존, 소통, 생태와 환경이라는 키워드가 중요한 문제로 부각되었습니다. 따라서 리더십은 이제 복잡성과 갈등을 조정하고 더불어 새로운 환경을 이해하는 역량이 중요한 시점입니다. 리더십은 어느 한 가지 방식으로, 혹은 단기간에 개발될 수 없습니다. 새로운 역량은 다층적이고 체계적이며 점진적인 훈련을 통해서만 완성될 수 있습니다. 나에서부터 확장되어 우리, 그리고 이를 포함한 사회 환경까지 전체를 아우르는 전생애적이고 융합적인 방식을 필요로 합니다.`,
    `인간 개인 뿐만 아니라 모든 생명체, 그리고 이들의 공존을 가능하게 하는 사회 및 문화 구조, 자연 등은 서로 상호작용하고 있으며, 독립된 채 존재할 수 없습니다. 각각의 존재들은 낮은 수준에서부터 높은 수준으로 한 단계씩 발전할 때마다 내포하면서 초월하고 있습니다. 다시 말하면 단순히 과거의 상태에서 벗어나는 것이 아니고 기존의 것을 포함하면서 포괄적으로 성장하는 것입니다.`,
    `"연구센터 사람과 사회"는 모든 사물과 현상은 이처럼 서로 종으로 또는 횡으로 연결되어 있다는 관점을 가지고 있기 때문에 리더십의 통합적인 접근을 취하고 있습니다. 사회적 구조 및 시스템의 급속한 변혁으로 인한 예측 불가능성의 증대는 우리가 더욱더 리더십 역량에 의존하게 만들기 때문입니다.`,
    `새로운 리더십 접근은 좀 더 세밀하고 다양하며 실천적 방식을 융합하는 과정이어야 합니다. 더욱 유연하고 성찰적인 역량이 요구되는 현재, 『연구센터 사람과 사회』는 각 분야의 전문가들이 모여 통합적이며 미래 지향적인 리더십 역량의 개발과 훈련에 매진하고 있습니다.`,
    `감사합니다.`,
  ],
  signature: ["연구센터 사람과 사회 대표,", "이화영"],
}

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
        title: "연구센터사람과사회 설립 (임의 단체)",
        description: "2013년 1월, 임의 단체로 연구센터사람과사회 설립",
        icon: Landmark,
      },
      {
        title: "서울시 비영리단체 등록 및 인가 취득",
        description:
          "2014년 8월 28일, 서울시 비영리단체 정식 등록 및 인가 취득",
        icon: BadgeCheck,
      },
    ],
  },
  {
    year: "2015",
    milestones: [
      {
        title: "여성 글로벌역량강화 해외봉사 시스템 구축",
        description: "2월, 음악교육 봉사를 통한 여성 글로벌역량강화 해외봉사 시스템 구축",
        icon: Globe2,
      },
      {
        title: "서울시 여성발전기금 사업 수행",
        description:
          "4월~10월, 여성폭력방지기관 종사자 소진방지 및 역량강화 프로그램 운영",
        icon: HeartHandshake,
      },
      {
        title: "리더 자아성찰 프로그램 구축 및 훈련",
        description: "11월, 센터의 대표 프로그램인 리더 자아성찰 프로그램 구축 및 훈련 시작",
        icon: Sparkles,
      },
    ],
  },
  {
    year: "2016",
    milestones: [
      {
        title: "강북구청소년상담복지센터 업무협약 체결",
        description:
          "3월, 꿈나래또요스쿨 재능기부협약 체결 및 학교밖 청소년 지원프로그램 구축",
        icon: Handshake,
      },
      {
        title: "자문위원단(협력이사) 제도 설치",
        description: "12월, 자문위원단(협력이사) 제도 신설",
        icon: FileSignature,
      },
    ],
  },
  {
    year: "2017",
    milestones: [
      {
        title: "리더 자아성찰 특강",
        description: "2월 진행",
        icon: Sparkles,
      },
      {
        title: "진로탐색 특강",
        description: "3월, 강북구청소년상담복지센터와 컨소시엄 진행",
        icon: Compass,
      },
      {
        title: "리더 자아성찰 훈련 — 호흡과 몸의 관찰",
        description: "11월 진행",
        icon: Sparkles,
      },
    ],
  },
  {
    year: "2018",
    milestones: [
      {
        title: "리더 자아성찰 훈련 — 내시(內視)와 내조(內照)",
        description: "5월 진행",
        icon: Sparkles,
      },
      {
        title: "워라밸을 위한 전문가와 함께 하는 토크 콘서트",
        description: "11월, 리파인컨설팅그룹과 컨소시엄 진행",
        icon: Mic,
      },
      {
        title: "생애설계과정 교육프로그램 구축",
        description: "12월 구축",
        icon: Compass,
      },
    ],
  },
  {
    year: "2019",
    milestones: [
      {
        title: "일하는 여성 소진방지 프로그램 구축",
        description: "3월 구축",
        icon: HeartHandshake,
      },
      {
        title: "생애설계 코치 양성교육",
        description: "9월, 커리어벨류연구소와 컨소시엄 진행",
        icon: GraduationCap,
      },
      {
        title: "오르프 전문강사 역량강화 프로그램",
        description: "10월, 이든소리연구소와 컨소시엄 진행",
        icon: Music2,
      },
    ],
  },
  {
    year: "2020",
    milestones: [
      {
        title: "서초구 여성가족플라자 위탁 운영",
        description: "2020년~2024년, 서초구 여성가족플라자 위탁 운영",
        icon: Building2,
      },
      {
        title: "서울시 성평등기금 공모사업 (1년차)",
        description:
          "3월~10월, 여성1인 전문강사 역량강화 \"서로 함께 의기 양양\" (여성 1인 가업가 소진방지)",
        icon: Award,
      },
    ],
  },
  {
    year: "2021",
    milestones: [
      {
        title: "서울시 성평등기금 공모사업 (2년차)",
        description:
          "3월~10월, 여성1인 전문강사 역량강화 \"다시 함께 의기 양양\" (COVID19의 치유와 회복)",
        icon: Award,
      },
    ],
  },
  {
    year: "2022",
    milestones: [
      {
        title: "서울시 성평등기금 공모사업 (3년차)",
        description:
          "3월~10월, 여성1인 전문강사 역량강화 \"모두 함께 의기 양양\" (포스트 팬데믹, 새로운 출발)",
        icon: Award,
      },
    ],
  },
  {
    year: "2023~2025",
    milestones: [
      {
        title: "리더 자아성찰 훈련 (2023.12)",
        description: "2023년 12월 진행",
        icon: Sparkles,
      },
      {
        title: "리더 자아성찰 훈련 (2024.11)",
        description: "2024년 11월 진행",
        icon: Sparkles,
      },
      {
        title: "리더 자아성찰 훈련 (2025.12)",
        description: "2025년 12월 진행",
        icon: Sparkles,
      },
    ],
  },
]
