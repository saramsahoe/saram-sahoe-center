export type MemberCategory = "faculty" | "researcher" | "staff"

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
  /** 학력 */
  education?: string[]
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
    roles: ["대표", "교수진/초빙교수"],
    category: "faculty",
    interests: ["젠더 관점의 리더십", "정치 및 역량개발", "사이버안보 정책"],
    bio: "숙명여자대학교 기초교양학부 초빙교수이자 사이버안보연구소 부소장으로, 젠더 관점의 리더십과 역량개발을 연구합니다. 연구센터사람과사회의 대표를 맡고 있습니다.",
    fullBio:
      "이화영 대표는 숙명여자대학교 기초교양학부 초빙교수이자 사이버안보연구소 부소장으로, 젠더 관점의 리더십, 정치 및 역량개발, 사이버안보 정책 등을 연구·강의하고 있습니다. 연구센터사람과사회의 대표를 맡고 있습니다.",
    affiliation: "숙명여자대학교 기초교양학부 초빙교수, 사이버안보연구소 부소장",
    education: [
      "숙명여자대학교 정치외교학과 학사 (1985년 졸업)",
      "서강대학교 사회복지정책 석사",
      "숙명여자대학교 정치학 박사",
    ],
    career: [
      "한국여성인권진흥원 초대 원장",
      "대통령직속 여성부 정책연구위원 및 여성단체 활동가",
      "정부 공공기관 여성 중간관리자 역량강화 사업 강의 및 연구",
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
    ],
  },
  {
    id: "lee-sua",
    name: "이수아",
    role: "교수진 / 겸임교수",
    category: "faculty",
    interests: ["돌봄정책", "가족사회학"],
    bio: "돌봄을 사적 영역이 아닌 공적 제도의 문제로 다시 읽는 연구를 해 왔습니다. 돌봄 노동의 가치 측정을 주제로 여러 편의 논문을 발표했습니다.",
    fullBio:
      "이수아 겸임교수는 가족사회학과 복지 정책을 전공했으며, 돌봄이 가족 안에 갇혀 있던 방식에서 벗어나 공적 제도와 관계망의 문제로 다뤄져야 한다는 문제의식으로 연구를 이어오고 있습니다. 돌봄 제공자와 수혜자 양측의 목소리를 함께 담는 참여형 연구 방법을 발전시켜 왔습니다.",
    publications: [
      "돌봄 노동의 가치는 어떻게 측정되는가 (2026)",
      "가족 밖의 돌봄, 제도 안의 돌봄 (2024)",
    ],
    projects: ["돌봄의 사회적 재구성 연구", "제12차 정기 세미나 기획"],
    email: "sua.lee@saramsahoe.org",
    scholarUrl: scholarSearchUrl("이수아"),
  },
  {
    id: "park-jihoon",
    name: "박지훈",
    role: "자문교수",
    category: "faculty",
    interests: ["도시사회학", "지역공동체"],
    bio: "축소되는 지역에서 사람들이 서로를 지탱하는 방식을 도시사회학의 관점에서 살펴 온 연구자입니다. 센터의 지역 연구 자문을 맡고 있습니다.",
    fullBio:
      "박지훈 자문교수는 도시사회학을 전공했으며, 인구가 줄어드는 지역에서 주민들이 만들어내는 자생적 관계망과 회복력에 주목해 왔습니다. 통계로 드러나지 않는 지역의 결속을 현장 조사로 기록하는 방법론을 연구센터와 함께 발전시키고 있습니다.",
    publications: [
      "축소 도시의 사회적 자본 (2022)",
      "지역 공동체와 관계망의 재구성 (2020)",
    ],
    projects: ["지역과 공동체 연구 자문", "공개 포럼 기획 자문"],
    email: "jihoon.park@saramsahoe.org",
    scholarUrl: scholarSearchUrl("박지훈"),
    websiteUrl: "https://jihoon-park.example",
  },
  {
    id: "jung-haeun",
    name: "정하은",
    role: "선임연구원",
    category: "researcher",
    interests: ["돌봄노동", "질적연구"],
    bio: "고령 1인 가구의 생활사를 구술로 기록하는 장기 조사를 이끌고 있습니다. 질적 연구 방법론을 통해 통계 너머의 서사를 담아냅니다.",
    fullBio:
      "정하은 선임연구원은 질적 연구 방법론을 전공했으며, 서울 서북권 고령 1인 가구를 대상으로 한 장기 구술사 조사를 설계하고 이끌고 있습니다. 인터뷰이의 언어를 그대로 살리는 기록 방식을 통해 통계가 지워버리는 개별 서사를 복원하는 데 주력하고 있습니다.",
    publications: [
      "고령 1인 가구 생활사 구술 기록 (2026, 진행중)",
      "돌봄 제공자의 언어로 본 돌봄 (2024)",
    ],
    projects: ["고령 1인 가구 생활사 구술 조사"],
    email: "haeun.jung@saramsahoe.org",
    scholarUrl: scholarSearchUrl("정하은"),
  },
  {
    id: "choi-minjun",
    name: "최민준",
    role: "연구원",
    category: "researcher",
    interests: ["노동정책", "통계분석"],
    bio: "노동 통계 뒤에 가려진 불안정 고용의 패턴을 계량적으로 분석합니다. 정책 평가 연구에도 참여하고 있습니다.",
    fullBio:
      "최민준 연구원은 노동경제학과 통계분석을 전공했으며, 대규모 노동 패널 데이터를 활용해 불안정 고용이 확산되는 구조적 패턴을 분석하는 연구를 수행하고 있습니다. 현장 조사팀과 협업해 질적 자료와 양적 자료를 함께 다루는 혼합 연구를 지향합니다.",
    publications: [
      "노동 패널로 본 불안정 고용의 확산 (2025)",
      "정책 평가를 위한 데이터 설계 (2023)",
    ],
    projects: ["노동과 삶의 조건 연구", "사회정책 평가 프로젝트"],
    email: "minjun.choi@saramsahoe.org",
    scholarUrl: scholarSearchUrl("최민준"),
  },
  {
    id: "oh-seyoung",
    name: "오세영",
    role: "연구원",
    category: "researcher",
    interests: ["기술사회학", "디지털전환"],
    bio: "자동화와 디지털 전환이 노동과 돌봄의 자리를 어떻게 바꾸는지 인간 중심 관점에서 연구합니다.",
    fullBio:
      "오세영 연구원은 기술사회학을 전공했으며, 자동화와 디지털 전환이 노동과 돌봄의 현장에 남기는 흔적을 인간 중심 설계의 언어로 번역하는 연구를 하고 있습니다. 기술 도입 이후 현장의 변화를 추적하는 참여 관찰 연구를 진행 중입니다.",
    publications: ["인간 중심 기술 설계를 위한 사회과학적 제언 (2025)"],
    projects: ["인간 중심 기술과 사회 연구"],
    email: "seyoung.oh@saramsahoe.org",
    scholarUrl: scholarSearchUrl("오세영"),
  },
  {
    id: "kang-taeyun",
    name: "강태윤",
    role: "연구보조원",
    category: "staff",
    interests: ["현장조사", "데이터관리"],
    bio: "현장 조사 일정 조율과 수집 자료 정리를 맡고 있습니다. 대학원에서 사회조사방법론을 공부하고 있습니다.",
    fullBio:
      "강태윤 연구보조원은 현장 조사 일정 조율, 인터뷰 녹취 정리, 수집 자료의 체계적 관리를 담당하고 있습니다. 사회조사방법론을 전공하는 대학원생으로, 고령 1인 가구 구술 조사와 지역 현장 조사에 함께 참여하고 있습니다.",
    publications: [],
    projects: ["고령 1인 가구 생활사 구술 조사 보조", "지역 현장 조사 보조"],
    email: "taeyun.kang@saramsahoe.org",
    scholarUrl: scholarSearchUrl("강태윤"),
  },
  {
    id: "yoon-jiwon",
    name: "윤지원",
    role: "연구보조원",
    category: "staff",
    interests: ["구술사", "아카이빙"],
    bio: "구술 인터뷰 기록을 아카이빙하고 정리하는 작업을 맡고 있습니다. 기록물 관리에 관심이 많습니다.",
    fullBio:
      "윤지원 연구보조원은 구술사 인터뷰 기록의 전사, 분류, 아카이빙을 담당하고 있습니다. 기록물 관리학을 공부하며 연구센터가 축적한 구술 자료가 장기적으로 열람 가능한 형태로 남을 수 있도록 체계를 정비하고 있습니다.",
    publications: [],
    projects: ["구술 자료 아카이빙 체계 구축"],
    email: "jiwon.yoon@saramsahoe.org",
    scholarUrl: scholarSearchUrl("윤지원"),
  },
  {
    id: "bae-soyeon",
    name: "배소연",
    role: "행정간사",
    category: "staff",
    interests: ["연구행정", "세미나기획"],
    bio: "정기 세미나와 공개 포럼 운영, 연구센터의 전반적인 행정 업무를 맡고 있습니다.",
    fullBio:
      "배소연 행정간사는 연구센터의 정기 세미나와 공개 포럼 운영, 예산 및 일정 관리를 포함한 전반적인 행정 업무를 담당하고 있습니다. 연구진과 외부 참여자 사이의 소통 창구 역할을 하며, 연구 성과가 공적 논의로 이어지도록 자리를 만드는 일에 힘쓰고 있습니다.",
    publications: [],
    projects: ["정기 세미나 운영", "공개 포럼 운영"],
    email: "soyeon.bae@saramsahoe.org",
    scholarUrl: scholarSearchUrl("배소연"),
  },
]
