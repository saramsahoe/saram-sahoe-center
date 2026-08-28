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
    id: "seminar-20xx",
    category: "Seminar",
    title: "다시함께 의기양양",
    summary:
      "포스트 코로나 시대, 여성의 임파워먼트 향상을 위한 치유와 회복 프로그램",
    date: "2000.00.00",
    image: "/news/seminar.png",
    alt: "프로그램 소개 및 특강 안내 사진",
  },
  {
    id: "fieldwork-2015",
    category: "Fieldwork",
    title: "음악으로 함께 하는 여행 - 필리핀 오지마을 음악봉사 (2015년)",
    summary:
      "필리핀 오지마을에서 음악봉사를 진행하며 지역 주민과 함께 음악을 통해 소통하고, 그들의 삶과 문화를 이해하는 시간을 가졌습니다.",
    date: "2015.00.00",
    image: "/news/fieldwork.png",
    alt: "필리핀 아이들과 연구자들이 함께 교실에 있는 모습",
  },
  {
    id: "forum-20xx",
    category: "Forum",
    title: "다시 함께 의기양양, 마음챙김 1일차",
    summary:
      "경력 단절 여성들을 돕기 위한 마음챙김 프로그램의 첫 번째 세션으로, 참가자들이 자신의 감정을 이해하고 스트레스를 관리하는 방법을 배우는 시간을 가졌습니다.",
    date: "2000.00.00",
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
    body: "사람을 수단이 아닌 출발점으로 두는 연구. 우리가 왜 이 일을 하는지 밝힙니다.",
    href: "/about/mission",
  },
  {
    title: "사업 및 활동분야",
    caption: "Programs",
    body: "노동, 돌봄, 지역 공동체. 세 개의 축으로 한국 사회의 변화를 추적합니다.",
    href: "/about/research",
  },
  {
    title: "연혁",
    caption: "History",
    body: "작은 독서모임에서 독립 연구기관까지, 지금까지 걸어온 길을 기록했습니다.",
    href: "/about/history",
  },
]
