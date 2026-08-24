-- Supabase SQL Editor에서 실행하세요.
-- 이메일 인증번호(회원가입 인증 등)를 저장하는 테이블.
-- anon/authenticated 키에는 이 테이블에 대한 select/insert/update 권한을 전혀 주지 않고,
-- 아래 SECURITY DEFINER 함수를 통해서만 접근하게 해서 인증번호가 클라이언트로 노출되지 않게 한다.

create table if not exists public.email_otps (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  code text not null,
  purpose text not null check (purpose in ('signup_verify', 'find_id')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists email_otps_lookup_idx
  on public.email_otps (email, purpose, consumed_at);

alter table public.email_otps enable row level security;
-- 의도적으로 select/insert/update/delete 정책을 만들지 않는다 (아래 함수로만 접근).

-- 인증번호를 새로 발급한다. 같은 email+purpose로 아직 사용되지 않은 이전 코드는 폐기한다.
create or replace function public.request_email_otp(p_email text, p_purpose text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  delete from public.email_otps
  where email = p_email and purpose = p_purpose and consumed_at is null;

  v_code := lpad((floor(random() * 1000000))::text, 6, '0');

  insert into public.email_otps (email, code, purpose, expires_at)
  values (p_email, v_code, p_purpose, now() + interval '10 minutes');

  return v_code;
end;
$$;

-- 인증번호를 검증하고, 맞으면 소비(consumed) 처리한다.
create or replace function public.verify_email_otp(p_email text, p_purpose text, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rows int;
begin
  update public.email_otps
  set consumed_at = now()
  where email = p_email
    and purpose = p_purpose
    and code = p_code
    and consumed_at is null
    and expires_at > now();

  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- 최근에 인증을 완료했는지 다시 확인한다 (회원가입 서버 액션에서 이중 검증용).
create or replace function public.has_verified_email(p_email text, p_purpose text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.email_otps
    where email = p_email
      and purpose = p_purpose
      and consumed_at is not null
      and consumed_at > now() - interval '30 minutes'
  );
$$;

grant execute on function public.request_email_otp(text, text) to anon, authenticated;
grant execute on function public.verify_email_otp(text, text, text) to anon, authenticated;
grant execute on function public.has_verified_email(text, text) to anon, authenticated;
