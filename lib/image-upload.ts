// Supabase Storage 키는 ASCII 안전 문자만 허용해서, 한글/공백이 든 원본 파일명을
// 그대로 경로에 넣으면 "Invalid key" 오류가 난다. 확장자만 유지하고 나머지는
// UUID로 대체한다 — 원본 파일명이 필요하면 호출부에서 별도 필드로 저장해 표시한다.
export function fileExtension(name: string) {
  const dot = name.lastIndexOf(".")
  return dot === -1 ? "" : name.slice(dot).toLowerCase()
}

// 이미지는 용량 절감을 위해 webp로 변환해서 올린다. gif는 애니메이션이
// 깨지므로 변환하지 않고 원본 그대로 둔다.
export async function toWebp(file: File): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/webp") return file

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext("2d")
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  )
  if (!blob) return file

  const webpName = `${file.name.replace(/\.[^.]+$/, "")}.webp`
  return new File([blob], webpName, { type: "image/webp" })
}
