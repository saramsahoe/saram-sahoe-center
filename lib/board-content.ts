/**
 * Mock board data layer. Shaped to mirror a future Supabase `posts` table
 * (id uuid, category text, title text, content text, author text,
 * created_at timestamptz, view_count int4, pinned bool) plus a
 * `post_attachments` child table, so `mockPosts` can be swapped for a
 * `supabase.from("posts").select(...)` query without changing consumers.
 */

export type PostCategory = "notice" | "press" | "research" | "seminar"

export const categoryMeta: Record<
  PostCategory,
  { label: string; badgeVariant: "accent" | "accent-soft" | "outline" }
> = {
  notice: { label: "공지사항", badgeVariant: "accent" },
  press: { label: "보도자료", badgeVariant: "accent-soft" },
  research: { label: "연구소식", badgeVariant: "outline" },
  seminar: { label: "세미나/행사", badgeVariant: "outline" },
}

export const categoryFilters: { value: PostCategory | "all"; label: string }[] =
  [
    { value: "all", label: "전체" },
    { value: "notice", label: "공지사항" },
    { value: "press", label: "보도자료" },
    { value: "research", label: "연구소식" },
    { value: "seminar", label: "세미나/행사" },
  ]

export type Attachment = {
  name: string
  url: string
  /** bytes */
  size: number
}

export const MAX_ATTACHMENTS_BYTES_PER_POST = 10 * 1024 * 1024 // 10MB
export const MAX_TOTAL_ATTACHMENTS_BYTES = 1024 * 1024 * 1024 // 1GB
export const MAX_INLINE_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

// image/svg+xml은 제외했다: SVG는 <script>/이벤트 핸들러를 담을 수 있어 공개 버킷에
// 그대로 올리면 첨부파일 URL을 직접 열었을 때 저장형 XSS로 이어질 수 있다.
export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  // 이미지 / 미디어
  "image/jpeg",
  "image/webp",
  "image/png",
  "image/gif",
  "audio/mpeg",
  "video/mp4",
  // PDF & 텍스트
  "application/pdf",
  "text/plain",
  "text/csv",
  // 한글 (HWP / HWPX)
  "application/x-hwp",
  "application/haansofthwp",
  "application/vnd.hancom.hwp",
  "application/vnd.hancom.hwpx",
  "application/haansofthwpx",
  "application/hwp+zip",
  // MS 오피스
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // 압축
  "application/zip",
  "application/x-zip-compressed",
]

export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
  ".hwp",
  ".hwpx",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".zip",
  ".mp3",
  ".mp4",
]

export function isAllowedAttachmentExtension(fileName: string): boolean {
  const dot = fileName.lastIndexOf(".")
  if (dot === -1) return false
  const ext = fileName.slice(dot).toLowerCase()
  return ALLOWED_ATTACHMENT_EXTENSIONS.includes(ext)
}

// 본문 삽입 이미지는 <img>로만 렌더링되지만, 동일한 이유로 SVG는 제외한다.
export const ALLOWED_INLINE_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]

export type Post = {
  id: string
  category: PostCategory
  title: string
  author: string
  date: string
  views: number
  pinned: boolean
  isPublic: boolean
  attachments: Attachment[]
  excerpt: string
  content: string
}

/** attachments 버킷이 비공개라 DB에는 고정 URL 대신 스토리지 경로를 저장한다. */
export type AttachmentRecord = {
  name: string
  path: string
  size: number
}

export const mockPosts: Post[] = [
  {
    id: "post-2026-0301",
    category: "notice",
    title: "2026년 상반기 정기 세미나 일정 안내",
    author: "배소연",
    date: "2026.03.01",
    views: 482,
    pinned: true,
    isPublic: true,
    attachments: [{ name: "2026년_상반기_세미나_일정표.pdf", url: "#", size: 319488 }],
    excerpt:
      "2026년 상반기 정기 세미나 일정을 안내드립니다. 매월 둘째 주 목요일 오후 2시에 진행되며...",
    content:
      "2026년 상반기 정기 세미나 일정을 안내드립니다. 매월 둘째 주 목요일 오후 2시, 연구센터 세미나실에서 진행되며 누구나 사전 신청 없이 참여하실 수 있습니다.\n\n1월: 불안정 노동과 생애사\n2월: 돌봄 노동의 가치 측정\n3월: 지역 소멸과 공동체 회복력\n\n세부 일정은 첨부된 일정표를 참고해 주시고, 문의사항은 행정간사에게 연락 바랍니다.",
  },
  {
    id: "post-2026-0215",
    category: "notice",
    title: "홈페이지 개편 및 게시판 서비스 오픈 안내",
    author: "관리자",
    date: "2026.02.15",
    views: 356,
    pinned: true,
    isPublic: true,
    attachments: [],
    excerpt:
      "연구센터 사람과 사회 홈페이지가 새롭게 개편되었습니다. 게시판을 통해 공지사항과 연구 소식을...",
    content:
      "연구센터 사람과 사회 홈페이지가 새롭게 개편되었습니다. 이번 개편으로 게시판 서비스가 새로 열려, 공지사항과 보도자료, 연구 소식, 세미나 및 행사 정보를 한 곳에서 확인하실 수 있습니다.\n\n이용 중 불편한 점이나 제안 사항은 하단 문의하기를 통해 알려주시기 바랍니다.",
  },
  {
    id: "post-2026-0314",
    category: "seminar",
    title: "제12차 정기 세미나 — 돌봄 노동의 가치 측정",
    author: "이수아",
    date: "2026.03.14",
    views: 214,
    pinned: false,
    isPublic: true,
    attachments: [{ name: "세미나_발표자료.pdf", url: "#", size: 1468006 }],
    excerpt:
      "돌봄 노동을 통계로 옮기는 과정에서 무엇이 지워지는지, 연구진과 현장 활동가가 함께 짚었습니다...",
    content:
      "돌봄 노동을 통계로 옮기는 과정에서 무엇이 지워지는지, 연구진과 현장 활동가가 함께 짚었습니다. 돌봄 제공자의 시간과 정서적 노동을 어떻게 수치화할 것인가에 대한 논의가 활발히 오갔습니다.\n\n발표 자료는 첨부파일에서 다운로드하실 수 있습니다.",
  },
  {
    id: "post-2026-0227",
    category: "research",
    title: "고령 1인 가구 생활사 구술 조사 착수",
    author: "정하은",
    date: "2026.02.27",
    views: 189,
    pinned: false,
    isPublic: true,
    attachments: [],
    excerpt:
      "서울 서북권 3개 동을 대상으로 고령 1인 가구의 일상과 관계망을 기록하는 장기 조사를 시작했습니다...",
    content:
      "서울 서북권 3개 동을 대상으로 고령 1인 가구의 일상과 관계망을 기록하는 장기 구술사 조사를 시작했습니다. 인터뷰이의 언어를 그대로 살리는 기록 방식을 통해 통계가 지워버리는 개별 서사를 복원하는 것이 이번 조사의 목표입니다.",
  },
  {
    id: "post-2026-0130",
    category: "seminar",
    title: "공개 포럼 — 축소되는 지역, 남는 사람들",
    author: "박지훈",
    date: "2026.01.30",
    views: 301,
    pinned: false,
    isPublic: true,
    attachments: [{ name: "포럼_자료집.pdf", url: "#", size: 2202010 }],
    excerpt:
      "인구가 줄어드는 지역에서 남은 이들이 서로를 지탱하는 방식을 주민과 연구자가 함께 논의했습니다...",
    content:
      "인구가 줄어드는 지역에서 남은 이들이 서로를 지탱하는 방식을 주민과 연구자가 함께 논의했습니다. 포럼 자료집은 첨부파일에서 확인하실 수 있습니다.",
  },
  {
    id: "post-2026-0122",
    category: "press",
    title: "[보도자료] 연구센터 사람과 사회, 노동 실태 조사 결과 발표",
    author: "배소연",
    date: "2026.01.22",
    views: 527,
    pinned: false,
    isPublic: true,
    attachments: [{ name: "보도자료_노동실태조사.hwp", url: "#", size: 552960 }],
    excerpt:
      "연구센터 사람과 사회가 불안정 노동 실태 조사 결과를 발표했습니다. 조사에는 수도권 거주 노동자...",
    content:
      "연구센터 사람과 사회가 불안정 노동 실태 조사 결과를 발표했습니다. 조사에는 수도권 거주 노동자 1,200명이 참여했으며, 결과는 정책 자문 자료로도 활용될 예정입니다.",
  },
  {
    id: "post-2026-0110",
    category: "research",
    title: "노동 패널 데이터 분석 중간 결과 공유",
    author: "최민준",
    date: "2026.01.10",
    views: 143,
    pinned: false,
    isPublic: true,
    attachments: [],
    excerpt:
      "대규모 노동 패널 데이터를 활용한 불안정 고용 확산 패턴 분석의 중간 결과를 공유합니다...",
    content:
      "대규모 노동 패널 데이터를 활용한 불안정 고용 확산 패턴 분석의 중간 결과를 공유합니다. 세부 통계표와 방법론은 추후 정식 논문으로 발표될 예정입니다.",
  },
  {
    id: "post-2025-1218",
    category: "press",
    title: "[보도자료] 연구센터, 2026년 신년 연구 계획 발표",
    author: "김도현",
    date: "2025.12.18",
    views: 398,
    pinned: false,
    isPublic: true,
    attachments: [],
    excerpt:
      "연구센터 사람과 사회가 2026년 신년 연구 계획을 발표했습니다. 노동, 돌봄, 지역 공동체 세 축을...",
    content:
      "연구센터 사람과 사회가 2026년 신년 연구 계획을 발표했습니다. 노동, 돌봄, 지역 공동체 세 축을 중심으로 인간 중심 기술과 사회정책 연구를 확대할 예정입니다.",
  },
  {
    id: "post-2025-1205",
    category: "seminar",
    title: "제11차 정기 세미나 — 청년 노동과 생애 전환",
    author: "오세영",
    date: "2025.12.05",
    views: 176,
    pinned: false,
    isPublic: true,
    attachments: [{ name: "세미나_요약노트.pdf", url: "#", size: 839680 }],
    excerpt:
      "청년 세대가 마주한 노동과 주거, 관계의 불안정성을 주제로 진행된 세미나 요약입니다...",
    content:
      "청년 세대가 마주한 노동과 주거, 관계의 불안정성을 주제로 진행된 세미나 요약입니다. 세대 간 격차가 만들어지는 구조적 원인에 대한 토론이 이어졌습니다.",
  },
  {
    id: "post-2025-1120",
    category: "notice",
    title: "연구센터 사무공간 임시 이전 안내",
    author: "관리자",
    date: "2025.11.20",
    views: 267,
    pinned: false,
    isPublic: true,
    attachments: [],
    excerpt:
      "리모델링 공사로 인해 12월 한 달간 사무공간이 임시 이전됩니다. 방문 전 참고 부탁드립니다...",
    content:
      "리모델링 공사로 인해 12월 한 달간 사무공간이 임시 이전됩니다. 방문 예정이신 분들은 사전에 문의하기를 통해 확인해 주시기 바랍니다.",
  },
  {
    id: "post-2025-1108",
    category: "research",
    title: "돌봄 제공자 인터뷰 시리즈 1편 공개",
    author: "정하은",
    date: "2025.11.08",
    views: 205,
    pinned: false,
    isPublic: true,
    attachments: [],
    excerpt:
      "가족 안에서 돌봄을 전담해 온 이들의 목소리를 담은 인터뷰 시리즈 첫 번째 편을 공개합니다...",
    content:
      "가족 안에서 돌봄을 전담해 온 이들의 목소리를 담은 인터뷰 시리즈 첫 번째 편을 공개합니다. 다음 편은 12월 중 공개될 예정입니다.",
  },
  {
    id: "post-2025-1022",
    category: "press",
    title: "[보도자료] 지역 소멸 대응 정책 토론회 개최 예정",
    author: "박지훈",
    date: "2025.10.22",
    views: 312,
    pinned: false,
    isPublic: true,
    attachments: [{ name: "토론회_보도자료.hwp", url: "#", size: 419840 }],
    excerpt:
      "지역 소멸에 대응하는 정책 토론회가 다음 달 개최될 예정입니다. 관계 부처와 지역 주민이 함께...",
    content:
      "지역 소멸에 대응하는 정책 토론회가 다음 달 개최될 예정입니다. 관계 부처와 지역 주민이 함께 참여하여 실질적인 대응 방안을 논의할 예정입니다.",
  },
  {
    id: "post-2025-1005",
    category: "research",
    title: "기술사회학 연구팀, 자동화 현장 참여 관찰 시작",
    author: "오세영",
    date: "2025.10.05",
    views: 158,
    pinned: false,
    isPublic: true,
    attachments: [],
    excerpt:
      "자동화 도입 이후 현장의 변화를 추적하는 참여 관찰 연구가 시작되었습니다...",
    content:
      "자동화 도입 이후 현장의 변화를 추적하는 참여 관찰 연구가 시작되었습니다. 연구 결과는 인간 중심 기술 설계를 위한 제언으로 발전될 예정입니다.",
  },
  {
    id: "post-2025-0918",
    category: "seminar",
    title: "제10차 정기 세미나 — 노동 통계의 사각지대",
    author: "최민준",
    date: "2025.09.18",
    views: 192,
    pinned: false,
    isPublic: true,
    attachments: [{ name: "세미나_발표자료.pdf", url: "#", size: 1153434 }],
    excerpt:
      "노동 통계가 포착하지 못하는 비공식 노동의 영역을 주제로 진행된 세미나입니다...",
    content:
      "노동 통계가 포착하지 못하는 비공식 노동의 영역을 주제로 진행된 세미나입니다. 통계 설계 단계에서부터 사각지대를 줄이는 방법을 함께 모색했습니다.",
  },
]
