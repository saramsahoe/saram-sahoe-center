import type { Metadata } from "next"

import { getSiteSettings } from "@/app/actions/site-settings"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"

export const metadata: Metadata = {
  title: "사이트 설정",
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  if (!settings) {
    return (
      <p className="text-sm text-destructive">
        사이트 설정을 불러오지 못했습니다. supabase/site_settings.sql이 실행되었는지 확인해 주세요.
      </p>
    )
  }

  return <SiteSettingsForm initialSettings={settings} />
}
