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
    id: "seminar-2026-03",
    category: "Seminar",
    title: "제12차 정기 세미나 — 돌봄 노동의 가치 측정",
    summary:
      "돌봄 노동을 통계로 옮기는 과정에서 무엇이 지워지는지, 연구진과 현장 활동가가 함께 짚었습니다.",
    date: "2026.03.14",
    image: "/news/seminar.png",
    alt: "연구센터 회의실에서 연구진이 둘러앉아 세미나를 진행하는 모습",
  },
  {
    id: "fieldwork-2026-02",
    category: "Fieldwork",
    title: "고령 1인 가구 생활사 구술 조사 착수",
    summary:
      "서울 서북권 3개 동을 대상으로 고령 1인 가구의 일상과 관계망을 기록하는 장기 조사를 시작했습니다.",
    date: "2026.02.27",
    image: "/news/fieldwork.png",
    alt: "골목에서 연구자 두 명이 주민과 면담을 진행하는 모습",
  },
  {
    id: "forum-2026-01",
    category: "Forum",
    title: "공개 포럼 — 축소되는 지역, 남는 사람들",
    summary:
      "인구가 줄어드는 지역에서 남은 이들이 서로를 지탱하는 방식을 주민과 연구자가 함께 논의했습니다.",
    date: "2026.01.30",
    image: "/news/forum.png",
    alt: "주민들이 모인 강당에서 공개 포럼이 진행되는 모습",
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
    title: "단체 목적",
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
