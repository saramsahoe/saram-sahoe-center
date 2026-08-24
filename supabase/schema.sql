-- Supabase SQL Editor에서 실행하세요.
-- posts / inquiries / profiles 테이블은 프로젝트에 이미 존재하는 것을 확인했습니다.
-- (posts: id, category, title, content, author_id, author_name, view_count,
--         is_pinned, created_at, updated_at
--  inquiries: id, name, email, affiliation, message, status, created_at
--  profiles: id, email, full_name, role, created_at)
-- 아래는 RLS가 아직 켜져 있지 않은 경우를 대비한 멱등(idempotent) 설정입니다.
-- 이미 동일한 정책이 있다면 drop 후 재생성되므로 여러 번 실행해도 안전합니다.

alter table public.posts enable row level security;

drop policy if exists "posts_select_all" on public.posts;
create policy "posts_select_all" on public.posts
  for select using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own" on public.posts
  for insert with check (auth.uid() = author_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own" on public.posts
  for update using (auth.uid() = author_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own" on public.posts
  for delete using (auth.uid() = author_id);

alter table public.inquiries enable row level security;

-- 로그인하지 않은 방문자도 문의를 남길 수 있어야 하므로 insert는 누구에게나 허용.
-- select 정책은 만들지 않았으므로 anon/authenticated 키로는 조회할 수 없고,
-- Supabase 대시보드(service role)에서만 확인 가능하다.
drop policy if exists "inquiries_insert_anyone" on public.inquiries;
create policy "inquiries_insert_anyone" on public.inquiries
  for insert with check (true);
