-- Supabase SQL Editor에서 실행하세요.
-- board_gallery_member_only.sql이 걸어둔 "정회원 이상만 조회 가능" 제한을 다시 조정한다.
--
-- 권한 정리 (최종):
--   갤러리(gallery_posts): 전체 공개. 비로그인 포함 누구나 조회 가능. 쓰기는 관리자만(기존 gallery_posts_admin_all 유지).
--   게시판(posts):
--     - 비회원/일반회원(user) : is_public = true 로 체크된 글만 조회 가능
--     - 정회원(member)        : 공개 여부와 무관하게 전체 글 조회 가능
--     - 관리자(admin)         : 전체 글 조회 + 작성/수정/삭제 (기존 posts_admin_all 유지)

-- has_board_access()가 아직 없는 DB에서도 바로 실행할 수 있도록 여기서도 정의한다
-- (board_gallery_member_only.sql과 동일한 정의 — 이미 있다면 그대로 덮어써도 안전).
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

-- ── 갤러리: 전체 공개로 되돌리기 ─────────────────────────────────
drop policy if exists "gallery_posts_select_member_or_admin" on public.gallery_posts;
drop policy if exists "gallery_posts_select_all" on public.gallery_posts;
create policy "gallery_posts_select_all" on public.gallery_posts
  for select using (true);

-- ── 게시판: 공개글은 전체, 비공개글은 정회원 이상만 ───────────────
drop policy if exists "posts_select_member_or_admin" on public.posts;
drop policy if exists "posts_select_public_or_authenticated" on public.posts;
drop policy if exists "posts_select_public_or_member" on public.posts;
create policy "posts_select_public_or_member" on public.posts
  for select
  using (is_public = true or public.has_board_access());
