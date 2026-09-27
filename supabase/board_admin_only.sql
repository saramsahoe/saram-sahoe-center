-- Supabase SQL Editor에서 실행하세요.
-- 게시글 열람은 계속 공개(비로그인 포함)로 두고, 작성/수정/삭제만 관리자 전용으로 좁힌다.
-- posts_admin_all(for all using is_admin())이 이미 있어 관리자 쓰기는 그대로 커버되므로,
-- "본인 글만" 허용하던 기존 정책만 제거하면 된다.
drop policy if exists "Allow authenticated insert for posts" on public.posts;
drop policy if exists "Allow author update for posts" on public.posts;
drop policy if exists "posts_author_delete" on public.posts;

-- 첨부파일 / 본문 삽입 이미지 업로드도 관리자만 가능하도록 좁힌다.
drop policy if exists "attachments_authenticated_insert" on storage.objects;
create policy "attachments_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'attachments' and public.is_admin());

drop policy if exists "attachments_authenticated_delete" on storage.objects;
create policy "attachments_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'attachments' and public.is_admin());

drop policy if exists "post_images_authenticated_insert" on storage.objects;
create policy "post_images_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-images' and public.is_admin());

drop policy if exists "post_images_authenticated_delete" on storage.objects;
create policy "post_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'post-images' and public.is_admin());
