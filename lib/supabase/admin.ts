import { createClient } from "@supabase/supabase-js";

/**
 * 서비스 롤 키로 동작하는 관리자 전용 클라이언트. RLS를 완전히 우회하므로
 * 반드시 서버 액션에서, 호출자가 관리자임을 직접 확인한 뒤에만 사용해야 한다.
 * 절대 클라이언트로 노출하거나 NEXT_PUBLIC_ 환경변수로 두면 안 된다.
 */
export function createAdminSupabaseClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY가 설정되지 않았습니다. Supabase 대시보드의 서비스 롤(시크릿) 키를 서버 전용 환경변수로 추가해 주세요."
    );
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
