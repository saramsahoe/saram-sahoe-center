"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SiteSettings = {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string | null;
  naverMapUrl: string;
  /** Naver Cloud Platform Maps JS API Client ID. 비어있으면 정적 미리보기로 대체된다. */
  naverMapClientId: string | null;
  naverMapLat: number | null;
  naverMapLng: number | null;
};

type SiteSettingsRow = {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string | null;
  naver_map_url: string;
  naver_map_client_id: string | null;
  naver_map_lat: number | null;
  naver_map_lng: number | null;
};

const SETTINGS_COLUMNS =
  "seo_title, seo_description, seo_keywords, og_image_url, naver_map_url, naver_map_client_id, naver_map_lat, naver_map_lng";

function mapRow(row: SiteSettingsRow): SiteSettings {
  return {
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    ogImageUrl: row.og_image_url,
    naverMapUrl: row.naver_map_url,
    naverMapClientId: row.naver_map_client_id,
    naverMapLat: row.naver_map_lat,
    naverMapLng: row.naver_map_lng,
  };
}

/** 누구나(비로그인 포함) 조회 가능. 실패하면 null — 호출부가 하드코딩된 기본값으로 대체한다. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(SETTINGS_COLUMNS)
    .single();

  if (error || !data) {
    console.error("[getSiteSettings]", error?.message);
    return null;
  }

  return mapRow(data as SiteSettingsRow);
}

export type SiteSettingsActionResult = {
  error: string | null;
  settings?: SiteSettings;
};

export async function updateSiteSettings(
  input: SiteSettings
): Promise<SiteSettingsActionResult> {
  if (!(await requireAdmin())) {
    return { error: "사이트 설정 수정은 관리자만 이용할 수 있습니다." };
  }
  if (!input.seoTitle.trim() || !input.naverMapUrl.trim()) {
    return { error: "사이트 제목과 지도 URL은 비워둘 수 없습니다." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .update({
      seo_title: input.seoTitle.trim(),
      seo_description: input.seoDescription.trim(),
      seo_keywords: input.seoKeywords.trim(),
      og_image_url: input.ogImageUrl?.trim() || null,
      naver_map_url: input.naverMapUrl.trim(),
      naver_map_client_id: input.naverMapClientId?.trim() || null,
      naver_map_lat: input.naverMapLat,
      naver_map_lng: input.naverMapLng,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true)
    .select(SETTINGS_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { error: null, settings: mapRow(data as SiteSettingsRow) };
}

/** 지도 URL만 빠르게 바꿀 때 쓴다 (오시는 길 페이지의 연필 아이콘 수정). */
export async function updateNaverMapUrl(
  naverMapUrl: string
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "지도 위치 수정은 관리자만 이용할 수 있습니다." };
  }
  const trimmed = naverMapUrl.trim();
  if (!trimmed) {
    return { error: "네이버 지도 URL을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ naver_map_url: trimmed, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/location");
  return { error: null };
}
