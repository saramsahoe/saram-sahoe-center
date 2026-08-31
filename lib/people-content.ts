/**
 * 연구센터 사람과사회 구성원 정보
 * board: 이사회
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
  fullBio: string
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
    roles: ["대표", "거버넌스위원회 위원장"],
    category: "committee",
    interests: ["젠더 관점의 리더십", "정치 및 역량개발"],
    bio: "숙명여자대학교 기초교양학부 초빙교수이자 거버넌스위원회 위원장으로, 젠더 관점의 리더십과 역량개발을 연구합니다. 연구센터사람과사회의 대표를 맡고 있습니다.",
    fullBio:
      "이화영 대표는 숙명여자대학교 기초교양학부 초빙교수이자 거버넌스위원회 위원장으로, 젠더 관점의 리더십과 정치 및 역량개발을 연구·강의하고 있습니다. 연구센터사람과사회의 대표를 맡고 있습니다.",
    affiliation: "숙명여자대학교 기초교양학부 초빙교수, 거버넌스위원회 위원장",
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
        label: "숙명여대 뉴스",
        url: "https://news.sookmyung.ac.kr/news/articleView.html?idxno=11326",
      },
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
    role: "소통역량위원회 위원장",
    category: "committee",
    interests: [],
    bio: "개인과 집단, 나아가 사회적 소통 능력을 개발, 훈련하는 프로그램을 연구 및 기획",
    fullBio:
      "이주연 소통역량위원회 위원장은 개인과 집단, 나아가 사회적 소통 능력을 개발, 훈련하는 프로그램을 연구 및 기획하고 있습니다.",
    publications: [
    ],
    projects: [],
    // email: "juyeon.lee@saramsahoe.org",
    // scholarUrl: scholarSearchUrl("이주연"),
  },
  {
    id: "nam-bokhee",
    name: "남복희",
    role: "미디어위원회 위원장",
    category: "committee",
    interests: [],
    bio: "영상, 음향 등 다양한 매체를 통한 소통 프로그램을 기획, 연구 및 훈련",
    fullBio:
      "남복희 미디어위원회 위원장은 영상, 음향 등 다양한 매체를 통한 소통 프로그램을 기획, 연구 및 훈련하고 있습니다.",
    publications: [
    ],
    projects: []
  },
    {
        id: "park-sunghae",
        name: "박성혜",
        role: "평등나눔위원회 위원장",
        category: "committee",
        interests: [],
        bio: "어린이, 청소년, 성인, 노인 등 사회의 최소 수혜자와 함께하는 리더십을 실천",
        fullBio:
            "박성혜 평등나눔위원회 위원장은 어린이, 청소년, 성인, 노인 등 사회의 최소 수혜자와 함께하는 리더십을 실천하고 있습니다.",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-youngsook",
        name: "김영숙",
        role: "분배성장위원회 위원장",
        category: "committee",
        interests: [],
        bio: "공정한 사회를 꿈꾸는 구성원에게 평등한 분배 교육, 실천 프로그램을 연구",
        fullBio:
            "김영숙 분배성장위원회 위원장은 공정한 사회를 꿈꾸는 구성원에게 평등한 분배 교육과 실천 프로그램을 연구하고 있습니다.",
        publications: [
        ],
        projects: []
    },
    {
        id: "sung-mikyeong",
        name: "정미경",
        role: "젠더역량위원회 위원장",
        category: "committee",
        interests: [],
        bio: "젠더 감수성 증진과 젠더 불평등을 연구하고 대안 프로그램을 통한 실천",
        fullBio:
            "정미경 젠더역량위원회 위원장은 젠더 감수성 증진과 젠더 불평등을 연구하고 대안 프로그램을 통한 실천을 하고 있습니다.",
        publications: [
        ],
        projects: []
    },
    {
        id: "-",
        name: "(공석)",
        role: "커리어지지위원회 위원장",
        category: "committee",
        interests: [],
        bio: "미래사회 새로운 일과 직업에 대한 개념을 이해하고 훈련",
        fullBio:
            "",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-hyeyoung",
        name: "김혜영",
        role: "꿈성장위원회 위원장",
        category: "committee",
        interests: [],
        bio: "아동, 청소년 교육과 성장을 위한 봉사활동과 예술 프로그램을 연구, 실천",
        fullBio:
            "",
        publications: [
        ],
        projects: []
    },
    {
        id: "kim-jihyeon",
        name: "김지현",
        role: "소리감성위원회 위원장",
        category: "committee",
        interests: [],
        bio: "인간의 몸을 통해 관계를 구축하고 나아가 세상과 소통할 수 있는 프로그램 훈련",
        fullBio:
            "",
        publications: [
        ],
        projects: []
    },
    {
        id: "-",
        name: "(공석)",
        role: "창의감성위원회 위원장",
        category: "committee",
        interests: [],
        bio: "미술을 통한 리더의 자기표현과 소통의 역량을 키울 수 있는 프로그램 기획",
        fullBio:
            "",
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
        fullBio:
            "",
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
        fullBio:
            "",
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
        fullBio:
            "",
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
        fullBio:
            "",
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
        fullBio:
            "",
        publications: [
        ],
        projects: []
    },
  // {
  //   id: "jung-haeun",
  //   name: "정하은",
  //   role: "선임연구원",
  //   category: "faculty",
  //   interests: ["돌봄노동", "질적연구"],
  //   bio: "고령 1인 가구의 생활사를 구술로 기록하는 장기 조사를 이끌고 있습니다. 질적 연구 방법론을 통해 통계 너머의 서사를 담아냅니다.",
  //   fullBio:
  //     "정하은 선임연구원은 질적 연구 방법론을 전공했으며, 서울 서북권 고령 1인 가구를 대상으로 한 장기 구술사 조사를 설계하고 이끌고 있습니다. 인터뷰이의 언어를 그대로 살리는 기록 방식을 통해 통계가 지워버리는 개별 서사를 복원하는 데 주력하고 있습니다.",
  //   publications: [
  //     "고령 1인 가구 생활사 구술 기록 (2026, 진행중)",
  //     "돌봄 제공자의 언어로 본 돌봄 (2024)",
  //   ],
  //   projects: ["고령 1인 가구 생활사 구술 조사"],
  //   email: "haeun.jung@saramsahoe.org",
  //   scholarUrl: scholarSearchUrl("정하은"),
  // },
  // {
  //   id: "choi-minjun",
  //   name: "최민준",
  //   role: "연구원",
  //   category: "faculty",
  //   interests: ["노동정책", "통계분석"],
  //   bio: "노동 통계 뒤에 가려진 불안정 고용의 패턴을 계량적으로 분석합니다. 정책 평가 연구에도 참여하고 있습니다.",
  //   fullBio:
  //     "최민준 연구원은 노동경제학과 통계분석을 전공했으며, 대규모 노동 패널 데이터를 활용해 불안정 고용이 확산되는 구조적 패턴을 분석하는 연구를 수행하고 있습니다. 현장 조사팀과 협업해 질적 자료와 양적 자료를 함께 다루는 혼합 연구를 지향합니다.",
  //   publications: [
  //     "노동 패널로 본 불안정 고용의 확산 (2025)",
  //     "정책 평가를 위한 데이터 설계 (2023)",
  //   ],
  //   projects: ["노동과 삶의 조건 연구", "사회정책 평가 프로젝트"],
  //   email: "minjun.choi@saramsahoe.org",
  //   scholarUrl: scholarSearchUrl("최민준"),
  // },
  // {
  //   id: "oh-seyoung",
  //   name: "오세영",
  //   role: "연구원",
  //   category: "faculty",
  //   interests: ["기술사회학", "디지털전환"],
  //   bio: "자동화와 디지털 전환이 노동과 돌봄의 자리를 어떻게 바꾸는지 인간 중심 관점에서 연구합니다.",
  //   fullBio:
  //     "오세영 연구원은 기술사회학을 전공했으며, 자동화와 디지털 전환이 노동과 돌봄의 현장에 남기는 흔적을 인간 중심 설계의 언어로 번역하는 연구를 하고 있습니다. 기술 도입 이후 현장의 변화를 추적하는 참여 관찰 연구를 진행 중입니다.",
  //   publications: ["인간 중심 기술 설계를 위한 사회과학적 제언 (2025)"],
  //   projects: ["인간 중심 기술과 사회 연구"],
  //   email: "seyoung.oh@saramsahoe.org",
  //   scholarUrl: scholarSearchUrl("오세영"),
  // },
  // {
  //   id: "kang-taeyun",
  //   name: "강태윤",
  //   role: "연구보조원",
  //   category: "office",
  //   interests: ["현장조사", "데이터관리"],
  //   bio: "현장 조사 일정 조율과 수집 자료 정리를 맡고 있습니다. 대학원에서 사회조사방법론을 공부하고 있습니다.",
  //   fullBio:
  //     "강태윤 연구보조원은 현장 조사 일정 조율, 인터뷰 녹취 정리, 수집 자료의 체계적 관리를 담당하고 있습니다. 사회조사방법론을 전공하는 대학원생으로, 고령 1인 가구 구술 조사와 지역 현장 조사에 함께 참여하고 있습니다.",
  //   publications: [],
  //   projects: ["고령 1인 가구 생활사 구술 조사 보조", "지역 현장 조사 보조"],
  //   email: "taeyun.kang@saramsahoe.org",
  //   scholarUrl: scholarSearchUrl("강태윤"),
  // },
  // {
  //   id: "yoon-jiwon",
  //   name: "윤지원",
  //   role: "연구보조원",
  //   category: "office",
  //   interests: ["구술사", "아카이빙"],
  //   bio: "구술 인터뷰 기록을 아카이빙하고 정리하는 작업을 맡고 있습니다. 기록물 관리에 관심이 많습니다.",
  //   fullBio:
  //     "윤지원 연구보조원은 구술사 인터뷰 기록의 전사, 분류, 아카이빙을 담당하고 있습니다. 기록물 관리학을 공부하며 연구센터가 축적한 구술 자료가 장기적으로 열람 가능한 형태로 남을 수 있도록 체계를 정비하고 있습니다.",
  //   publications: [],
  //   projects: ["구술 자료 아카이빙 체계 구축"],
  //   email: "jiwon.yoon@saramsahoe.org",
  //   scholarUrl: scholarSearchUrl("윤지원"),
  // },
  // {
  //   id: "bae-soyeon",
  //   name: "배소연",
  //   role: "행정간사",
  //   category: "office",
  //   interests: ["연구행정", "세미나기획"],
  //   bio: "정기 세미나와 공개 포럼 운영, 연구센터의 전반적인 행정 업무를 맡고 있습니다.",
  //   fullBio:
  //     "배소연 행정간사는 연구센터의 정기 세미나와 공개 포럼 운영, 예산 및 일정 관리를 포함한 전반적인 행정 업무를 담당하고 있습니다. 연구진과 외부 참여자 사이의 소통 창구 역할을 하며, 연구 성과가 공적 논의로 이어지도록 자리를 만드는 일에 힘쓰고 있습니다.",
  //   publications: [],
  //   projects: ["정기 세미나 운영", "공개 포럼 운영"],
  //   email: "soyeon.bae@saramsahoe.org",
  //   scholarUrl: scholarSearchUrl("배소연"),
  // },
]
