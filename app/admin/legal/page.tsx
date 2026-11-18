import type { Metadata } from "next"

import {
  getSiteSettings,
  updatePrivacyContent,
  updateTermsContent,
} from "@/app/actions/site-settings"
import { LegalContentEditor } from "@/components/admin/legal-content-editor"

export const metadata: Metadata = {
  title: "약관 및 정책",
}

export default async function AdminLegalPage() {
  const settings = await getSiteSettings()

  if (!settings) {
    return (
      <p className="text-sm text-destructive">
        약관/정책 내용을 불러오지 못했습니다. supabase/site_settings_v2.sql이 실행되었는지
        확인해 주세요.
      </p>
    )
  }

  return (
    <div className="flex max-w-xl flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        클릭하면 전문이 보이고 수정할 수 있어요
      </p>
      <LegalContentEditor
        title="이용약관"
        initialContent={settings.termsContent}
        onSave={updateTermsContent}
      />
      <LegalContentEditor
        title="개인정보처리방침"
        initialContent={settings.privacyContent}
        onSave={updatePrivacyContent}
      />
    </div>
  )
}
