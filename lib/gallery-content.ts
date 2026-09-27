export type GalleryPhoto = {
  /** gallery-photos 버킷 안의 저장 경로 (공개 버킷이라 이 경로로 바로 공개 URL을 만든다) */
  path: string
  url: string
  size: number
}

export type GalleryPost = {
  id: string
  /** 활동연월, 'YYYY-MM' 형식 */
  activityMonth: string
  title: string
  content: string
  /** 배열 순서 = 표시 순서. 첫 번째 사진이 목록의 대표사진이다. */
  photos: GalleryPhoto[]
  createdAt: string
}

export type GallerySortMode = "activity" | "created"

export const MAX_GALLERY_PHOTO_BYTES = 100 * 1024 * 1024 // 100MB

export const ALLOWED_GALLERY_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
