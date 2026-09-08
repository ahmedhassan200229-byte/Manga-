export const dynamic = "force-dynamic";

const PALETTES = [
  ["#1a1033", "#2d1b69", "#7c3aed"],
  ["#0f172a", "#1e3a5f", "#0ea5e9"],
  ["#1c0a0a", "#5f1e1e", "#ef4444"],
  ["#071a12", "#14532d", "#22c55e"],
  ["#1a1005", "#713f12", "#f59e0b"],
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const chapter = url.searchParams.get("chapter") || "1";
  const title = url.searchParams.get("title") || "الفصل";
  const seed = page * 7919 + chapter.length * 131;
  const palette = PALETTES[seed % PALETTES.length];
  const [bg, mid, accent] = palette;

  // Deterministic pseudo-random panels
  const panels: string[] = [];
  const panelCount = 2 + (seed % 3);
  let y = 90;
  for (let k = 0; k < panelCount; k++) {
    const h = 200 + ((seed * (k + 3)) % 160);
    const isWide = (seed + k) % 3 === 0;
    if (isWide || k === panelCount - 1) {
      panels.push(panel(40, y, 720, h, accent, k, seed));
      y += h + 24;
    } else {
      const w = 348;
      panels.push(panel(40, y, w, h, accent, k, seed));
      panels.push(panel(412, y, w, h, mid, k + 7, seed + 5));
      y += h + 24;
    }
    if (y > 1050) break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">
  <rect width="800" height="1200" fill="#0d0d14"/>
  <rect width="800" height="1200" fill="${bg}" opacity="0.55"/>
  <rect x="0" y="0" width="800" height="70" fill="#000000" opacity="0.6"/>
  <text x="400" y="45" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="800" fill="#ffffff" opacity="0.9">${escapeXml(title)} — فصل ${escapeXml(chapter)}</text>
  ${panels.join("\n")}
  <text x="400" y="1160" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="700" fill="#ffffff" opacity="0.5">صفحة ${page} — أولمبس ستاف للترجمة</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function panel(x: number, y: number, w: number, h: number, accent: string, k: number, seed: number): string {
  const cx = x + ((seed * (k + 11)) % Math.max(60, w - 120)) + 60;
  const cy = y + ((seed * (k + 17)) % Math.max(40, h - 100)) + 50;
  const bubbleX = x + 24 + ((seed * (k + 5)) % Math.max(20, w - 200));
  const showBubble = (seed + k) % 4 !== 0;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#16161f" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${accent}" opacity="0.12"/>
    <circle cx="${cx}" cy="${cy}" r="46" fill="${accent}" opacity="0.35"/>
    <circle cx="${cx}" cy="${cy}" r="28" fill="${accent}" opacity="0.5"/>
    <line x1="${x + 20}" y1="${y + h - 30}" x2="${x + w - 20}" y2="${y + h - 30}" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
    ${showBubble ? `<g><rect x="${bubbleX}" y="${y + 18}" width="150" height="52" rx="26" fill="#ffffff" opacity="0.92"/><text x="${bubbleX + 75}" y="${y + 51}" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="800" fill="#111">! ! !</text></g>` : ""}
  </g>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 60);
}
