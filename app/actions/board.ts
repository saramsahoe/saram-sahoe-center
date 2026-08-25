"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Post, PostCategory } from "@/lib/board-content";

type PostRow = {
  id: string;
  category: string;
  title: string;
  content: string;
  author_name: string;
  view_count: number;
  is_pinned: boolean;
  created_at: string;
};

const POST_COLUMNS =
  "id, category, title, content, author_name, view_count, is_pinned, created_at";

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

function mapRow(row: PostRow): Post {
  return {
    id: row.id,
    category: CATEGORY_FROM_DB[row.category] ?? "notice",
    title: row.title,
    author: row.author_name,
    date: row.created_at.slice(0, 10).replaceAll("-", "."),
    views: row.view_count,
    pinned: row.is_pinned,
    attachments: [],
    excerpt: row.content.slice(0, 60),
    content: row.content,
  };
}

/** Supabase `posts` 테이블에서 목록을 읽어온다. 실패하면 null을 반환해 호출부가 mock 데이터로 대체할 수 있게 한다. */
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

  return (data as PostRow[]).map(mapRow);
}

export type PostActionResult = {
  error: string | null;
  post?: Post;
};

export async function createPost(input: {
  title: string;
  category: PostCategory;
  content: string;
}): Promise<PostActionResult> {
  const title = input.title.trim();
  const content = input.content.trim();

  if (!title || !content) {
    return { error: "제목과 내용을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "글쓰기는 로그인 후 이용할 수 있습니다." };
  }

  const authorName =
    (user.user_metadata?.name as string | undefined) ?? user.email ?? "익명";

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      category: CATEGORY_TO_DB[input.category],
      content,
      author_id: user.id,
      author_name: authorName,
    })
    .select(POST_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/board");
  return { error: null, post: mapRow(data as PostRow) };
}

export async function updatePost(input: {
  id: string;
  title: string;
  category: PostCategory;
  content: string;
}): Promise<PostActionResult> {
  const title = input.title.trim();
  const content = input.content.trim();

  if (!title || !content) {
    return { error: "제목과 내용을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ title, category: CATEGORY_TO_DB[input.category], content })
    .eq("id", input.id)
    .eq("author_id", user.id)
    .select(POST_COLUMNS)
    .single();

  if (error) {
    return { error: "본인이 작성한 글만 수정할 수 있습니다." };
  }

  revalidatePath("/board");
  return { error: null, post: mapRow(data as PostRow) };
}
