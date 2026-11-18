"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/actions/admin";
import { geocodeNaverMapUrl } from "@/lib/naver-geocode";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SiteSettings = {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string | null;
  ogImagePath: string | null;
  naverMapUrl: string;
  /** Naver Cloud Platform Maps JS API Client ID. 비어있으면 정적 미리보기로 대체된다. */
  naverMapClientId: string | null;
  naverMapLat: number | null;
  naverMapLng: number | null;
  termsContent: string;
  privacyContent: string;
};

type SiteSettingsRow = {
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string | null;
  og_image_path: string | null;
  naver_map_url: string;
  naver_map_client_id: string | null;
  naver_map_lat: number | null;
  naver_map_lng: number | null;
  terms_content: string;
  privacy_content: string;
};

const SETTINGS_COLUMNS =
  "seo_title, seo_description, seo_keywords, og_image_url, og_image_path, naver_map_url, naver_map_client_id, naver_map_lat, naver_map_lng, terms_content, privacy_content";

function mapRow(row: SiteSettingsRow): SiteSettings {
  return {
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    ogImageUrl: row.og_image_url,
    ogImagePath: row.og_image_path,
    naverMapUrl: row.naver_map_url,
    naverMapClientId: row.naver_map_client_id,
    naverMapLat: row.naver_map_lat,
    naverMapLng: row.naver_map_lng,
    termsContent: row.terms_content,
    privacyContent: row.privacy_content,
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
  /** 저장은 됐지만 일부가 기대대로 안 됐을 때(지도 좌표 자동 조회 실패 등) 알려준다. */
  warning?: string | null;
  settings?: SiteSettings;
};

/** 폼에서 받는 입력 — 위도/경도는 naverMapUrl로부터 서버가 자동으로 계산하므로 받지 않는다. */
export type SiteSettingsInput = {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string | null;
  ogImagePath: string | null;
  naverMapUrl: string;
  naverMapClientId: string | null;
};

export async function updateSiteSettings(
  input: SiteSettingsInput
): Promise<SiteSettingsActionResult> {
  if (!(await requireAdmin())) {
    return { error: "사이트 설정 수정은 관리자만 이용할 수 있습니다." };
  }
  if (!input.seoTitle.trim() || !input.naverMapUrl.trim()) {
    return { error: "사이트 제목과 지도 URL은 비워둘 수 없습니다." };
  }

  const supabase = await createServerSupabaseClient();

  const { data: current } = await supabase
    .from("site_settings")
    .select("naver_map_url, naver_map_lat, naver_map_lng, og_image_path")
    .eq("id", true)
    .single();

  const naverMapUrl = input.naverMapUrl.trim();
  let naverMapLat = current?.naver_map_lat ?? null;
  let naverMapLng = current?.naver_map_lng ?? null;
  let warning: string | null = null;

  // 지도 URL이 바뀐 경우에만 다시 계산한다 — 안 바뀌었으면 매번 조회할 필요가 없다.
  if (naverMapUrl !== current?.naver_map_url) {
    const coords = await geocodeNaverMapUrl(naverMapUrl);
    if (coords) {
      naverMapLat = coords.lat;
      naverMapLng = coords.lng;
    } else {
      naverMapLat = null;
      naverMapLng = null;
      warning =
        "지도 좌표를 자동으로 가져오지 못했습니다. 네이버 지도에서 '공유 > 링크 복사'로 받은 장소(플레이스) 링크인지 확인해 주세요. 동적 지도 대신 정적 미리보기로 표시됩니다.";
    }
  }

  // 공유 미리보기 이미지가 교체/삭제됐으면 스토리지에서 이전 파일을 정리한다.
  if (current?.og_image_path && current.og_image_path !== input.ogImagePath) {
    await supabase.storage.from("site-images").remove([current.og_image_path]);
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update({
      seo_title: input.seoTitle.trim(),
      seo_description: input.seoDescription.trim(),
      seo_keywords: input.seoKeywords.trim(),
      og_image_url: input.ogImageUrl?.trim() || null,
      og_image_path: input.ogImagePath || null,
      naver_map_url: naverMapUrl,
      naver_map_client_id: input.naverMapClientId?.trim() || null,
      naver_map_lat: naverMapLat,
      naver_map_lng: naverMapLng,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true)
    .select(SETTINGS_COLUMNS)
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/location");
  return { error: null, warning, settings: mapRow(data as SiteSettingsRow) };
}

/** 지도 URL만 빠르게 바꿀 때 쓴다 (오시는 길 페이지의 연필 아이콘 수정). */
export async function updateNaverMapUrl(
  naverMapUrl: string
): Promise<{ error: string | null; warning?: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "지도 위치 수정은 관리자만 이용할 수 있습니다." };
  }
  const trimmed = naverMapUrl.trim();
  if (!trimmed) {
    return { error: "네이버 지도 URL을 입력해 주세요." };
  }

  const coords = await geocodeNaverMapUrl(trimmed);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      naver_map_url: trimmed,
      naver_map_lat: coords?.lat ?? null,
      naver_map_lng: coords?.lng ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/location");
  return {
    error: null,
    warning: coords
      ? null
      : "지도 좌표를 자동으로 가져오지 못해 정적 미리보기로 표시됩니다.",
  };
}

/** 이용약관 본문 수정 (마크다운). app/admin/settings에서 더블클릭으로 진입. */
export async function updateTermsContent(
  content: string
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "약관 수정은 관리자만 이용할 수 있습니다." };
  }
  const trimmed = content.trim();
  if (!trimmed) {
    return { error: "내용을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ terms_content: trimmed, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/terms");
  return { error: null };
}

/** 개인정보처리방침 본문 수정 (마크다운). app/admin/settings에서 더블클릭으로 진입. */
export async function updatePrivacyContent(
  content: string
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) {
    return { error: "개인정보처리방침 수정은 관리자만 이용할 수 있습니다." };
  }
  const trimmed = content.trim();
  if (!trimmed) {
    return { error: "내용을 입력해 주세요." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ privacy_content: trimmed, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/privacy");
  return { error: null };
}
