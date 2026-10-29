-- Supabase SQL Editor에서 실행하세요.
-- 사이트 전역 설정(검색엔진 메타정보, 오시는 길 지도)을 관리자가 한 곳에서
-- 수정할 수 있도록 싱글톤(항상 1행) 테이블로 둔다.
create table if not exists public.site_settings (
  id boolean primary key default true check (id),  -- 싱글톤 패턴: 항상 true 1행만 존재
  seo_title text not null default '연구센터 사람과 사회',
  seo_description text not null default '인간 중심의 기술과 가치를 연구하는 교육 및 연구공동체입니다.',
  seo_keywords text not null default '연구센터,사람과 사회,연구센터사람과사회,사회과학 연구,젠더,휴머니즘,여성 역량개발,리더십,여성과 리더십',
  og_image_url text,
  naver_map_url text not null default 'https://map.naver.com/p/entry/place/1690471513?c=15.00,0,0,0,dh&placePath=%2Fhome%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610292016%26locale%3Dko%26svcName%3Dmap_pcv5',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_all" on public.site_settings;
create policy "site_settings_select_all" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
