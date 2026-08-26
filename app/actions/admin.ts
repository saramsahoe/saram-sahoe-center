"use server";

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

/** 현재 로그인한 사용자가 관리자인지 서버에서 확인한다. 페이지/액션 가드용. */
export async function requireAdmin(): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role === "admin";
}

export type AdminActionResult = {
  error: string | null;
};

/** 아이디(이메일)/비밀번호를 제외한 전체 회원 정보를 조회한다. 관리자만 호출 가능. */
export async function getAllMembers(): Promise<Profile[] | { error: string }> {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return { error: "관리자만 접근할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, affiliation, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return (data as ProfileRow[]).map(mapProfile);
}
