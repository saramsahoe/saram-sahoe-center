// ── 목적 및 비전 : 인재양성 프레임워크 ─────────────────────────────
export type FrameworkTheme = "pink" | "blue" | "mint"

/** 배려(pink) · 성찰(blue) · 창조(mint) 세 축으로 고정된 값 */
export type FrameworkTriple<T> = Record<FrameworkTheme, T>

export const talentFrameworkTarget = {
  highlights: {
    pink: "창의성",
    blue: "자율성",
    mint: "휴머니즘",
  },
  suffix: "이 융합된 인재양성",
}

export const talentFrameworkCompetencies: FrameworkTriple<string> = {
  pink: "배려의 역량",
  blue: "성찰의 역량",
  mint: "창조적 역량",
}

export const talentFrameworkEffectiveness: FrameworkTriple<string> = {
  pink: "역지사지 능력",
  blue: "성찰적 사고",
  mint: "전문성 / 창발성 습득",
}

export type FrameworkDetailCard = {
  heading: string
  points: string[]
}

export const talentFrameworkDetails: FrameworkTriple<FrameworkDetailCard> = {
  pink: {
    heading: "통합 예술 활용 훈련",
    points: [
      "종합적 예술 매체를 활용한 통합 훈련",
      "상담, 성격유형 검사 등의 진단 활용",
    ],
  },
  blue: {
    heading: "초자아심리 · 명상 훈련",
    points: [
      "명상, 호흡, 자아 관조 등의 능력 훈련",
      "기의 순환을 통한 양생 훈련",
    ],
  },
  mint: {
    heading: "전문성 개발 훈련",
    points: [
      "경제, 경영, 과학 등 전문 기술 습득을 통한 환경 변화 적응",
      "인간 역사의 진보와 이해를 위한 인문학적 이해와 통찰",
    ],
  },
}

export const talentFrameworkPrograms: FrameworkTriple<string> = {
  pink: "역지사지 프로그램",
  blue: "성찰 훈련 프로그램",
  mint: "전문 역량 프로그램",
}

export const talentFrameworkApproach: FrameworkTriple<string> = {
  pink: "우리 : 관계적 인간",
  blue: "나 : 나에 대한 자각",
  mint: "환경 : 환경의 변화",
}

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
