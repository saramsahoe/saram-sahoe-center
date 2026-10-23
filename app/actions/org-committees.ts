"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Committee } from "@/lib/people-content";

type CommitteeRow = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

const COMMITTEE_COLUMNS = "id, name, description, sort_order";

function mapRow(row: CommitteeRow): Committee {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null을 반환해 호출부가 에러 화면을 보여줄 수 있게 한다. */
export async function getOrgCommittees(): Promise<Committee[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("org_committees")
    .select(COMMITTEE_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getOrgCommittees]", error.message);
    return null;
  }

  return (data as CommitteeRow[]).map(mapRow);
}

export type CommitteeActionResult = {
  error: string | null;
  committee?: Committee;
};

export async function createOrgCommittee(input: {
  name: string;
  description: string;
}): Promise<CommitteeActionResult> {
  if (!(await requireAdmin())) {
    return { error: "위원회 추가는 관리자만 이용할 수 있습니다." };
  }
  const name = input.name.trim();
  if (!name) {
    return { error: "위원회 이름을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("org_committees")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -10) + 10;

  const { data, error } = await supabase
    .from("org_committees")
    .insert({ name, description: input.description.trim(), sort_order: nextSortOrder })
    .select(COMMITTEE_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null, committee: mapRow(data as CommitteeRow) };
}

export async function updateOrgCommittee(input: {
  id: string;
  name: string;
  description: string;
}): Promise<CommitteeActionResult> {
  if (!(await requireAdmin())) {
    return { error: "위원회 수정은 관리자만 이용할 수 있습니다." };
  }
  const name = input.name.trim();
  if (!name) {
    return { error: "위원회 이름을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("org_committees")
    .update({ name, description: input.description.trim() })
    .eq("id", input.id)
    .select(COMMITTEE_COLUMNS)
    .single();

  if (error) {
    return { error: "관리자 권한이 있는 계정만 위원회를 수정할 수 있습니다." };
  }

  revalidatePath("/people");
  return { error: null, committee: mapRow(data as CommitteeRow) };
}

export async function deleteOrgCommittee(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "위원회 삭제는 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("org_committees").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null };
}

/** 드래그로 바뀐 순서를 그대로 저장한다. */
export async function reorderOrgCommittees(orderedIds: string[]): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "순서 변경은 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("org_committees").update({ sort_order: index * 10 }).eq("id", id)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  revalidatePath("/people");
  return { error: null };
}
