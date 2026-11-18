// 실제 Supabase 프로젝트 플랜에 맞춰 바꿔주세요 — 여긴 Free 플랜 기본 한도입니다.
// (Pro 플랜은 데이터베이스 8GB, 스토리지 100GB로 늘어납니다.)
export const SUPABASE_PLAN_LIMITS = {
  databaseBytes: 500 * 1024 * 1024, // 500MB
  storageBytes: 1024 * 1024 * 1024, // 1GB
} as const;
