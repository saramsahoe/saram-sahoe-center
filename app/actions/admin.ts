"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { MemberRole, Profile } from "@/lib/account-content";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  affiliation: string | null;
  role: MemberRole;
  is_active: boolean;
  created_at: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    affiliation: row.affiliation,
    role: row.role,
    isActive: row.is_active,
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
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  return data?.role === "admin" && data?.is_active === true;
}

async function requireAdminUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, adminId: null };

  const { data } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  const isAdmin = data?.role === "admin" && data?.is_active === true;
  return { supabase, adminId: isAdmin ? user.id : null };
}

export type AdminActionResult = {
  error: string | null;
};

/** 전체 회원 정보를 조회한다. 관리자만 호출 가능. */
export async function getAllMembers(): Promise<Profile[] | { error: string }> {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return { error: "관리자만 접근할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, affiliation, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return (data as ProfileRow[]).map(mapProfile);
}

/** 회원의 이름/등급을 변경한다. 관리자만 호출 가능. */
export async function updateMemberProfile(input: {
  userId: string;
  fullName: string;
  role: MemberRole;
}): Promise<AdminActionResult> {
  const { supabase, adminId } = await requireAdminUser();
  if (!adminId) {
    return { error: "관리자만 접근할 수 있습니다." };
  }

  const fullName = input.fullName.trim();
  if (!fullName) {
    return { error: "이름을 입력해 주세요." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, role: input.role })
    .eq("id", input.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/members");
  revalidatePath("/board");
  return { error: null };
}

/**
 * 회원의 로그인 이메일을 변경한다. 관리자만 호출 가능.
 * auth.users(로그인 자격 증명)와 profiles.email을 함께 갱신하며,
 * Supabase 서비스 롤(SUPABASE_SECRET_KEY)이 반드시 설정되어 있어야 한다.
 */
export async function updateMemberEmail(input: {
  userId: string;
  email: string;
}): Promise<AdminActionResult> {
  const { adminId } = await requireAdminUser();
  if (!adminId) {
    return { error: "관리자만 접근할 수 있습니다." };
  }

  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "올바른 이메일 형식이 아닙니다." };
  }

  let adminClient;
  try {
    adminClient = createAdminSupabaseClient();
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "관리자 클라이언트를 생성하지 못했습니다.",
    };
  }

  const { error: authError } = await adminClient.auth.admin.updateUserById(
    input.userId,
    { email, email_confirm: true }
  );

  if (authError) {
    return { error: authError.message };
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ email })
    .eq("id", input.userId);

  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath("/admin/members");
  return { error: null };
}

/** 회원 계정을 비활성화/재활성화한다. 관리자만 호출 가능. 본인 계정은 대상에서 제외한다. */
export async function setMemberActive(input: {
  userId: string;
  isActive: boolean;
}): Promise<AdminActionResult> {
  const { supabase, adminId } = await requireAdminUser();
  if (!adminId) {
    return { error: "관리자만 접근할 수 있습니다." };
  }

  if (adminId === input.userId) {
    return { error: "본인 계정은 비활성화할 수 없습니다." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: input.isActive })
    .eq("id", input.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/members");
  revalidatePath("/board");
  return { error: null };
}
