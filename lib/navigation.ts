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
  { title: "갤러리", caption: "Gallery", href: "/board/gallery" },
  { title: "함께하는 사람들", caption: "People", href: "/people" },
]

/**
 * 주요 메뉴 중 현재 경로와 가장 구체적으로(가장 긴 href로) 일치하는 항목을 찾는다.
 * "게시판"(/board)과 "갤러리"(/board/gallery)처럼 한 href가 다른 href의 하위 경로인
 * 경우, 단순 prefix 매칭만 쓰면 두 메뉴가 동시에 활성화되어 보이는 문제가 있어서 이렇게 처리한다.
 */
export function getActiveNavHref(pathname: string, items: NavItem[]): string | null {
  const matches = items.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )
  if (matches.length === 0) return null
  return matches.reduce((longest, item) =>
    item.href.length > longest.href.length ? item : longest
  ).href
}

export const siteConfig = {
  name: "연구센터 사람과 사회",
  nameEn: "Research & Education Center for Humane & Society",
  representative: "이화영",
  address: "서울시 강남구 논현로 146길 42",
  email: "contact@saramsahoe.org",
  phone: "070-4225-6225",
  foundedAt: "2014년 8월 28일",
}
