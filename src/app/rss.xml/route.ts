import { BLOG_POSTS } from "@/lib/blog/data";
import { SITE } from "@/lib/site";

// output: "export" 에서 라우트 핸들러는 정적으로 못박아야 한다.
export const dynamic = "force-static";

/** XML 본문에 그대로 넣으면 문서가 깨지는 문자들. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 의 pubDate 는 RFC 822 형식을 요구한다. */
function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET() {
  // 최신 글이 위로 오게 정렬한다. 피드를 읽는 쪽이 신규 발견에 쓰기 때문이다.
  const posts = [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  const items = posts
    .map((post) => {
      const url = `${SITE.url}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toRfc822(post.publishedAt)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const lastBuildDate = posts[0]
    ? toRfc822(posts[0].updatedAt)
    : new Date().toUTCString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)} 블로그</title>
    <link>${escapeXml(`${SITE.url}/blog`)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE.url}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
