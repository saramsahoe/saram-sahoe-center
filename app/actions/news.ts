"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { NewsSlide } from "@/lib/home-content";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type NewsSlideRow = {
  id: string;
  category: string;
  title: string;
  summary: string;
  date_label: string;
  photo_path: string | null;
  sort_order: number;
};

const NEWS_COLUMNS = "id, category, title, summary, date_label, photo_path, sort_order";

function mapRow(supabase: SupabaseServerClient, row: NewsSlideRow): NewsSlide {
  const photoUrl = row.photo_path
    ? supabase.storage.from("news-photos").getPublicUrl(row.photo_path).data.publicUrl
    : null;

  return {
    id: row.id,
    category: row.category,
    title: row.title,
    summary: row.summary,
    date: row.date_label,
    photoPath: row.photo_path,
    photoUrl,
    sortOrder: row.sort_order,
  };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null — 호출부가 빈 상태로 처리한다. */
export async function getNewsSlides(): Promise<NewsSlide[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("news_slides")
    .select(NEWS_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getNewsSlides]", error.message);
    return null;
  }

  return (data as NewsSlideRow[]).map((row) => mapRow(supabase, row));
}

export type NewsSlideActionResult = {
  error: string | null;
  slide?: NewsSlide;
};

export type NewsSlideInput = {
  category: string;
  title: string;
  summary: string;
  date: string;
  photoPath: string | null;
};

export async function createNewsSlide(input: NewsSlideInput): Promise<NewsSlideActionResult> {
  if (!(await requireAdmin())) {
    return { error: "소식 추가는 관리자만 이용할 수 있습니다." };
  }
  const category = input.category.trim();
  const title = input.title.trim();
  if (!category || !title) {
    return { error: "태그와 제목을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("news_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -10) + 10;

  const { data, error } = await supabase
    .from("news_slides")
    .insert({
      category,
      title,
      summary: input.summary.trim(),
      date_label: input.date.trim(),
      photo_path: input.photoPath,
      sort_order: nextSortOrder,
    })
    .select(NEWS_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null, slide: mapRow(supabase, data as NewsSlideRow) };
}

export async function updateNewsSlide(
  input: NewsSlideInput & { id: string }
): Promise<NewsSlideActionResult> {
  if (!(await requireAdmin())) {
    return { error: "소식 수정은 관리자만 이용할 수 있습니다." };
  }
  const category = input.category.trim();
  const title = input.title.trim();
  if (!category || !title) {
    return { error: "태그와 제목을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("news_slides")
    .update({
      category,
      title,
      summary: input.summary.trim(),
      date_label: input.date.trim(),
      photo_path: input.photoPath,
    })
    .eq("id", input.id)
    .select(NEWS_COLUMNS)
    .single();

  if (error) {
    return { error: "관리자 권한이 있는 계정만 소식을 수정할 수 있습니다." };
  }

  revalidatePath("/");
  return { error: null, slide: mapRow(supabase, data as NewsSlideRow) };
}

export async function deleteNewsSlide(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "소식 삭제는 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("news_slides").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}
