/**
 * 사이트 전체 색상 설정.
 *
 * 여기 값만 바꾸면 사이트 전체 색상이 한번에 바뀝니다. (app/layout.tsx가 이 값들을
 * CSS 변수로 주입하고, app/globals.css가 그 변수를 참조하는 구조입니다.)
 */
export const themeConfig = {
  /** 배경 색상 — 페이지 전체 배경 그라데이션 (위 → 아래) */
  background: {
    gradientFrom: "#cdbff2",
    gradientTo: "#a79be6",
  },

  /** 푸터 색상 — 맨 아래 푸터 영역 배경 */
  footer: {
    background: "#e6e0fa",
  },

  /** 버튼 색상 — 로그인/회원가입/문의하기 등 주요 버튼의 배경·글씨 색 */
  button: {
    background: "#e7000b",
    text: "#ffffff",
  },

  /** 카드색상 — 콘텐츠 카드(Card), 알림창 등 흰 박스형 배경 */
  card: {
    background: "#faf9ff",
  },

  /** 대표 글씨 색상 — 제목과 본문 텍스트의 기본 색 */
  heading: {
    color: "#0a0a0a",
  },

  /** 내용 글씨 색상 — 캡션, 배지, 부가 설명 등 보조 텍스트 색 */
  content: {
    color: "#0a0a0a",
  },
} as const
