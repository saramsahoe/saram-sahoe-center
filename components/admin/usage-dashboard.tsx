import type { UsageSnapshot } from "@/app/actions/usage"
import { SUPABASE_PLAN_LIMITS } from "@/lib/usage-limits"
import { cn, formatFileSize } from "@/lib/utils"

function UsageBar({
  label,
  used,
  limit,
  detail,
}: {
  label: string
  used: number
  limit: number
  detail?: string
}) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0
  const barColor =
    pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-amber-500" : "bg-accent"

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {formatFileSize(used)} / {formatFileSize(limit)} ({pct.toFixed(1)}%)
        </p>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </div>
  )
}

export function UsageDashboard({ snapshot }: { snapshot: UsageSnapshot }) {
  const { databaseBytes, buckets, storageTotalBytes } = snapshot

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="font-heading text-sm font-semibold text-foreground">전체 사용량</p>
        <div className="mt-4 flex flex-col gap-5">
          <UsageBar
            label="데이터베이스"
            used={databaseBytes}
            limit={SUPABASE_PLAN_LIMITS.databaseBytes}
          />
          <UsageBar
            label="스토리지 전체 (첨부파일 + 이미지)"
            used={storageTotalBytes}
            limit={SUPABASE_PLAN_LIMITS.storageBytes}
          />
        </div>
      </div>

      <div>
        <p className="font-heading text-sm font-semibold text-foreground">
          스토리지 — 종류별
        </p>
        <div className="mt-4 flex flex-col gap-5">
          {buckets.map((bucket) => (
            <UsageBar
              key={bucket.id}
              label={bucket.label}
              used={bucket.bytes}
              limit={SUPABASE_PLAN_LIMITS.storageBytes}
              detail={
                storageTotalBytes > 0
                  ? `사용 중인 스토리지 중 ${((bucket.bytes / storageTotalBytes) * 100).toFixed(1)}%`
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        한도는 Supabase Free 플랜 기준(데이터베이스 500MB, 스토리지 1GB)입니다. 실제
        플랜이 다르면 app/actions/usage.ts의 SUPABASE_PLAN_LIMITS 값을 바꿔주세요.
      </p>
    </div>
  )
}
