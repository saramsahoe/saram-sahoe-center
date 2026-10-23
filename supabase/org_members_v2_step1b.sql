-- Supabase SQL Editor에서 실행하세요. (1.5 — 데이터 이관 중간 단계)
-- category 체크 제약을 잠깐 느슨하게 풀어서, 이관 스크립트가 기존 값(board/committee)과
-- 새 값(director/advisory)을 모두 쓸 수 있게 한다. 이관이 끝나면 org_members_v2_step2.sql이
-- 최종 3개 값(director/advisory/office)으로 다시 좁힌다.
alter table public.org_members drop constraint if exists org_members_category_check;
alter table public.org_members
  add constraint org_members_category_check
  check (category in ('board', 'committee', 'office', 'director', 'advisory'));
