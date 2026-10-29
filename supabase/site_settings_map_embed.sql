-- Supabase SQL Editor에서 실행하세요.
-- 네이버 지도를 실제 동적(인터랙티브) 지도로 띄우려면 Naver Cloud Platform의
-- Maps JS API Client ID와, 지도를 띄울 좌표(위도/경도)가 필요하다. 둘 다 비어있으면
-- 기존처럼 정적 미리보기 카드로 자동 대체된다.
alter table public.site_settings add column if not exists naver_map_client_id text;
alter table public.site_settings add column if not exists naver_map_lat double precision;
alter table public.site_settings add column if not exists naver_map_lng double precision;
