-- Supabase SQL Editor에서 실행하세요.
-- "연혁"을 lib/about-content.ts의 하드코딩 배열에서 DB 테이블로 옮긴다.
-- year는 각 행이 직접 갖는 평평한(flat) 구조로 단순화하고, 화면에서 연속된 동일
-- year 값을 그룹으로 묶어 지금과 같은 타임라인 UI를 재현한다. 기존의 장식용
-- icon(LucideIcon 컴포넌트)은 DB에 저장할 수 없어 photo_path로 대체한다.
create table if not exists public.history_entries (
  id uuid primary key default gen_random_uuid(),
  year text not null,               -- '2014' 또는 '2023~2025'처럼 자유 텍스트
  title text not null,
  description text not null default '',
  photo_path text,                  -- nullable, history-photos 버킷 경로
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.history_entries enable row level security;

drop policy if exists "history_entries_select_all" on public.history_entries;
create policy "history_entries_select_all" on public.history_entries
  for select using (true);

drop policy if exists "history_entries_admin_all" on public.history_entries;
create policy "history_entries_admin_all" on public.history_entries
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'history-photos', 'history-photos', true, 104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "history_photos_public_read" on storage.objects;
create policy "history_photos_public_read" on storage.objects
  for select using (bucket_id = 'history-photos');

drop policy if exists "history_photos_admin_insert" on storage.objects;
create policy "history_photos_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'history-photos' and public.is_admin());

drop policy if exists "history_photos_admin_delete" on storage.objects;
create policy "history_photos_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'history-photos' and public.is_admin());

-- 기존 lib/about-content.ts의 historyTimeline을 펼쳐서 이관한다 (장식용 icon 필드는 버림).
-- 이미 한 번 실행했다면 아래 insert는 다시 실행하지 말 것 (중복 등록됨).
insert into public.history_entries (year, title, description, sort_order)
values
  ('2014', '연구센터사람과사회 설립 (임의 단체)', '2013년 1월, 임의 단체로 연구센터사람과사회 설립', 0),
  ('2014', '서울시 비영리단체 등록 및 인가 취득', '2014년 8월 28일, 서울시 비영리단체 정식 등록 및 인가 취득', 10),
  ('2015', '여성 글로벌역량강화 해외봉사 시스템 구축', '2월, 음악교육 봉사를 통한 여성 글로벌역량강화 해외봉사 시스템 구축', 20),
  ('2015', '서울시 여성발전기금 사업 수행', '4월~10월, 여성폭력방지기관 종사자 소진방지 및 역량강화 프로그램 운영', 30),
  ('2015', '리더 자아성찰 프로그램 구축 및 훈련', '11월, 센터의 대표 프로그램인 리더 자아성찰 프로그램 구축 및 훈련 시작', 40),
  ('2016', '강북구청소년상담복지센터 업무협약 체결', '3월, 꿈나래또요스쿨 재능기부협약 체결 및 학교밖 청소년 지원프로그램 구축', 50),
  ('2016', '자문위원단(협력이사) 제도 설치', '12월, 자문위원단(협력이사) 제도 신설', 60),
  ('2017', '리더 자아성찰 특강', '2월 진행', 70),
  ('2017', '진로탐색 특강', '3월, 강북구청소년상담복지센터와 컨소시엄 진행', 80),
  ('2017', '리더 자아성찰 훈련 — 호흡과 몸의 관찰', '11월 진행', 90),
  ('2018', '리더 자아성찰 훈련 — 내시(內視)와 내조(內照)', '5월 진행', 100),
  ('2018', '워라밸을 위한 전문가와 함께 하는 토크 콘서트', '11월, 리파인컨설팅그룹과 컨소시엄 진행', 110),
  ('2018', '생애설계과정 교육프로그램 구축', '12월 구축', 120),
  ('2019', '일하는 여성 소진방지 프로그램 구축', '3월 구축', 130),
  ('2019', '생애설계 코치 양성교육', '9월, 커리어벨류연구소와 컨소시엄 진행', 140),
  ('2019', '오르프 전문강사 역량강화 프로그램', '10월, 이든소리연구소와 컨소시엄 진행', 150),
  ('2020', '서초구 여성가족플라자 위탁 운영', '2020년~2024년, 서초구 여성가족플라자 위탁 운영', 160),
  ('2020', '서울시 성평등기금 공모사업 (1년차)', '3월~10월, 여성1인 전문강사 역량강화 "서로 함께 의기 양양" (여성 1인 가업가 소진방지)', 170),
  ('2021', '서울시 성평등기금 공모사업 (2년차)', '3월~10월, 여성1인 전문강사 역량강화 "다시 함께 의기 양양" (COVID19의 치유와 회복)', 180),
  ('2022', '서울시 성평등기금 공모사업 (3년차)', '3월~10월, 여성1인 전문강사 역량강화 "모두 함께 의기 양양" (포스트 팬데믹, 새로운 출발)', 190),
  ('2023~2025', '리더 자아성찰 훈련 (2023.12)', '2023년 12월 진행', 200),
  ('2023~2025', '리더 자아성찰 훈련 (2024.11)', '2024년 11월 진행', 210),
  ('2023~2025', '리더 자아성찰 훈련 (2025.12)', '2025년 12월 진행', 220);
