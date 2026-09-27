export type HistoryEntry = {
  id: string
  /** '2014' 또는 '2023~2025'처럼 자유 텍스트 */
  year: string
  title: string
  description: string
  /** history-photos 버킷 안의 저장 경로. 수정 폼에서 "사진을 안 건드렸다"를 판단하는 데 쓴다. */
  photoPath: string | null
  photoUrl: string | null
  sortOrder: number
}

export const MAX_HISTORY_PHOTO_BYTES = 100 * 1024 * 1024 // 100MB

export const ALLOWED_HISTORY_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
