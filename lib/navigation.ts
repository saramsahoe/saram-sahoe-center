export type NavItem = {
  /** Korean label shown in the UI */
  title: string
  /** Small romanized/English caption used in the mobile drawer */
  caption: string
  href: string
}

export const mainNav: NavItem[] = [
  { title: "목적 및 비전", caption: "Mission", href: "/about/mission" },
  { title: "사업 및 활동분야", caption: "Programs", href: "/about/research" },
  { title: "연혁", caption: "History", href: "/about/history" },
  { title: "게시판", caption: "Board", href: "/board" },
  { title: "함께하는 사람들", caption: "People", href: "/people" },
]

export const siteConfig = {
  name: "연구센터 사람과 사회",
  nameEn: "Research & Education Center for Humane & Society",
  representative: "이화영",
  address: "서울시 강남구 논현로 146길 42",
  email: "contact@saramsahoe.org",
  phone: "070-4225-6225",
  foundedAt: "2014년 8월 28일",
}
