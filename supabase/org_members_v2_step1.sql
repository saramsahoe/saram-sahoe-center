-- Supabase SQL Editor에서 실행하세요. (1/2 — 추가 단계)
-- "함께하는 사람들" 구조 개편: 이사/위원장(director) · 위원회(committee, 사람 아님) ·
-- 자문위원(advisory) · 사무국(office) 4축으로 바꾼다. 이 파일은 새 테이블/컬럼만
-- "추가"하고 기존 컬럼은 아직 지우지 않는다 — 이관 스크립트가 기존 데이터를 읽어서
-- 새 구조로 옮긴 다음에 org_members_v2_step2.sql로 옛 컬럼을 정리한다.

-- ── 위원회 (사람이 아닌 조직 단위) ──────────────────────────────────
create table if not exists public.org_committees (
  id uuid primary key default gen_random_uuid(),
  name text not null,              -- 예: '거버넌스' ('위원회' 접미사 없이 저장)
  description text not null default '',  -- 수행 역할
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.org_committees enable row level security;

drop policy if exists "org_committees_select_all" on public.org_committees;
create policy "org_committees_select_all" on public.org_committees
  for select using (true);

drop policy if exists "org_committees_admin_all" on public.org_committees;
create policy "org_committees_admin_all" on public.org_committees
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.org_committees (name, description, sort_order) values
  ('거버넌스', '젠더 관점의 리더십과 역량개발을 연구합니다', 0),
  ('소통역량', '개인과 집단, 나아가 사회적 소통 능력을 개발, 훈련하는 프로그램을 연구 및 기획', 10),
  ('미디어', '영상, 음향 등 다양한 매체를 통한 소통 프로그램을 기획, 연구 및 훈련', 20),
  ('평등나눔', '어린이, 청소년, 성인, 노인 등 사회의 최소 수혜자와 함께하는 리더십을 실천', 30),
  ('젠더역량', '젠더 감수성 증진과 젠더 불평등을 연구하고 대안 프로그램을 통한 실천', 40),
  ('커리어지지', '미래사회 새로운 일과 직업에 대한 개념을 이해하고 훈련', 50),
  ('꿈성장', '아동, 청소년 교육과 성장을 위한 봉사활동과 예술 프로그램을 연구, 실천', 60),
  ('소리감성', '인간의 몸을 통해 관계를 구축하고 나아가 세상과 소통할 수 있는 프로그램 훈련', 70),
  ('창의감성', '미술을 통한 리더의 자기표현과 소통의 역량을 키울 수 있는 프로그램 기획', 80),
  ('분배성장', '공정한 사회를 꿈꾸는 구성원에게 평등한 분배 교육, 실천 프로그램을 연구', 90)
on conflict do nothing;

-- ── 직함(뱃지) 선택지 ────────────────────────────────────────────
create table if not exists public.org_title_options (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  is_default boolean not null default false,  -- 기본 선택지는 삭제 불가 (앱 코드에서 막음)
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.org_title_options enable row level security;

drop policy if exists "org_title_options_select_all" on public.org_title_options;
create policy "org_title_options_select_all" on public.org_title_options
  for select using (true);

drop policy if exists "org_title_options_admin_all" on public.org_title_options;
create policy "org_title_options_admin_all" on public.org_title_options
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.org_title_options (label, is_default, sort_order) values
  ('대표', true, 0),
  ('이사', true, 10),
  ('위원장', true, 20),
  ('사무총장', true, 30),
  ('자문위원', true, 40)
on conflict (label) do nothing;

-- ── org_members: 위원장이 맡은 위원회를 가리키는 컬럼 추가 ───────────
alter table public.org_members
  add column if not exists chaired_committee_id uuid references public.org_committees(id) on delete set null;
