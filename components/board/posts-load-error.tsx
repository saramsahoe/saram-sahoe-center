import { AlertTriangle } from "lucide-react"

export function PostsLoadError() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
      <AlertTriangle
        className="size-8 text-muted-foreground"
        strokeWidth={1.5}
      />
      <p className="text-sm text-muted-foreground">
        게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    </div>
  )
}
