-- Supabase SQL Editor에서 실행하세요.
-- 메인 화면 "소식" 캐러셀을 관리자가 직접 추가/수정/삭제할 수 있도록 DB로 옮긴다.
create table if not exists public.news_slides (
  id uuid primary key default gen_random_uuid(),
  category text not null,          -- 예: SEMINAR, FIELDWORK, FORUM (자유 입력, 기존 값 재사용 가능)
  title text not null,
  summary text not null default '',
  date_label text not null default '',  -- 예: '2020 ~ 2022'
  photo_path text,                 -- news-photos 버킷 경로
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.news_slides enable row level security;

drop policy if exists "news_slides_select_all" on public.news_slides;
create policy "news_slides_select_all" on public.news_slides
  for select using (true);

drop policy if exists "news_slides_admin_all" on public.news_slides;
create policy "news_slides_admin_all" on public.news_slides
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-photos', 'news-photos', true, 104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "news_photos_public_read" on storage.objects;
create policy "news_photos_public_read" on storage.objects
  for select using (bucket_id = 'news-photos');

drop policy if exists "news_photos_admin_insert" on storage.objects;
create policy "news_photos_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'news-photos' and public.is_admin());

drop policy if exists "news_photos_admin_delete" on storage.objects;
create policy "news_photos_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'news-photos' and public.is_admin());
