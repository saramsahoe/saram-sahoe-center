-- Supabase SQL Editor에서 실행하세요.
-- 1) 공유 미리보기 이미지를 실제로 업로드할 수 있게 og_image_path(스토리지 경로) 추가.
-- 2) 이용약관/개인정보처리방침을 관리자가 직접 수정할 수 있게 DB 컬럼으로 옮긴다
--    (lib/legal-content.ts의 기존 내용을 그대로 기본값으로 넣어서, 실행해도 화면이 바뀌지 않는다).
--    마크다운 문법(## 제목, - 목록)을 그대로 쓴다 — 게시판 글 본문과 같은 렌더러(PostMarkdown)를 재사용한다.

alter table public.site_settings
  add column if not exists og_image_path text,
  add column if not exists terms_content text,
  add column if not exists privacy_content text;

update public.site_settings set terms_content = $terms$## 제1조 (목적)

이 약관은 연구센터사람과사회(이하 '센터')가 운영하는 웹사이트(이하 '서비스')의 이용과 관련하여 센터와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

## 제2조 (정의)

'이용자'란 이 약관에 따라 센터가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.

'회원'이란 서비스에 개인정보를 제공하여 회원가입을 한 자로서, 서비스를 지속적으로 이용할 수 있는 자를 말합니다.

'게시물'이란 회원이 서비스를 이용하면서 게시판에 게시한 문자, 이미지, 첨부파일 등의 정보를 말합니다.

## 제3조 (약관의 효력 및 변경)

이 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.

센터는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 사전 공지합니다.

## 제4조 (회원가입 및 계정)

이용자는 센터가 정한 절차에 따라 이메일 인증을 거쳐 회원가입을 신청하며, 센터는 이를 승낙함으로써 회원가입이 성립됩니다.

회원은 가입 시 등록한 이메일을 로그인 아이디로 사용하며, 계정 정보의 관리 책임은 회원 본인에게 있습니다.

회원은 언제든지 탈퇴를 요청할 수 있으며, 센터는 관련 법령이 정하는 바에 따라 이를 지체 없이 처리합니다.

## 제5조 (게시물의 관리)

회원이 작성한 게시물의 저작권은 해당 회원에게 귀속되며, 센터는 서비스 운영, 전시, 전송을 위한 범위 내에서 게시물을 사용할 수 있습니다.

회원은 자신이 작성한 게시물을 수정할 수 있으며, 타인의 권리를 침해하거나 관련 법령에 위반되는 게시물은 사전 통지 없이 삭제될 수 있습니다.

게시물에 첨부하는 파일의 용량 및 형식은 센터가 정한 기준을 따라야 합니다.

## 제6조 (이용자의 의무)

이용자는 관계 법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 사항을 준수해야 하며, 기타 센터의 업무에 방해되는 행위를 하여서는 안 됩니다.

이용자는 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.

## 제7조 (책임의 제한)

센터는 천재지변, 서비스 설비의 보수·점검·교체 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.

센터는 이용자가 게시한 정보, 자료의 신뢰도, 정확성에 대해 책임을 지지 않습니다.

## 제8조 (문의처)

서비스 이용과 관련한 문의는 하단의 연락처 또는 문의하기 게시판을 통해 접수할 수 있습니다.
$terms$
where terms_content is null;

update public.site_settings set privacy_content = $privacy$## 1. 수집하는 개인정보 항목

- 회원가입: 이름, 이메일 주소, 비밀번호(암호화 저장), 소속 기관/직책
- 게시판 이용: 작성자 이메일, 작성한 게시물 및 첨부파일
- 문의하기: 이름, 이메일 주소, 소속(선택), 문의 내용
- 서비스 이용 과정에서 접속 로그, 쿠키, 접속 IP 정보가 자동으로 생성되어 수집될 수 있습니다.

## 2. 개인정보의 수집 및 이용 목적

- 회원 가입의사 확인, 본인 인증 및 회원제 서비스 제공을 위한 목적으로 이용합니다.
- 게시판 등 서비스 이용에 따른 콘텐츠 제공, 문의 응대 및 민원 처리를 위해 이용합니다.
- 서비스 부정이용 방지 및 통계학적 분석을 위해 이용합니다.

## 3. 개인정보의 보유 및 이용 기간

- 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
- 회원 탈퇴 시 즉시 파기하되, 관계 법령의 규정에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
- 문의 내역은 처리 완료 후 3년간 보관 후 파기합니다.

## 4. 개인정보의 제3자 제공

- 센터는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 이용자가 사전에 동의하거나 법령의 규정에 의한 경우에 한하여 제공합니다.

## 5. 개인정보 처리 위탁

- 센터는 서비스 운영을 위하여 데이터베이스 및 인증 인프라(Supabase), 이메일 발송(Resend) 등 외부 서비스에 개인정보 처리 업무의 일부를 위탁하고 있으며, 위탁받은 업체가 개인정보를 안전하게 처리하도록 관리·감독합니다.

## 6. 이용자의 권리와 행사 방법

- 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 이용을 중지하고 개인정보 삭제를 요청할 수 있습니다.
- 개인정보 열람, 정정, 삭제, 처리정지 요구는 문의하기 게시판 또는 이메일을 통해 요청할 수 있으며, 센터는 관련 법령에 따라 지체 없이 조치합니다.

## 7. 개인정보의 안전성 확보 조치

- 비밀번호는 암호화되어 저장·관리되며, 개인정보에 대한 접근 권한을 최소화하고 있습니다.
- 회원 데이터베이스는 행 단위 보안 정책(Row Level Security)을 적용하여 본인 또는 권한이 있는 경우에만 접근·수정이 가능하도록 관리합니다.

## 8. 개인정보 보호책임자 및 문의처

- 센터는 개인정보 처리에 관한 문의, 불만 처리 등을 위해 아래의 연락처를 통해 개인정보 보호책임자를 지정하여 운영하고 있습니다.
$privacy$
where privacy_content is null;

alter table public.site_settings
  alter column terms_content set not null,
  alter column privacy_content set not null;

-- ── 공유 미리보기 이미지 업로드용 스토리지 버킷 ───────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images', 'site-images', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site_images_public_read" on storage.objects;
create policy "site_images_public_read" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "site_images_admin_insert" on storage.objects;
create policy "site_images_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site_images_admin_delete" on storage.objects;
create policy "site_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());
