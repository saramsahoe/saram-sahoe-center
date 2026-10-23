"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TitleOption } from "@/lib/people-content";

type TitleOptionRow = {
  id: string;
  label: string;
  is_default: boolean;
};

function mapRow(row: TitleOptionRow): TitleOption {
  return { id: row.id, label: row.label, isDefault: row.is_default };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null을 반환해 호출부가 에러 화면을 보여줄 수 있게 한다. */
export async function getTitleOptions(): Promise<TitleOption[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("org_title_options")
    .select("id, label, is_default")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getTitleOptions]", error.message);
    return null;
  }

  return (data as TitleOptionRow[]).map(mapRow);
}

export async function createTitleOption(
  label: string
): Promise<{ error: string | null; option?: TitleOption }> {
  if (!(await requireAdmin())) {
    return { error: "직함 추가는 관리자만 이용할 수 있습니다." };
  }
  const trimmed = label.trim();
  if (!trimmed) {
    return { error: "직함을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("org_title_options")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -10) + 10;

  const { data, error } = await supabase
    .from("org_title_options")
    .insert({ label: trimmed, is_default: false, sort_order: nextSortOrder })
    .select("id, label, is_default")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 있는 직함입니다." };
    }
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null, option: mapRow(data as TitleOptionRow) };
}

export async function deleteTitleOption(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "직함 삭제는 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("org_title_options")
    .delete()
    .eq("id", id)
    .eq("is_default", false);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null };
}
