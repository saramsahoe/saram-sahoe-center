-- Supabase SQL Editor에서 실행하세요.
-- 게시판에 "갤러리" 카테고리를 추가한다. posts.category 컬럼에는 한글 라벨만
-- 허용하는 체크 제약(기본 이름 규칙상 posts_category_check)이 걸려 있으므로,
-- 그 제약을 갤러리를 포함한 값으로 다시 만든다.
--
-- 만약 아래 constraint 이름이 실제와 달라 에러가 나면, Supabase 대시보드
-- Table Editor > posts > category 컬럼에서 실제 체크 제약 이름을 확인한 뒤
-- 첫 줄의 이름을 그 값으로 바꿔서 실행해 주세요.
alter table public.posts drop constraint if exists posts_category_check;
alter table public.posts
  add constraint posts_category_check
  check (category in ('공지사항', '보도자료', '연구소식', '세미나/행사', '갤러리'));
