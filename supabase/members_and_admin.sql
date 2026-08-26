-- Supabase SQL Editor에서 실행하세요.
-- 마이페이지(내 정보 수정)와 admin/user 등급, 관리자 전용 회원관리·게시글관리를 위한 설정.

-- ── profiles 확장 ────────────────────────────────────────────────
alter table public.profiles
  add column if not exists affiliation text;

-- 신규 가입 시 소속(affiliation)도 함께 저장하도록 트리거를 갱신한다.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, affiliation, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '연구원'),
    new.raw_user_meta_data->>'affiliation',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

-- ── 관리자 판별 함수 ─────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ── profiles RLS ─────────────────────────────────────────────────
-- 기존 "누구나 읽기 가능" 정책은 이메일까지 모두 공개되는 문제가 있어 좁힌다:
-- 본인 정보이거나, 관리자만 다른 사람의 프로필을 볼 수 있다.
drop policy if exists "Allow public read for profiles" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

-- 본인 프로필 수정은 가능하지만, role 컬럼은 이 정책으로는 바꿀 수 없다
-- (새 값이 현재 저장된 role과 같아야 통과되도록 강제).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- 관리자는 등급 변경 등 모든 프로필을 수정할 수 있다 (SQL 콘솔에서 첫 관리자 지정 후 사용).
drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- "아이디 찾기"는 다른 사람의 프로필(email)을 이름으로 조회해야 하는데,
-- 위 정책으로 profiles 테이블 직접 조회가 막혔으므로 이름→이메일만 반환하는
-- 전용 함수로 우회한다 (테이블 전체를 노출하지 않는다).
create or replace function public.find_account_email_by_name(p_name text)
returns table (email text)
language sql
security definer
set search_path = public
as $$
  select p.email from public.profiles p where p.full_name = p_name limit 5;
$$;

grant execute on function public.find_account_email_by_name(text) to anon, authenticated;

-- ── posts: 작성자 삭제 + 관리자 전체 권한 ───────────────────────
drop policy if exists "posts_author_delete" on public.posts;
create policy "posts_author_delete" on public.posts
  for delete to authenticated
  using (auth.uid() = author_id);

drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── 첫 관리자 지정 (직접 실행) ───────────────────────────────────
-- update public.profiles set role = 'admin' where email = '본인이메일@example.com';
