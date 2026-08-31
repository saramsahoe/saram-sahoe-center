"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  isAllowedAttachmentExtension,
  MAX_ATTACHMENTS_BYTES_PER_POST,
  MAX_TOTAL_ATTACHMENTS_BYTES,
  type Attachment,
  type AttachmentRecord,
  type Post,
  type PostCategory,
} from "@/lib/board-content";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

// attachments 버킷을 비공개로 전환하기 전에 저장된 레거시 레코드는 {name,url,size}
// 형태일 수 있어, 두 형태를 모두 받아들인다.
type StoredAttachment = Partial<AttachmentRecord> & { name: string; url?: string; size: number };

type PostRow = {
  id: string;
  category: string;
  title: string;
  content: string;
  author_name: string;
  view_count: number;
  is_pinned: boolean;
  is_public: boolean;
  attachments: StoredAttachment[] | null;
  created_at: string;
};

const POST_COLUMNS =
  "id, category, title, content, author_name, view_count, is_pinned, is_public, attachments, created_at";

const ATTACHMENT_SIGNED_URL_TTL_SECONDS = 60 * 60; // 1시간

// DB의 `posts.category` 체크 제약은 한글 라벨만 허용하므로, 앱 내부의 영문 카테고리 값과 서로 변환한다.
const CATEGORY_TO_DB: Record<PostCategory, string> = {
  notice: "공지사항",
  press: "보도자료",
  research: "연구소식",
  seminar: "세미나/행사",
};

const CATEGORY_FROM_DB: Record<string, PostCategory> = {
  공지사항: "notice",
  보도자료: "press",
  연구소식: "research",
  "세미나/행사": "seminar",
};

function legacyPathFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const marker = "/object/public/attachments/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

/** 비공개 attachments 버킷 경로들을, 요청 시점에 만료되는 서명 URL로 바꿔서 반환한다. */
async function resolveAttachments(
  supabase: SupabaseServerClient,
  records: StoredAttachment[]
): Promise<Attachment[]> {
  if (records.length === 0) return [];

  const resolved = await Promise.all(
    records.map(async (record) => {
      const path = record.path ?? legacyPathFromUrl(record.url);
      if (!path) return null;

      const { data, error } = await supabase.storage
        .from("attachments")
        .createSignedUrl(path, ATTACHMENT_SIGNED_URL_TTL_SECONDS, {
          download: record.name,
        });

      if (error || !data) return null;
      return { name: record.name, url: data.signedUrl, size: record.size };
    })
  );

  return resolved.filter((file): file is Attachment => file !== null);
}

async function mapRow(supabase: SupabaseServerClient, row: PostRow): Promise<Post> {
  return {
    id: row.id,
    category: CATEGORY_FROM_DB[row.category] ?? "notice",
    title: row.title,
    author: row.author_name,
    date: row.created_at.slice(0, 10).replaceAll("-", "."),
    views: row.view_count,
    pinned: row.is_pinned,
    isPublic: row.is_public,
    attachments: await resolveAttachments(supabase, row.attachments ?? []),
    excerpt: row.content.slice(0, 60),
    content: row.content,
  };
}

/**
 * Supabase `posts` 테이블에서 목록을 읽어온다. 실패하면 null을 반환해 호출부가
 * mock 데이터로 대체할 수 있게 한다. 비공개(is_public=false) 게시글은 posts RLS가
 * 비로그인 방문자에게 애초에 내려주지 않으므로 여기서 따로 필터링할 필요가 없다.
 */
export async function getPosts(): Promise<Post[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getPosts]", error.message);
    return null;
  }

  return Promise.all((data as PostRow[]).map((row) => mapRow(supabase, row)));
}

export type PostActionResult = {
  error: string | null;
  post?: Post;
};

function attachmentsError(attachments: AttachmentRecord[]): string | null {
  const total = attachments.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_ATTACHMENTS_BYTES_PER_POST) {
    return "첨부파일은 게시글당 최대 100MB까지 업로드할 수 있습니다.";
  }
  if (attachments.some((file) => !isAllowedAttachmentExtension(file.name))) {
    return "허용되지 않는 파일 형식이 포함되어 있습니다.";
  }
  return null;
}

export async function createPost(input: {
  title: string;
  category: PostCategory;
  content: string;
  isPublic: boolean;
  attachments: AttachmentRecord[];
}): Promise<PostActionResult> {
  const title = input.title.trim();
  const content = input.content.trim();
  const attachments = input.attachments ?? [];

  if (!title || !content) {
    return { error: "제목과 내용을 입력해 주세요." };
  }

  const sizeError = attachmentsError(attachments);
  if (sizeError) {
    return { error: sizeError };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "글쓰기는 로그인 후 이용할 수 있습니다." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const authorName = profile?.full_name ?? user.email ?? "익명";

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      category: CATEGORY_TO_DB[input.category],
      content,
      author_id: user.id,
      author_name: authorName,
      is_public: input.isPublic,
      attachments,
    })
    .select(POST_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/board");
  return { error: null, post: await mapRow(supabase, data as PostRow) };
}

export async function updatePost(input: {
  id: string;
  title: string;
  category: PostCategory;
  content: string;
  isPublic: boolean;
  attachments: AttachmentRecord[];
}): Promise<PostActionResult> {
  const title = input.title.trim();
  const content = input.content.trim();
  const attachments = input.attachments ?? [];

  if (!title || !content) {
    return { error: "제목과 내용을 입력해 주세요." };
  }

  const sizeError = attachmentsError(attachments);
  if (sizeError) {
    return { error: sizeError };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  // author_id로 다시 필터링하지 않는다: 본인 글 수정 / 관리자의 임의 글 수정 여부는
  // posts RLS(posts_author_delete와 별개인 update 정책들)가 판단한다.
  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      category: CATEGORY_TO_DB[input.category],
      content,
      is_public: input.isPublic,
      attachments,
    })
    .eq("id", input.id)
    .select(POST_COLUMNS)
    .single();

  if (error) {
    return { error: "본인이 작성했거나 관리자 권한이 있는 글만 수정할 수 있습니다." };
  }

  revalidatePath("/board");
  return { error: null, post: await mapRow(supabase, data as PostRow) };
}

export async function deletePost(postId: string): Promise<{ error: string | null }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const { error, count } = await supabase
    .from("posts")
    .delete({ count: "exact" })
    .eq("id", postId);

  if (error) {
    return { error: error.message };
  }
  if (!count) {
    return { error: "본인이 작성했거나 관리자 권한이 있는 글만 삭제할 수 있습니다." };
  }

  revalidatePath("/board");
  return { error: null };
}

export type AttachmentsUsage = {
  used: number;
  limit: number;
};

/** 전체 첨부파일 저장 용량(1GB 상한) 사용 현황을 조회한다. */
export async function getAttachmentsUsage(): Promise<AttachmentsUsage | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_bucket_usage", {
    p_bucket: "attachments",
  });

  if (error) {
    console.error("[getAttachmentsUsage]", error.message);
    return null;
  }

  return { used: Number(data) || 0, limit: MAX_TOTAL_ATTACHMENTS_BYTES };
}

/** 작성자 본인이 아닌 조회일 때만 서버에서 조회수를 1 증가시키고, 최신 조회수를 반환한다. */
export async function incrementPostView(postId: string): Promise<number | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("increment_post_view", {
    p_post_id: postId,
    p_viewer_id: user?.id ?? null,
  });

  if (error) {
    console.error("[incrementPostView]", error.message);
    return null;
  }

  revalidatePath("/board");
  return data as number;
}
