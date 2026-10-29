-- Supabase SQL Editor에서 실행하세요.
-- 비밀번호 재설정을 "이메일 링크 클릭" 방식에서 "인증번호 입력" 방식으로 바꾼다.
-- 이미 있는 email_otps 테이블/함수(request_email_otp, verify_email_otp,
-- has_verified_email)를 그대로 재사용하고, purpose에 'password_reset'만 추가한다.
alter table public.email_otps drop constraint if exists email_otps_purpose_check;
alter table public.email_otps
  add constraint email_otps_purpose_check
  check (purpose in ('signup_verify', 'find_id', 'password_reset'));
