"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthResult = {
  error: string | null;
  message?: string;
};

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
