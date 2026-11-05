/**
 * 사이트 전체 색상 설정.
 *
 * 여기 값만 바꾸면 사이트 전체 색상이 한번에 바뀝니다. (app/layout.tsx가 이 값들을
 * CSS 변수로 주입하고, app/globals.css가 그 변수를 참조하는 구조입니다.)
 */
export const themeConfig = {
  /** 배경 색상 — 페이지 전체 배경 그라데이션 (위 → 아래) */
  background: {
    gradientFrom: "#ffffff",
    gradientTo: "#f0f8f7",
  },

  /** 푸터 색상 — 맨 아래 푸터 영역 배경·글씨 */
  footer: {
    background: "#f0f8f7",
    text: "#0a0a0a",
  },

  /** 버튼 색상 — 로그인/회원가입/문의하기 등 주요 버튼의 배경·글씨 색 */
  button: {
    background: "#1c2620",
    text: "#ffffff",
  },

  /** 카드색상 — 콘텐츠 카드(Card), 알림창 등 흰 박스형 배경 */
  card: {
    background: "#E3F2D8",
  },

  /** 대표 글씨 색상 — 제목과 본문 텍스트의 기본 색 */
  heading: {
    color: "#0a0a0a",
  },

  /** 내용 글씨 색상 — 캡션, 배지, 부가 설명 등 보조 텍스트 색 */
  content: {
    color: "#0a0a0a",
  },

  /** 포인트 색상 — 강조 텍스트(예: "RESEARCH & EDUCATION..."), 캐치프레이즈 강조 단어,
   *  배지, 밑줄, 포커스 링, 조직도 강조 노드 등 사이트 전체의 "포인트" 색.
   *  버튼 색상과는 별개로 관리됩니다. */
  accent: {
    color: "#11640b",
    /** 포인트 색상 위에 올라가는 글씨 색 (배지, 조직도 노드 등) */
    text: "#ffffff",
  },

  /** 타이포그래피 — 글자 크기 설정 */
  typography: {
    /** 섹션마다 붙는 영문 캡션 글씨 크기 (예: "Our Vision", "Quick Links", "Get in Touch",
     *  "Board", "Sitemap" 등). 여기 값 하나만 바꾸면 사이트 전체 영문 캡션이 한번에 바뀝니다. */
    eyebrowSize: "0.9rem",
    /** 사이트 전체 글자 크기의 기준값(브라우저 기본값 16px). 이 값만 바꾸면 rem 단위를
     *  쓰는 사이트 전체 글자 크기가 전부 같은 비율로 커지거나 작아집니다. */
    baseSize: "16px",
  },

  /**
   * 폰트(글씨체) 설정.
   *
   * - korean, headline: CDN으로 불러오는 웹폰트라 이름만 바꾸면 바로 적용됩니다
   *   (app/globals.css의 --font-sans/--font-heading/--font-serif가 이 값을 참조).
   * - english: Source Sans 3는 next/font로 불러오기 때문에, 폰트 "이름"은 여기서
   *   관리하지만 실제로 다른 영문 폰트로 교체하려면 app/layout.tsx의 Source_Sans_3
   *   import도 함께 바꿔야 합니다.
   */
  fonts: {
    /** 한글 기본 폰트 — 본문/제목 전반 (Pretendard) */
    korean: "Pretendard Variable",
    /** 영문 기본 폰트 — 라틴 문자 전반. 한글 폰트보다 먼저 와서 영문엔 이 폰트가,
     *  한글엔 자동으로 korean 폰트가 적용됩니다. */
    english: "Source Sans 3",
    /** 대문 캐치프레이즈 전용 한글 서체 (예: "사람은 아름다운 에너지입니다") */
    headline: "KoPubWorld Dotum",
  },
} as const
