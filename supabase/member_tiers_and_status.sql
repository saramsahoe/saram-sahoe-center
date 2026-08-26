-- Supabase SQL Editor에서 실행하세요.
-- 회원 등급을 일반회원(user)/정회원(member)/관리자(admin) 3단계로 나누고,
-- 회원 비활성화(계정 정지) 플래그를 추가한다.

-- ── 등급 3단계 ───────────────────────────────────────────────────
-- 기존 CHECK 제약(admin/researcher/user)을 admin/member/user로 교체한다.
-- 혹시 남아있는 'researcher' 값은 'member'로 이관한다.
update public.profiles set role = 'member' where role = 'researcher';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'member', 'user'));

-- ── 계정 비활성화 플래그 ─────────────────────────────────────────
alter table public.profiles
  add column if not exists is_active boolean not null default true;

-- 관리자 판별 시 비활성화된 계정은 더 이상 관리자 권한을 갖지 않도록 한다.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

-- 본인 프로필 수정도 활성 계정만 가능하도록 제한한다 (role 변경은 여전히 불가).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() = id and is_active)
  with check (
    auth.uid() = id
    and is_active
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- 게시글 작성/수정/삭제도 활성 계정만 가능하도록 제한한다 (관리자는 is_admin()에서 이미 체크).
drop policy if exists "Allow authenticated insert for posts" on public.posts;
create policy "Allow authenticated insert for posts" on public.posts
  for insert to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_active)
  );

drop policy if exists "Allow author update for posts" on public.posts;
create policy "Allow author update for posts" on public.posts
  for update to authenticated
  using (
    auth.uid() = author_id
    and exists (select 1 from public.profiles where id = auth.uid() and is_active)
  );

drop policy if exists "posts_author_delete" on public.posts;
create policy "posts_author_delete" on public.posts
  for delete to authenticated
  using (
    auth.uid() = author_id
    and exists (select 1 from public.profiles where id = auth.uid() and is_active)
  );

-- ── 첫 관리자 지정 (아직 안 했다면 직접 실행) ────────────────────
-- update public.profiles set role = 'admin' where email = '본인이메일@example.com';
