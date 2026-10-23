"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Member, MemberCategory } from "@/lib/people-content";

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

type OrgMemberRow = {
  id: string;
  name: string;
  category: MemberCategory;
  roles: string[] | null;
  chaired_committee_id: string | null;
  career: string[] | null;
  links: { label: string; url: string }[] | null;
  sort_order: number;
};

const MEMBER_COLUMNS =
  "id, name, category, roles, chaired_committee_id, career, links, sort_order";

async function mapRow(supabase: SupabaseServerClient, row: OrgMemberRow): Promise<Member> {
  let chairedCommitteeName: string | null = null;
  if (row.chaired_committee_id) {
    const { data } = await supabase
      .from("org_committees")
      .select("name")
      .eq("id", row.chaired_committee_id)
      .single();
    chairedCommitteeName = data?.name ?? null;
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    titles: row.roles ?? [],
    chairedCommitteeId: row.chaired_committee_id,
    chairedCommitteeName,
    career: row.career ?? [],
    links: row.links ?? [],
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

  return Promise.all((data as OrgMemberRow[]).map((row) => mapRow(supabase, row)));
}

export type OrgMemberActionResult = {
  error: string | null;
  member?: Member;
};

export type OrgMemberInput = {
  name: string;
  category: MemberCategory;
  titles: string[];
  chairedCommitteeId: string | null;
  career: string[];
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
      category: input.category,
      roles: input.titles,
      chaired_committee_id: input.titles.includes("위원장") ? input.chairedCommitteeId : null,
      career: input.career,
      links: input.links,
      sort_order: nextSortOrder,
    })
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/people");
  return { error: null, member: await mapRow(supabase, data as OrgMemberRow) };
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
      category: input.category,
      roles: input.titles,
      chaired_committee_id: input.titles.includes("위원장") ? input.chairedCommitteeId : null,
      career: input.career,
      links: input.links,
    })
    .eq("id", input.id)
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    return { error: "관리자 권한이 있는 계정만 구성원 정보를 수정할 수 있습니다." };
  }

  revalidatePath("/people");
  return { error: null, member: await mapRow(supabase, data as OrgMemberRow) };
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
