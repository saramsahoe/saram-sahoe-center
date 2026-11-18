-- Supabase SQL Editor에서 실행하세요.
-- site_settings는 싱글톤이라 테이블 생성 시 딱 한 번 기본값으로 행이 들어가 있다.
-- '연구센터 사람과 사회' → '연구센터사람과사회'로 띄어쓰기를 붙이기로 했는데,
-- 이미 만들어진 행의 값은 schema의 default를 바꿔도 따라 바뀌지 않으므로 직접 고쳐준다.
-- 관리자가 /admin/settings에서 이미 다른 값으로 직접 수정했다면(기본값 그대로가 아니라면)
-- 아래 where 조건에 걸리지 않아 덮어쓰지 않는다.
update public.site_settings
set seo_title = '연구센터사람과사회'
where seo_title = '연구센터 사람과 사회';
