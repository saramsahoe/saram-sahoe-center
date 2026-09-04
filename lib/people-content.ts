/**
 * 연구센터 사람과사회 구성원 정보
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
}

function scholarSearchUrl(name: string) {
  return `https://scholar.google.com/scholar?q=author:"${name}"`
}

export const members: Member[] = [
  {
    id: "lee-hwayoung",
    name: "이화영",
    role: "대표",
    roles: ["대표", "이사", "거버넌스위원회 위원장"],
    category: "committee",
    interests: [],
    bio: "숙명여자대학교 기초교양학부 초빙교수이자 거버넌스위원회 위원장으로, 젠더 관점의 리더십과 역량개발을 연구합니다. 연구센터사람과사회의 대표를 맡고 있습니다.",
    affiliation: "대표, 거버넌스위원회 위원장",
    activity: [
      "민간 섹터에서 주로 여성, 가족, 청소년 관련 프로그램을 운영하고 현장 실무를 경험",
      "공공 섹터에서 여성, 가족, 청소년 관련 정책을 연구",
      "현재는 학문과 현장 경험을 융합, 청년 리더십 역량 증진 교육에 매진",
    ],
    career: [
      "여성가족부 산하 「한국여성인권진흥원」 원장",
      "국무총리실 산하 「여성정책조정회의」 민간위원",
      "법무부 「여성정책위원회」 위원",
      "국회 정책연구위원",
      "인천광역시 「여성가족재단」 이사",
      "서울시 「청소년수련관」 운영위원",
      "충남 「평생교육진흥원」 인권경영위원",
      "숙명여자대학교 기초교양학부 초빙교수(현직)"
    ],
    publications: [],
    projects: [],
    links: [
      {
        label: "교보문고 저자 소개",
        url: "https://store.kyobobook.co.kr/person/detail/1000288425",
      },
      {
        label: "번역서",
        url: "https://www.yes24.com/product/goods/131187551",
      },
    ],
  },
  {
    id: "lee-juyeon",
    name: "이주연",
    role: "이사",
    roles: ["이사", "소통역량위원회 위원장"],
    category: "committee",
    interests: [],
    bio: "개인과 집단, 나아가 사회적 소통 능력을 개발, 훈련하는 프로그램을 연구 및 기획",
    publications: [
    ],
    projects: [],
    // email: "juyeon.lee@saramsahoe.org",
    // scholarUrl: scholarSearchUrl("이주연"),
  },
  {
    id: "nam-bokhee",
    name: "남복희",
    role: " 이사",
      roles: ["이사", "미디어위원회 위원장"],
      category: "committee",
    interests: [],
    bio: "영상, 음향 등 다양한 매체를 통한 소통 프로그램을 기획, 연구 및 훈련",
    publications: [
    ],
    projects: []
  },
    {
        id: "park-sunghae",
        name: "박성혜",
        role: "이사",
        roles: ["이사", "평등나눔위원회 위원장"],
        category: "committee",
        interests: [],
        bio: "어린이, 청소년, 성인, 노인 등 사회의 최소 수혜자와 함께하는 리더십을 실천",
        publications: [
        ],
        projects: []
    },
   {
        id: "sung-mikyeong",
        name: "정미경",
        role: "",
       roles: ["이사", "젠더역량위원회 위원장"],
       category: "committee",
        interests: [],
        bio: "젠더 감수성 증진과 젠더 불평등을 연구하고 대안 프로그램을 통한 실천",
        publications: [
        ],
        projects: []
    },
    {
        id: "-",
        name: "(공석)",
        role: "이사",
        roles: ["이사", "커리어지지위원회 위원장"],
        category: "committee",
        interests: [],
        bio: "미래사회 새로운 일과 직업에 대한 개념을 이해하고 훈련",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-hyeyoung",
        name: "김혜영",
        role: "이사",
        roles: ["이사", "꿈성장위원회 위원장"],
        category: "committee",
        interests: [],
        bio: "아동, 청소년 교육과 성장을 위한 봉사활동과 예술 프로그램을 연구, 실천",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-jihyeon",
        name: "김지현",
        role: "이사",
        roles: ["이사", "소리감성위원회 위원장"],
        category: "committee",
        interests: [],
        bio: "인간의 몸을 통해 관계를 구축하고 나아가 세상과 소통할 수 있는 프로그램 훈련",
        publications: [
        ],
        projects: []
    },
    {
        id: "-",
        name: "(공석)",
        role: "이사",
        roles: ["이사", "창의감성위원회 위원장"],
        category: "committee",
        interests: [],
        bio: "미술을 통한 리더의 자기표현과 소통의 역량을 키울 수 있는 프로그램 기획",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-youngsook",
        name: "김영숙",
        role: "이사",
        roles: ["이사", "분배성장위원회 위원장"],
        category: "committee",
        interests: [],
        bio: "공정한 사회를 꿈꾸는 구성원에게 평등한 분배 교육, 실천 프로그램을 연구",
        publications: [
        ],
        projects: []
    },
    {
        id: "park-jinyoung",
        name: "박진영",
        role: "사무국",
        category: "committee",
        interests: [],
        activity: [],
        bio: "연구센터 사람과사회 사무총장",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-seungtaek",
        name: "김승택",
        role: "자문위원",
        category: "committee",
        interests: [],
        activity: [],
        career: [
            "동아일보 샌프란시스코 주재 기자",
            "미국 「라디오서울 방송」 대표",
            "「한국인권문제연구소」 대변인, 서울사무소장",
            "「재외동포연구소」 소장",
            "「한반도선진화연구원」 대표(현직)"
        ],
        bio: "",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-daseop",
        name: "김다섭",
        role: "자문위원",
        category: "committee",
        interests: [],
        activity: [],
        career: [
            "변호사(현직)",
            "㈜ 위노바 대표",
            "인천지검 국선변호사"
        ],
        bio: "",
        publications: [
        ],
        projects: []
    },
    {
        id: "choo-hyunjae",
        name: "추현재",
        role: "자문위원",
        category: "committee",
        interests: [],
        activity: [],
        career: [
            "세무사(현직)",
            "「세무법인 한솔」 신도림 지점 대표",
            "수원과학대학 세무학과 겸임교수"
        ],
        bio: "",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-hou",
        name: "김호우",
        role: "자문위원",
        category: "committee",
        interests: [],
        activity: [],
        career: [
            "「농업경제방송」 대표",
            "농업법인 「훈훈한이웃」 대표"
        ],
        bio: "",
        publications: [
        ],
        projects: []
    },
    {
        id: "sung-yoonmo",
        name: "성윤모",
        role: "자문위원",
        category: "committee",
        interests: [],
        activity: [],
        career: [
            "한강  「새빛둥둥섬」 설계",
            "독일 「크레멘트사」 아시아총괄 한국 지사장",
            "반려동물 테마파크 추진 총괄 기획"
        ],
        bio: "",
        publications: [
        ],
        projects: []
    }
]
