export type PostCategory = "notice" | "press" | "research" | "seminar" | "gallery"

export const categoryMeta: Record<
  PostCategory,
  { label: string; badgeVariant: "accent" | "accent-soft" | "outline" }
> = {
  notice: { label: "공지사항", badgeVariant: "accent" },
  press: { label: "보도자료", badgeVariant: "accent-soft" },
  research: { label: "소식", badgeVariant: "outline" },
  seminar: { label: "세미나/행사", badgeVariant: "outline" },
  gallery: { label: "갤러리", badgeVariant: "outline" },
}

export const categoryFilters: { value: PostCategory | "all"; label: string }[] =
  [
    { value: "all", label: "전체" },
    { value: "notice", label: "공지사항" },
    { value: "press", label: "보도자료" },
    { value: "research", label: "소식" },
    { value: "seminar", label: "세미나/행사" },
    { value: "gallery", label: "갤러리" },
  ]

export type Attachment = {
  name: string
  url: string
  /** bytes */
  size: number
}

export const MAX_ATTACHMENTS_BYTES_PER_POST = 100 * 1024 * 1024 // 100MB
export const MAX_TOTAL_ATTACHMENTS_BYTES = 1024 * 1024 * 1024 // 1GB
export const MAX_INLINE_IMAGE_BYTES = 100 * 1024 * 1024 // 100MB

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

// 유튜브 시청/공유 링크(watch, youtu.be, shorts, embed)에서 영상 ID를 뽑아낸다.
// 유튜브가 아니거나 영상 ID를 알 수 없으면 null을 반환한다.
function extractYoutubeVideoId(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\.|^m\./, "")
  let videoId: string | null = null

  if (host === "youtu.be") {
    videoId = parsed.pathname.slice(1).split("/")[0] || null
  } else if (host === "youtube.com" || host === "music.youtube.com") {
    if (parsed.pathname === "/watch") {
      videoId = parsed.searchParams.get("v")
    } else if (parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.slice("/embed/".length)
    } else if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.slice("/shorts/".length)
    }
  }

  if (!videoId) return null
  videoId = videoId.split(/[?&]/)[0]
  if (!/^[\w-]{6,}$/.test(videoId)) return null

  return videoId
}

/** 유튜브 링크를 임베드 재생 URL로 변환한다. 유튜브가 아니면 null. */
export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

/** 유튜브 링크에서 썸네일 이미지 URL을 얻는다. 갤러리 그리드에서 미리보기로 쓴다. */
export function getYoutubeThumbnailUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
}

export type GalleryMediaItem =
  | { type: "image"; url: string }
  | { type: "youtube"; thumbnailUrl: string }

/**
 * 게시글 본문(마크다운)에서 삽입된 이미지와 유튜브 임베드 링크를 순서대로 뽑아낸다.
 * 갤러리 카테고리 목록에서 게시글마다 사진/동영상을 나열해 보여주는 데 쓴다.
 */
export function extractGalleryMedia(content: string): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = []
  const imageRegex = /!\[[^\]]*\]\(([^)\s]+)\)/g

  for (const match of content.matchAll(imageRegex)) {
    items.push({ type: "image", url: match[1] })
  }

  const withoutImages = content.replace(imageRegex, "")
  const urlRegex = /\bhttps?:\/\/[^\s)]+/g
  for (const match of withoutImages.matchAll(urlRegex)) {
    const thumbnailUrl = getYoutubeThumbnailUrl(match[0])
    if (thumbnailUrl) items.push({ type: "youtube", thumbnailUrl })
  }

  return items
}

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
