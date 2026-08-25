-- Supabase SQL Editor에서 실행하세요. (이미 board_features.sql을 실행했다면 다시 실행해도 안전합니다.)
-- 첨부파일(다운로드 전용) 버킷과 본문 삽입 이미지 버킷, 조회수 증가 함수,
-- 첨부파일 전체 사용량 조회 함수, 게시글 공개/비공개 구분을 추가한다.

-- ── 게시글 공개 범위 ─────────────────────────────────────────────
-- is_public = true  : 비로그인 방문자도 열람 가능 (보도자료 등 외부 공개용)
-- is_public = false : 로그인한 회원만 열람 가능
alter table public.posts
  add column if not exists is_public boolean not null default true;

drop policy if exists "Allow public read for posts" on public.posts;
drop policy if exists "posts_select_all" on public.posts;
drop policy if exists "posts_select_public_or_authenticated" on public.posts;
create policy "posts_select_public_or_authenticated" on public.posts
  for select
  using (is_public = true or auth.role() = 'authenticated');

-- ── 스토리지 버킷 ────────────────────────────────────────────────
-- attachments는 비공개 버킷으로 전환한다. 공개 URL로 누구나 접근 가능했던
-- 이전 방식 대신, 앱이 요청 시점에 서명된(만료되는) URL을 발급해서 내려준다.
-- 어떤 게시글의 첨부파일을 서명해 줄지는 posts RLS(is_public)가 먼저 걸러주므로,
-- 스토리지 정책 자체는 인증 여부로 나누지 않아도 된다.
--
-- post-images(본문 삽입 이미지)는 마크다운 본문 문자열에 URL이 그대로 박혀
-- 저장되기 때문에, 매번 서명 URL로 교체하려면 본문을 파싱/치환하는 추가 작업이
-- 필요하다. 우선순위상 지금은 이 버킷을 공개로 유지한다 — 즉, 비공개 게시글이라도
-- 본문에 삽입된 이미지의 URL 자체를 아는 사람은(무작위 UUID라 추측은 어렵지만)
-- 볼 수 있다. 완전히 막으려면 별도 작업이 필요하니 원하면 알려달라.
update storage.buckets set public = false where id = 'attachments';
update storage.buckets set public = true where id = 'post-images';

-- attachments: 파일 형식은 브라우저/OS마다 리포트하는 MIME이 들쭉날쭉한 한글(HWP) 문서
-- 호환성 때문에 스토리지 레벨에서는 강제하지 않고(앱 코드에서 확장자로 검증),
-- 개별 파일 크기 상한만 스토리지 레벨에서 강제한다.
insert into storage.buckets (id, name, public, file_size_limit)
values ('attachments', 'attachments', false, 10485760)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit;

-- post-images: 이미지 MIME 타입은 표준화되어 있어 스토리지 레벨에서도 안전하게 강제할 수 있다.
-- image/svg+xml은 의도적으로 제외한다 (SVG 저장형 XSS 위험, lib/board-content.ts 주석 참고).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images', 'post-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "attachments_public_read" on storage.objects;
drop policy if exists "attachments_read" on storage.objects;
create policy "attachments_read" on storage.objects
  for select using (bucket_id = 'attachments');

drop policy if exists "attachments_authenticated_insert" on storage.objects;
create policy "attachments_authenticated_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'attachments');

drop policy if exists "attachments_authenticated_delete" on storage.objects;
create policy "attachments_authenticated_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'attachments');

drop policy if exists "post_images_public_read" on storage.objects;
create policy "post_images_public_read" on storage.objects
  for select using (bucket_id = 'post-images');

drop policy if exists "post_images_authenticated_insert" on storage.objects;
create policy "post_images_authenticated_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-images');

drop policy if exists "post_images_authenticated_delete" on storage.objects;
create policy "post_images_authenticated_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'post-images');

-- 버킷 전체 사용량(바이트)을 조회한다. anon/authenticated 키는 storage.objects를
-- 직접 조회할 권한이 없으므로 SECURITY DEFINER 함수로 우회한다. (1GB 전체 용량 제한 체크용)
create or replace function public.get_bucket_usage(p_bucket text)
returns bigint
language sql
security definer
set search_path = public
as $$
  select coalesce(sum((metadata->>'size')::bigint), 0)
  from storage.objects
  where bucket_id = p_bucket;
$$;

grant execute on function public.get_bucket_usage(text) to anon, authenticated;

-- 조회수: 글쓴이 본인이 아닌 경우에만 증가시키고, 갱신된 조회수를 반환한다.
create or replace function public.increment_post_view(p_post_id uuid, p_viewer_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_views integer;
begin
  update public.posts
  set view_count = view_count + 1
  where id = p_post_id
    and (p_viewer_id is null or author_id is distinct from p_viewer_id);

  select view_count into v_views from public.posts where id = p_post_id;
  return v_views;
end;
$$;

grant execute on function public.increment_post_view(uuid, uuid) to anon, authenticated;
