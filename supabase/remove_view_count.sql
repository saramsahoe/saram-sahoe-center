-- Supabase SQL Editor에서 실행하세요.
-- 게시글 조회수 기능을 완전히 제거한다. (board_features.sql에서 만든
-- increment_post_view 함수와, posts 테이블의 view_count 컬럼을 삭제한다.)
drop function if exists public.increment_post_view(uuid, uuid);
alter table public.posts drop column if exists view_count;
