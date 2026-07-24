import { getAdSenseClient } from "@/components/AdSense";

export const dynamic = "force-static";

export function GET() {
  const client = getAdSenseClient();
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
