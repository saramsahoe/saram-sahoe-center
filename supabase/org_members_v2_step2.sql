-- Supabase SQL Editor에서 실행하세요. (2/2 — 정리 단계)
-- ⚠️ 반드시 org_members_v2_step1.sql 실행 → 데이터 이관 스크립트 완료 확인 후에
-- 실행하세요. 이 파일은 더 이상 쓰지 않는 옛 컬럼을 지우고, category 체크 제약을
-- 새 3분류(director/advisory/office)로 바꾼다.

alter table public.org_members drop column if exists role;
alter table public.org_members drop column if exists affiliation;
alter table public.org_members drop column if exists bio;
alter table public.org_members drop column if exists interests;
alter table public.org_members drop column if exists activity;
alter table public.org_members drop column if exists publications;
alter table public.org_members drop column if exists projects;
alter table public.org_members drop column if exists email;
alter table public.org_members drop column if exists scholar_url;
alter table public.org_members drop column if exists website_url;

alter table public.org_members drop constraint if exists org_members_category_check;
alter table public.org_members
  add constraint org_members_category_check check (category in ('director', 'advisory', 'office'));
