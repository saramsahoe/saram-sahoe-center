"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MemberRole, Profile } from "@/lib/account-content";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  affiliation: string | null;
  role: MemberRole;
  created_at: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    affiliation: row.affiliation,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, affiliation, role, created_at")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return mapProfile(data as ProfileRow);
}

export type ProfileActionResult = {
  error: string | null;
};

export async function updateMyProfile(input: {
  fullName: string;
  affiliation: string;
}): Promise<ProfileActionResult> {
  const fullName = input.fullName.trim();
  const affiliation = input.affiliation.trim();

  if (!fullName) {
    return { error: "이름을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, affiliation: affiliation || null })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mypage");
  revalidatePath("/board");
  return { error: null };
}

export async function updateMyPassword(input: {
  password: string;
}): Promise<ProfileActionResult> {
  if (input.password.length < 8) {
    return { error: "비밀번호는 8자 이상이어야 합니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: input.password });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
