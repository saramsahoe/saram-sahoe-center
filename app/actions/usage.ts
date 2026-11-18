"use server";

import { requireAdmin } from "@/app/actions/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const BUCKETS = [
  { id: "attachments", label: "첨부파일 (게시판)" },
  { id: "post-images", label: "본문 삽입 이미지 (게시판)" },
  { id: "gallery-photos", label: "갤러리 사진" },
  { id: "history-photos", label: "연혁 사진" },
  { id: "news-photos", label: "소식 사진" },
  { id: "site-images", label: "사이트 설정 이미지" },
] as const;

export type BucketUsage = { id: string; label: string; bytes: number };
export type UsageSnapshot = {
  databaseBytes: number;
  buckets: BucketUsage[];
  storageTotalBytes: number;
};

/** 관리자 "사용량" 대시보드용 — DB 전체 용량 + 버킷별 스토리지 용량을 한 번에 조회한다. */
export async function getUsageSnapshot(): Promise<UsageSnapshot | null> {
  if (!(await requireAdmin())) return null;

  const supabase = await createServerSupabaseClient();

  const [dbResult, ...bucketResults] = await Promise.all([
    supabase.rpc("get_database_size"),
    ...BUCKETS.map((bucket) => supabase.rpc("get_bucket_usage", { p_bucket: bucket.id })),
  ]);

  if (dbResult.error) {
    console.error("[getUsageSnapshot] get_database_size", dbResult.error.message);
  }

  const buckets: BucketUsage[] = BUCKETS.map((bucket, index) => {
    const result = bucketResults[index];
    if (result.error) {
      console.error(`[getUsageSnapshot] get_bucket_usage(${bucket.id})`, result.error.message);
    }
    return { id: bucket.id, label: bucket.label, bytes: Number(result.data) || 0 };
  });

  const storageTotalBytes = buckets.reduce((sum, bucket) => sum + bucket.bytes, 0);

  return {
    databaseBytes: Number(dbResult.data) || 0,
    buckets,
    storageTotalBytes,
  };
}
