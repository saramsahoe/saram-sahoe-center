-- Supabase SQL Editor에서 실행하세요.
-- 관리자 "사용량" 대시보드(DB 용량 + 스토리지 버킷별 용량)에서 쓰는 함수.
-- 버킷 용량 조회 함수(get_bucket_usage)는 board_features.sql에서 이미 만들어뒀고,
-- 여기서는 데이터베이스 전체 용량 조회 함수만 추가한다.

create or replace function public.get_database_size()
returns bigint
language sql
security definer
set search_path = public
as $$
  select pg_database_size(current_database());
$$;

grant execute on function public.get_database_size() to authenticated;
