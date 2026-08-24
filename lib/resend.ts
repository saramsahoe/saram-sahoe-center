import { Resend } from "resend";

let client: Resend | null = null;

function getClient() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

// Resend은 "from" 도메인이 자신의 계정에 인증(DNS 검증)된 경우에만 발신을 허용한다.
// naver.com 같은 공용 메일 도메인은 검증이 불가능하므로, 발신은 Resend 기본
// 샌드박스 주소(onboarding@resend.dev)로 하고 회신 주소(replyTo)를
// saram-sahoe@naver.com으로 지정해 사실상 "그 메일에서 보낸 것처럼" 동작하게 한다.
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const DEFAULT_REPLY_TO =
  process.env.CONTACT_INBOX_EMAIL ?? "saram-sahoe@naver.com";

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ error: string | null }> {
  const { error } = await getClient().emails.send({
    from: `연구센터 사람과 사회 <${DEFAULT_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo ?? DEFAULT_REPLY_TO,
  });

  if (error) {
    console.error("[sendEmail]", error);
    return { error: error.message };
  }

  return { error: null };
}
