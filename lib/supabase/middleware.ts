import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 토큰 자동 갱신을 위해 반드시 호출 — 세션 쿠키를 최신 상태로 유지한다.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 로그인 상태에서 관리자가 계정을 비활성화한 경우, 다음 요청에서 바로 로그아웃시킨다.
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_active')
            .eq('id', user.id)
            .single();

        if (profile && !profile.is_active) {
            await supabase.auth.signOut();
        }
    }

    return supabaseResponse;
}
