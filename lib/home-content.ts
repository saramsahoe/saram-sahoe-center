/** 메인 화면 "소식" 캐러셀 한 장. 실제 데이터는 news_slides 테이블(app/actions/news.ts)에서 온다. */
export type NewsSlide = {
  id: string
  category: string
  title: string
  summary: string
  date: string
  /** news-photos 버킷 안의 저장 경로. 수정 폼에서 "사진을 안 건드렸다"를 판단하는 데 쓴다. */
  photoPath: string | null
  photoUrl: string | null
  sortOrder: number
}

export const MAX_NEWS_PHOTO_BYTES = 100 * 1024 * 1024 // 100MB

export const ALLOWED_NEWS_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
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
