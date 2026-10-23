-- Supabase SQL Editor에서 실행하세요.
-- 게시판/갤러리 열람을 "정회원 이상"으로 다시 좁힌다. (쓰기는 이미 관리자 전용 —
-- board_admin_only.sql, gallery_v2.sql 참고. 이 파일은 "조회" 권한만 다룬다.)
--
-- 권한 정리:
--   관리자(admin)   : 조회/작성/수정/삭제 전부 가능 (posts_admin_all / gallery_posts_admin_all)
--   정회원(member)  : 조회만 가능
--   일반회원(user) 및 비로그인 : 조회 불가 (페이지 자체가 로그인/승급 안내로 막힘 — app/board/page.tsx, app/gallery/page.tsx)

create or replace function public.has_board_access()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and is_active
      and role in ('member', 'admin')
  );
$$;

grant execute on function public.has_board_access() to anon, authenticated;

drop policy if exists "posts_select_all" on public.posts;
drop policy if exists "posts_select_public_or_authenticated" on public.posts;
drop policy if exists "posts_select_member_or_admin" on public.posts;
create policy "posts_select_member_or_admin" on public.posts
  for select using (public.has_board_access());

drop policy if exists "gallery_posts_select_all" on public.gallery_posts;
drop policy if exists "gallery_posts_select_member_or_admin" on public.gallery_posts;
create policy "gallery_posts_select_member_or_admin" on public.gallery_posts
  for select using (public.has_board_access());
