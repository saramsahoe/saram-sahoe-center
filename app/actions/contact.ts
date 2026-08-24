"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ContactResult = {
  error: string | null;
};

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

  return { error: null };
}
