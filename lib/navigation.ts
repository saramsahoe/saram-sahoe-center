export type NavItem = {
  /** Korean label shown in the UI */
  title: string
  /** Small romanized/English caption used in the mobile drawer */
  caption: string
  href: string
}

export const mainNav: NavItem[] = [
  { title: "단체 목적", caption: "Mission", href: "/mission" },
  { title: "연구 분야", caption: "Research", href: "/research" },
  { title: "연혁", caption: "History", href: "/history" },
  { title: "게시판", caption: "Board", href: "/board" },
  { title: "사람들", caption: "People", href: "/people" },
]

export const siteConfig = {
  name: "연구센터 사람과 사회",
  nameEn: "Research Center: People & Society",
  representative: "홍길동",
  address: "서울특별시 종로구 세종대로 000, 0층 (03000)",
  email: "contact@saramsahoe.org",
  phone: "02-0000-0000",
}
