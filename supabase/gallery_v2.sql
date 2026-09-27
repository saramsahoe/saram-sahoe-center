-- Supabase SQL Editor에서 실행하세요.
-- 갤러리를 게시판(posts)에서 완전히 분리한다.

-- posts 체크 제약에서 '갤러리' 값을 제거해 원래 4개 카테고리로 되돌린다.
-- (이전에 갤러리 카테고리로 테스트 삼아 만든 posts 행이 있다면, 관리자 게시글
-- 관리 화면에서 정리하거나 아래에서 직접 지워도 된다: delete from public.posts where category = '갤러리';)
alter table public.posts drop constraint if exists posts_category_check;
alter table public.posts add constraint posts_category_check
  check (category in ('공지사항', '보도자료', '연구소식', '세미나/행사'));

create table if not exists public.gallery_posts (
  id uuid primary key default gen_random_uuid(),
  activity_month text not null,               -- 'YYYY-MM'
  title text not null,
  content text not null default '',
  photos jsonb not null default '[]'::jsonb,  -- [{path, size}], 배열 순서 = 표시 순서
  created_at timestamptz not null default now()
);

alter table public.gallery_posts enable row level security;

drop policy if exists "gallery_posts_select_all" on public.gallery_posts;
create policy "gallery_posts_select_all" on public.gallery_posts
  for select using (true);

drop policy if exists "gallery_posts_admin_all" on public.gallery_posts;
create policy "gallery_posts_admin_all" on public.gallery_posts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-photos', 'gallery-photos', true, 104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "gallery_photos_public_read" on storage.objects;
create policy "gallery_photos_public_read" on storage.objects
  for select using (bucket_id = 'gallery-photos');

drop policy if exists "gallery_photos_admin_insert" on storage.objects;
create policy "gallery_photos_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery-photos' and public.is_admin());

drop policy if exists "gallery_photos_admin_delete" on storage.objects;
create policy "gallery_photos_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery-photos' and public.is_admin());
