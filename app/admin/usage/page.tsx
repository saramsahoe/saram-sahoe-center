import type { Metadata } from "next"

import { getUsageSnapshot } from "@/app/actions/usage"
import { UsageDashboard } from "@/components/admin/usage-dashboard"

export const metadata: Metadata = {
  title: "사용량",
}

export default async function AdminUsagePage() {
  const snapshot = await getUsageSnapshot()

  if (!snapshot) {
    return (
      <p className="text-sm text-destructive">
        사용량 정보를 불러오지 못했습니다. supabase/usage_dashboard.sql이 실행되었는지
        확인해 주세요.
      </p>
    )
  }

  return <UsageDashboard snapshot={snapshot} />
}
