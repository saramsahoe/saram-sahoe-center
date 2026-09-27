"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { GalleryPhoto, GalleryPost } from "@/lib/gallery-content";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type GalleryPhotoRecord = { path: string; size: number };

type GalleryPostRow = {
  id: string;
  activity_month: string;
  title: string;
  content: string;
  photos: GalleryPhotoRecord[] | null;
  created_at: string;
};

const GALLERY_COLUMNS = "id, activity_month, title, content, photos, created_at";

// gallery-photos는 공개 버킷이라 공개 URL을 즉시(동기적으로) 만들 수 있다 —
// attachments 버킷처럼 매번 서명 URL을 새로 발급받을 필요가 없다.
function resolvePhotos(
  supabase: SupabaseServerClient,
  records: GalleryPhotoRecord[]
): GalleryPhoto[] {
  return records.map((record) => {
    const { data } = supabase.storage.from("gallery-photos").getPublicUrl(record.path);
    return { path: record.path, size: record.size, url: data.publicUrl };
  });
}

function mapRow(supabase: SupabaseServerClient, row: GalleryPostRow): GalleryPost {
  return {
    id: row.id,
    activityMonth: row.activity_month,
    title: row.title,
    content: row.content,
    photos: resolvePhotos(supabase, row.photos ?? []),
    createdAt: row.created_at,
  };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null을 반환해 호출부가 에러 화면을 보여줄 수 있게 한다. */
export async function getGalleryPosts(): Promise<GalleryPost[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("gallery_posts")
    .select(GALLERY_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getGalleryPosts]", error.message);
    return null;
  }

  return (data as GalleryPostRow[]).map((row) => mapRow(supabase, row));
}

export type GalleryActionResult = {
  error: string | null;
  post?: GalleryPost;
};

export type GalleryPhotoInput = { path: string; size: number };

export async function createGalleryPost(input: {
  activityMonth: string;
  title: string;
  content: string;
  photos: GalleryPhotoInput[];
}): Promise<GalleryActionResult> {
  if (!(await requireAdmin())) {
    return { error: "갤러리 등록은 관리자만 이용할 수 있습니다." };
  }

  const activityMonth = input.activityMonth.trim();
  const title = input.title.trim();
  if (!activityMonth || !title) {
    return { error: "활동연월과 제목을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("gallery_posts")
    .insert({
      activity_month: activityMonth,
      title,
      content: input.content.trim(),
      photos: input.photos,
    })
    .select(GALLERY_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/gallery");
  return { error: null, post: mapRow(supabase, data as GalleryPostRow) };
}

export async function updateGalleryPost(input: {
  id: string;
  activityMonth: string;
  title: string;
  content: string;
  photos: GalleryPhotoInput[];
}): Promise<GalleryActionResult> {
  if (!(await requireAdmin())) {
    return { error: "갤러리 수정은 관리자만 이용할 수 있습니다." };
  }

  const activityMonth = input.activityMonth.trim();
  const title = input.title.trim();
  if (!activityMonth || !title) {
    return { error: "활동연월과 제목을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("gallery_posts")
    .update({
      activity_month: activityMonth,
      title,
      content: input.content.trim(),
      photos: input.photos,
    })
    .eq("id", input.id)
    .select(GALLERY_COLUMNS)
    .single();

  if (error) {
    return { error: "관리자 권한이 있는 계정만 갤러리를 수정할 수 있습니다." };
  }

  revalidatePath("/gallery");
  return { error: null, post: mapRow(supabase, data as GalleryPostRow) };
}

export async function deleteGalleryPost(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "갤러리 삭제는 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("gallery_posts").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/gallery");
  return { error: null };
}
