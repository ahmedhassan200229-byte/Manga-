export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "مانجا";
  const c1 = url.searchParams.get("c1") || "7c3aed";
  const c2 = url.searchParams.get("c2") || "1e1b4b";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#${c1}"/>
      <stop offset="1" stop-color="#${c2}"/>
    </linearGradient>
    <radialGradient id="r" cx="0.7" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="800" fill="url(#g)"/>
  <rect width="600" height="800" fill="url(#r)"/>
  <circle cx="480" cy="140" r="120" fill="#ffffff" opacity="0.08"/>
  <circle cx="90" cy="660" r="160" fill="#000000" opacity="0.15"/>
  <circle cx="300" cy="330" r="110" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="3"/>
  <circle cx="300" cy="330" r="80" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
  <text x="300" y="350" text-anchor="middle" font-family="sans-serif" font-size="90" font-weight="900" fill="#ffffff" opacity="0.9"> olympus </text>
  <text x="300" y="560" text-anchor="middle" font-family="sans-serif" font-size="52" font-weight="900" fill="#ffffff">${escapeXml(title)}</text>
  <text x="300" y="610" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="700" fill="#ffffff" opacity="0.7">OLYMPUS STAFF</text>
  <rect x="200" y="640" width="200" height="6" rx="3" fill="#fbbf24"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
