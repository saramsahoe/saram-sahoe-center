-- Supabase SQL Editor에서 실행하세요.
-- "함께하는 사람들"을 lib/people-content.ts의 하드코딩 배열에서 DB 테이블로 옮긴다.
-- 이름이 "members"인 기존 개념(profiles/회원 등급 관리, getAllMembers())과 헷갈리지
-- 않도록 테이블명은 org_members로 한다.
create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  roles text[] not null default '{}',
  category text not null check (category in ('board','committee','office')),
  interests text[] not null default '{}',
  bio text not null default '',
  affiliation text,
  activity text[] not null default '{}',
  career text[] not null default '{}',
  publications text[] not null default '{}',
  projects text[] not null default '{}',
  email text,
  scholar_url text,
  website_url text,
  links jsonb not null default '[]'::jsonb,   -- [{label, url}]
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.org_members enable row level security;

drop policy if exists "org_members_select_all" on public.org_members;
create policy "org_members_select_all" on public.org_members
  for select using (true);

drop policy if exists "org_members_admin_all" on public.org_members;
create policy "org_members_admin_all" on public.org_members
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 기존 lib/people-content.ts의 16명 데이터를 그대로 이관한다 (sort_order = 기존 배열 순서 * 10).
-- 이미 한 번 실행했다면 아래 insert는 다시 실행하지 말 것 (중복 등록됨).
insert into public.org_members
  (name, role, roles, category, interests, bio, affiliation, activity, career, publications, projects, links, sort_order)
values
  ('이화영', '대표', '{"대표","이사","거버넌스위원회 위원장"}', 'committee', '{}', '숙명여자대학교 기초교양학부 초빙교수이자 거버넌스위원회 위원장으로, 젠더 관점의 리더십과 역량개발을 연구합니다. 연구센터사람과사회의 대표를 맡고 있습니다.', '대표, 거버넌스위원회 위원장', '{"민간 섹터에서 주로 여성, 가족, 청소년 관련 프로그램을 운영하고 현장 실무를 경험","공공 섹터에서 여성, 가족, 청소년 관련 정책을 연구","현재는 학문과 현장 경험을 융합, 청년 리더십 역량 증진 교육에 매진"}', '{"여성가족부 산하 「한국여성인권진흥원」 원장","국무총리실 산하 「여성정책조정회의」 민간위원","법무부 「여성정책위원회」 위원","국회 정책연구위원","인천광역시 「여성가족재단」 이사","서울시 「청소년수련관」 운영위원","충남 「평생교육진흥원」 인권경영위원","숙명여자대학교 기초교양학부 초빙교수(현직)"}', '{}', '{}', '[{"label":"교보문고 저자 소개","url":"https://store.kyobobook.co.kr/person/detail/1000288425"},{"label":"번역서","url":"https://www.yes24.com/product/goods/131187551"}]'::jsonb, 0),
  ('이주연', '이사', '{"이사","소통역량위원회 위원장"}', 'committee', '{}', '개인과 집단, 나아가 사회적 소통 능력을 개발, 훈련하는 프로그램을 연구 및 기획', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 10),
  ('남복희', '이사', '{"이사","미디어위원회 위원장"}', 'committee', '{}', '영상, 음향 등 다양한 매체를 통한 소통 프로그램을 기획, 연구 및 훈련', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 20),
  ('박성혜', '이사', '{"이사","평등나눔위원회 위원장"}', 'committee', '{}', '어린이, 청소년, 성인, 노인 등 사회의 최소 수혜자와 함께하는 리더십을 실천', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 30),
  ('정미경', '', '{"이사","젠더역량위원회 위원장"}', 'committee', '{}', '젠더 감수성 증진과 젠더 불평등을 연구하고 대안 프로그램을 통한 실천', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 40),
  ('(공석)', '이사', '{"이사","커리어지지위원회 위원장"}', 'committee', '{}', '미래사회 새로운 일과 직업에 대한 개념을 이해하고 훈련', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 50),
  ('김혜영', '이사', '{"이사","꿈성장위원회 위원장"}', 'committee', '{}', '아동, 청소년 교육과 성장을 위한 봉사활동과 예술 프로그램을 연구, 실천', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 60),
  ('김지현', '이사', '{"이사","소리감성위원회 위원장"}', 'committee', '{}', '인간의 몸을 통해 관계를 구축하고 나아가 세상과 소통할 수 있는 프로그램 훈련', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 70),
  ('(공석)', '이사', '{"이사","창의감성위원회 위원장"}', 'committee', '{}', '미술을 통한 리더의 자기표현과 소통의 역량을 키울 수 있는 프로그램 기획', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 80),
  ('김영숙', '이사', '{"이사","분배성장위원회 위원장"}', 'committee', '{}', '공정한 사회를 꿈꾸는 구성원에게 평등한 분배 교육, 실천 프로그램을 연구', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 90),
  ('박진영', '사무국', '{}', 'committee', '{}', '연구센터 사람과사회 사무총장', null, '{}', '{}', '{}', '{}', '[]'::jsonb, 100),
  ('김승택', '자문위원', '{}', 'committee', '{}', '', null, '{}', '{"동아일보 샌프란시스코 주재 기자","미국 「라디오서울 방송」 대표","「한국인권문제연구소」 대변인, 서울사무소장","「재외동포연구소」 소장","「한반도선진화연구원」 대표(현직)"}', '{}', '{}', '[]'::jsonb, 110),
  ('김다섭', '자문위원', '{}', 'committee', '{}', '', null, '{}', '{"변호사(현직)","㈜ 위노바 대표","인천지검 국선변호사"}', '{}', '{}', '[]'::jsonb, 120),
  ('추현재', '자문위원', '{}', 'committee', '{}', '', null, '{}', '{"세무사(현직)","「세무법인 한솔」 신도림 지점 대표","수원과학대학 세무학과 겸임교수"}', '{}', '{}', '[]'::jsonb, 130),
  ('김호우', '자문위원', '{}', 'committee', '{}', '', null, '{}', '{"「농업경제방송」 대표","농업법인 「훈훈한이웃」 대표"}', '{}', '{}', '[]'::jsonb, 140),
  ('성윤모', '자문위원', '{}', 'committee', '{}', '', null, '{}', '{"한강  「새빛둥둥섬」 설계","독일 「크레멘트사」 아시아총괄 한국 지사장","반려동물 테마파크 추진 총괄 기획"}', '{}', '{}', '[]'::jsonb, 150);
