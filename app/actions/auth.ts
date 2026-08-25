"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";

export type AuthResult = {
  error: string | null;
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendSignupVerificationCode(
  email: string
): Promise<AuthResult> {
  const trimmed = email.trim();
  if (!EMAIL_RE.test(trimmed)) {
    return { error: "올바른 이메일 형식이 아닙니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { data: code, error } = await supabase.rpc("request_email_otp", {
    p_email: trimmed,
    p_purpose: "signup_verify",
  });

  if (error || !code) {
    return { error: error?.message ?? "인증번호 발급에 실패했습니다." };
  }

  const { error: emailError } = await sendEmail({
    to: trimmed,
    subject: "[연구센터 사람과 사회] 이메일 인증번호",
    html: `
      <p>회원가입을 위한 인증번호입니다.</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p>인증번호는 10분간 유효합니다.</p>
    `,
  });

  if (emailError) {
    return { error: "인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return { error: null, message: "인증번호를 보냈습니다. 메일함을 확인해 주세요." };
}

export async function verifySignupVerificationCode(
  email: string,
  code: string
): Promise<AuthResult> {
  const trimmed = email.trim();
  if (!trimmed || !code.trim()) {
    return { error: "이메일과 인증번호를 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data: verified, error } = await supabase.rpc("verify_email_otp", {
    p_email: trimmed,
    p_purpose: "signup_verify",
    p_code: code.trim(),
  });

  if (error) {
    return { error: error.message };
  }
  if (!verified) {
    return { error: "인증번호가 올바르지 않거나 만료되었습니다." };
  }

  return { error: null, message: "이메일 인증이 완료되었습니다." };
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  affiliation: string;
}): Promise<AuthResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const affiliation = input.affiliation.trim();
  const { password } = input;

  if (!name || !email || !password || !affiliation) {
    return { error: "모든 필수 항목을 입력해 주세요." };
  }
  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상이어야 합니다." };
  }

  const supabase = await createServerSupabaseClient();

  const { data: verified } = await supabase.rpc("has_verified_email", {
    p_email: email,
    p_purpose: "signup_verify",
  });

  if (!verified) {
    return { error: "이메일 인증을 먼저 완료해 주세요." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, affiliation } },
  });

  if (error) {
    return { error: error.message };
  }

  // 이메일 인증이 켜져 있으면 세션 없이 유저만 생성된다.
  if (!data.session) {
    return {
      error: null,
      message:
        "가입 확인 메일을 보냈습니다. 메일함에서 인증을 완료한 뒤 로그인해 주세요.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim();
  const { password } = input;

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export type FindAccountResult = {
  error: string | null;
  matches: string[];
};

/** 이름으로 계정을 찾아 등록된 이메일(=로그인 아이디)을 마스킹해서 화면에 바로 보여준다. */
export async function findAccountId(name: string): Promise<FindAccountResult> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { error: "이름을 입력해 주세요.", matches: [] };
  }

  const supabase = await createServerSupabaseClient();
  const { data: matches, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("full_name", trimmed)
    .limit(5);

  if (error) {
    return { error: error.message, matches: [] };
  }

  return {
    error: null,
    matches: (matches ?? []).map((profile) => maskEmail(profile.email)),
  };
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visibleLength = Math.min(2, local.length);
  const visible = local.slice(0, visibleLength);
  const masked = "*".repeat(Math.max(local.length - visibleLength, 2));
  return `${visible}${masked}@${domain}`;
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const trimmed = email.trim();
  if (!EMAIL_RE.test(trimmed)) {
    return { error: "올바른 이메일 형식이 아닙니다." };
  }

  const supabase = await createServerSupabaseClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // 실제 메일 발송은 Supabase Auth가 담당한다 (Supabase 대시보드의
  // Authentication > Emails 설정에 따른 발신자/템플릿 사용).
  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    error: null,
    message: "입력하신 이메일로 비밀번호 재설정 안내를 보내드렸습니다.",
  };
}

