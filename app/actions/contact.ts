"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";

export type ContactResult = {
  error: string | null;
};

const CONTACT_INBOX_EMAIL =
  process.env.CONTACT_INBOX_EMAIL ?? "saram-sahoe@naver.com";

export async function submitInquiry(input: {
  name: string;
  email: string;
  organization?: string;
  message: string;
}): Promise<ContactResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const affiliation = input.organization?.trim() || null;

  if (!name || !email || !message) {
    return { error: "이름, 이메일, 문의 내용을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    affiliation,
    message,
  });

  if (error) {
    return { error: error.message };
  }

  // 문의는 DB에 이미 저장되었으므로, 메일 발송이 실패해도 사용자에게는 에러로 노출하지 않는다.
  const { error: emailError } = await sendEmail({
    to: CONTACT_INBOX_EMAIL,
    replyTo: email,
    subject: `[문의하기] ${name}님으로부터 새 문의가 도착했습니다`,
    html: `
      <h2>새 문의가 접수되었습니다</h2>
      <p><strong>이름:</strong> ${escapeHtml(name)}</p>
      <p><strong>이메일:</strong> ${escapeHtml(email)}</p>
      ${affiliation ? `<p><strong>소속:</strong> ${escapeHtml(affiliation)}</p>` : ""}
      <p><strong>내용:</strong></p>
      <p style="white-space: pre-line;">${escapeHtml(message)}</p>
    `,
  });

  if (emailError) {
    console.error("[submitInquiry] 알림 메일 발송 실패:", emailError);
  }

  return { error: null };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
