"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { HistoryEntry } from "@/lib/history-content";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type HistoryEntryRow = {
  id: string;
  year: string;
  title: string;
  description: string;
  photo_path: string | null;
  sort_order: number;
};

const HISTORY_COLUMNS = "id, year, title, description, photo_path, sort_order";

function mapRow(supabase: SupabaseServerClient, row: HistoryEntryRow): HistoryEntry {
  const photoUrl = row.photo_path
    ? supabase.storage.from("history-photos").getPublicUrl(row.photo_path).data.publicUrl
    : null;

  return {
    id: row.id,
    year: row.year,
    title: row.title,
    description: row.description,
    photoPath: row.photo_path,
    photoUrl,
    sortOrder: row.sort_order,
  };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null을 반환해 호출부가 에러 화면을 보여줄 수 있게 한다. */
export async function getHistoryEntries(): Promise<HistoryEntry[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("history_entries")
    .select(HISTORY_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getHistoryEntries]", error.message);
    return null;
  }

  return (data as HistoryEntryRow[]).map((row) => mapRow(supabase, row));
}

export type HistoryActionResult = {
  error: string | null;
  entry?: HistoryEntry;
};

export async function createHistoryEntry(input: {
  year: string;
  title: string;
  description: string;
  photoPath: string | null;
}): Promise<HistoryActionResult> {
  if (!(await requireAdmin())) {
    return { error: "연혁 추가는 관리자만 이용할 수 있습니다." };
  }

  const year = input.year.trim();
  const title = input.title.trim();
  if (!year || !title) {
    return { error: "연도와 제목을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();

  // 새로 추가하는 항목은 가장 마지막 순서로 둔다.
  const { data: maxRow } = await supabase
    .from("history_entries")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -10) + 10;

  const { data, error } = await supabase
    .from("history_entries")
    .insert({
      year,
      title,
      description: input.description.trim(),
      photo_path: input.photoPath,
      sort_order: nextSortOrder,
    })
    .select(HISTORY_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/about/history");
  return { error: null, entry: mapRow(supabase, data as HistoryEntryRow) };
}

export async function updateHistoryEntry(input: {
  id: string;
  year: string;
  title: string;
  description: string;
  photoPath: string | null;
}): Promise<HistoryActionResult> {
  if (!(await requireAdmin())) {
    return { error: "연혁 수정은 관리자만 이용할 수 있습니다." };
  }

  const year = input.year.trim();
  const title = input.title.trim();
  if (!year || !title) {
    return { error: "연도와 제목을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("history_entries")
    .update({
      year,
      title,
      description: input.description.trim(),
      photo_path: input.photoPath,
    })
    .eq("id", input.id)
    .select(HISTORY_COLUMNS)
    .single();

  if (error) {
    return { error: "관리자 권한이 있는 계정만 연혁을 수정할 수 있습니다." };
  }

  revalidatePath("/about/history");
  return { error: null, entry: mapRow(supabase, data as HistoryEntryRow) };
}

export async function deleteHistoryEntry(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "연혁 삭제는 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("history_entries").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/about/history");
  return { error: null };
}

/** 드래그로 바뀐 순서를 그대로 저장한다: orderedIds의 배열 인덱스 * 10을 새 sort_order로 일괄 반영한다. */
export async function reorderHistoryEntries(orderedIds: string[]): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "순서 변경은 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("history_entries")
        .update({ sort_order: index * 10 })
        .eq("id", id)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  revalidatePath("/about/history");
  return { error: null };
}
