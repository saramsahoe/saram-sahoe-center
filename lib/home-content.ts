export type NewsSlide = {
  id: string
  category: string
  title: string
  summary: string
  date: string
  image: string
  alt: string
}

export const newsSlides: NewsSlide[] = [
  {
    id: "seminar-2022",
    category: "Seminar",
    title: "서울시 성평등기금사업 - 다시함께 의기양양, 서로함께 의기양양, 모두함께 의기양양",
    summary:
      "여성 1인 기업가를 대상으로 각자, 그리고 모두가 힘을 내기 위한 시간을 갖습니다.",
    date: "2020 ~ 2022",
    image: "/news/seminar.png",
    alt: "프로그램 소개 및 특강 안내 사진",
  },
  {
    id: "fieldwork-2015",
    category: "Fieldwork",
    title: "음악으로 함께 하는 여행 - 필리핀 오지마을 음악봉사",
    summary:
      "필리핀 오지마을에서 음악봉사를 진행하며 지역 주민과 함께 음악을 통해 소통하고, 그들의 삶과 문화를 이해하는 시간을 가졌습니다.",
    date: "2015",
    image: "/news/fieldwork.png",
    alt: "필리핀 아이들과 연구자들이 함께 교실에 있는 모습",
  },
  {
    id: "forum-2020",
    category: "Forum",
    title: "서초여성가족위탁",
    summary:
      "",
    date: "2020 ~ 2024",
    image: "/news/forum.png",
    alt: "온라인 ZOOM 세미나 화면에 여러 명의 참가자가 있는 모습",
  },
]

export type IntroCard = {
  title: string
  caption: string
  body: string
  href: string
}

export const introCards: IntroCard[] = [
  {
    title: "목적 및 비전",
    caption: "Mission",
    body: "사람을 수단이 아닌 출발점으로 두는 활동, 우리가 왜 이 일을 하는지 밝힙니다.",
    href: "/about/mission",
  },
  {
    title: "사업 및 활동분야",
    caption: "Programs",
    body: "나, 우리, 환경 등 세 개의 차원으로 융합적 리더십을 추구합니다.",
    href: "/about/research",
  },
  {
    title: "연혁",
    caption: "History",
    body: "지금까지 걸어온 길을 기록했습니다.",
    href: "/about/history",
  },
]
