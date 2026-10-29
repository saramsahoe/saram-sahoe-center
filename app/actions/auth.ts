"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .single();

  if (profile && !profile.is_active) {
    await supabase.auth.signOut();
    return { error: "비활성화된 계정입니다. 관리자에게 문의해 주세요." };
  }

  revalidatePath("/", "layout");
  // 여기서 redirect()로 서버 쪽에서 바로 이동시키면, 클라이언트 라우터 캐시에 남아있던
  // 로그인 전 "/" 페이지가 재사용되면서 헤더가 로그인 상태로 안 바뀌는 경우가 있었다.
  // 호출부(로그인 폼)가 성공 응답을 받은 뒤 location.href로 완전히 새로 불러오게 한다.
  return { error: null };
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * 비밀번호 재설정 인증번호를 메일로 보낸다. 회원가입 이메일 인증과 같은
 * email_otps 테이블/RPC를 purpose='password_reset'으로 재사용한다.
 * 계정이 없는 이메일이어도 동일한 성공 메시지를 반환해(이메일 존재 여부 비노출),
 * 실제 발송만 조용히 건너뛴다.
 */
export async function requestPasswordResetCode(email: string): Promise<AuthResult> {
  const trimmed = email.trim();
  if (!EMAIL_RE.test(trimmed)) {
    return { error: "올바른 이메일 형식이 아닙니다." };
  }

  // profiles는 본인 것만 읽을 수 있게 RLS가 걸려 있어(로그인 전이라 더더욱),
  // 이메일로 계정 존재 여부를 확인하려면 서비스 롤 클라이언트가 필요하다.
  const admin = createAdminSupabaseClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", trimmed)
    .maybeSingle();

  if (profile) {
    const supabase = await createServerSupabaseClient();
    const { data: code, error } = await supabase.rpc("request_email_otp", {
      p_email: trimmed,
      p_purpose: "password_reset",
    });

    if (!error && code) {
      await sendEmail({
        to: trimmed,
        subject: "[연구센터 사람과 사회] 비밀번호 재설정 인증번호",
        html: `
          <p>비밀번호 재설정을 위한 인증번호입니다.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
          <p>인증번호는 10분간 유효합니다. 본인이 요청하지 않았다면 이 메일은 무시해 주세요.</p>
        `,
      });
    }
  }

  return {
    error: null,
    message: "입력하신 이메일로 인증번호를 보내드렸습니다. 메일함을 확인해 주세요.",
  };
}

export async function verifyPasswordResetCode(
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
    p_purpose: "password_reset",
    p_code: code.trim(),
  });

  if (error) {
    return { error: error.message };
  }
  if (!verified) {
    return { error: "인증번호가 올바르지 않거나 만료되었습니다." };
  }

  return { error: null, message: "인증이 완료되었습니다. 새 비밀번호를 입력해 주세요." };
}

export async function resetPasswordWithCode(input: {
  email: string;
  newPassword: string;
}): Promise<AuthResult> {
  const email = input.email.trim();
  if (input.newPassword.length < 8) {
    return { error: "비밀번호는 8자 이상이어야 합니다." };
  }

  // 로그인 세션이 없는 상태이므로, 방금 인증번호 확인을 통과했는지 다시 확인한다
  // (회원가입 때의 has_verified_email과 동일한 "최근 30분 이내 인증 완료" 체크).
  const supabase = await createServerSupabaseClient();
  const { data: recentlyVerified } = await supabase.rpc("has_verified_email", {
    p_email: email,
    p_purpose: "password_reset",
  });

  if (!recentlyVerified) {
    return { error: "인증번호 확인을 먼저 완료해 주세요." };
  }

  const admin = createAdminSupabaseClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return { error: "계정을 찾을 수 없습니다." };
  }

  const { error } = await admin.auth.admin.updateUserById(profile.id, {
    password: input.newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    error: null,
    message: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.",
  };
}

