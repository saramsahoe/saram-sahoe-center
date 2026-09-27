"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Member, MemberCategory } from "@/lib/people-content";

type OrgMemberRow = {
  id: string;
  name: string;
  role: string;
  roles: string[] | null;
  category: MemberCategory;
  interests: string[] | null;
  bio: string;
  affiliation: string | null;
  activity: string[] | null;
  career: string[] | null;
  publications: string[] | null;
  projects: string[] | null;
  email: string | null;
  scholar_url: string | null;
  website_url: string | null;
  links: { label: string; url: string }[] | null;
  sort_order: number;
};

const MEMBER_COLUMNS =
  "id, name, role, roles, category, interests, bio, affiliation, activity, career, publications, projects, email, scholar_url, website_url, links, sort_order";

function mapRow(row: OrgMemberRow): Member {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    roles: row.roles ?? undefined,
    category: row.category,
    interests: row.interests ?? [],
    bio: row.bio,
    affiliation: row.affiliation ?? undefined,
    activity: row.activity ?? undefined,
    career: row.career ?? undefined,
    publications: row.publications ?? [],
    projects: row.projects ?? [],
    email: row.email ?? undefined,
    scholarUrl: row.scholar_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    links: row.links ?? undefined,
    sortOrder: row.sort_order,
  };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null을 반환해 호출부가 에러 화면을 보여줄 수 있게 한다. */
export async function getOrgMembers(): Promise<Member[] | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("org_members")
    .select(MEMBER_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getOrgMembers]", error.message);
    return null;
  }

  return (data as OrgMemberRow[]).map(mapRow);
}

export type OrgMemberActionResult = {
  error: string | null;
  member?: Member;
};

export type OrgMemberInput = {
  name: string;
  role: string;
  roles: string[];
  category: MemberCategory;
  interests: string[];
  bio: string;
  affiliation: string;
  activity: string[];
  career: string[];
  publications: string[];
  projects: string[];
  email: string;
  scholarUrl: string;
  websiteUrl: string;
  links: { label: string; url: string }[];
};

export async function createOrgMember(input: OrgMemberInput): Promise<OrgMemberActionResult> {
  if (!(await requireAdmin())) {
    return { error: "구성원 추가는 관리자만 이용할 수 있습니다." };
  }
  if (!input.name.trim()) {
    return { error: "이름을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();

  // 새로 추가하는 항목은 가장 마지막 순서로 둔다.
  const { data: maxRow } = await supabase
    .from("org_members")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (maxRow?.sort_order ?? -10) + 10;

  const { data, error } = await supabase
    .from("org_members")
    .insert({
      name: input.name.trim(),
      role: input.role.trim(),
      roles: input.roles,
      category: input.category,
      interests: input.interests,
      bio: input.bio.trim(),
      affiliation: input.affiliation.trim() || null,
      activity: input.activity,
      career: input.career,
      publications: input.publications,
      projects: input.projects,
      email: input.email.trim() || null,
      scholar_url: input.scholarUrl.trim() || null,
      website_url: input.websiteUrl.trim() || null,
      links: input.links,
      sort_order: nextSortOrder,
    })
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null, member: mapRow(data as OrgMemberRow) };
}

export async function updateOrgMember(
  input: OrgMemberInput & { id: string }
): Promise<OrgMemberActionResult> {
  if (!(await requireAdmin())) {
    return { error: "구성원 수정은 관리자만 이용할 수 있습니다." };
  }
  if (!input.name.trim()) {
    return { error: "이름을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("org_members")
    .update({
      name: input.name.trim(),
      role: input.role.trim(),
      roles: input.roles,
      category: input.category,
      interests: input.interests,
      bio: input.bio.trim(),
      affiliation: input.affiliation.trim() || null,
      activity: input.activity,
      career: input.career,
      publications: input.publications,
      projects: input.projects,
      email: input.email.trim() || null,
      scholar_url: input.scholarUrl.trim() || null,
      website_url: input.websiteUrl.trim() || null,
      links: input.links,
    })
    .eq("id", input.id)
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    return { error: "관리자 권한이 있는 계정만 구성원 정보를 수정할 수 있습니다." };
  }

  revalidatePath("/people");
  return { error: null, member: mapRow(data as OrgMemberRow) };
}

export async function deleteOrgMember(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "구성원 삭제는 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("org_members").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null };
}

/** 드래그로 바뀐 순서를 그대로 저장한다: orderedIds의 배열 인덱스 * 10을 새 sort_order로 일괄 반영한다. */
export async function reorderOrgMembers(orderedIds: string[]): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "순서 변경은 관리자만 이용할 수 있습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("org_members")
        .update({ sort_order: index * 10 })
        .eq("id", id)
    )
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { error: failed.error.message };
  }

  revalidatePath("/people");
  return { error: null };
}
