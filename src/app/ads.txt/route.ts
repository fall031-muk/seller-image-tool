// AdSense 활성화 시 필수 파일.
// NEXT_PUBLIC_ADSENSE_CLIENT 환경변수 예: ca-pub-1234567890123456
// 이 파일이 응답하는 형식:
//   google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0

export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return new Response("# AdSense not configured yet\n", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const pubId = client.replace(/^ca-/, "");
  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
