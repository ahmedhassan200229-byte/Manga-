import { db } from "@/db";
import { comments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const COLORS = [
  "from-violet-500 to-purple-700",
  "from-amber-500 to-orange-700",
  "from-emerald-500 to-teal-700",
  "from-rose-500 to-red-700",
  "from-sky-500 to-blue-700",
  "from-fuchsia-500 to-pink-700",
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const seriesId = url.searchParams.get("seriesId");
  const chapterId = url.searchParams.get("chapterId");

  let rows;
  if (seriesId) {
    rows = await db
      .select()
      .from(comments)
      .where(eq(comments.seriesId, Number(seriesId)))
      .orderBy(desc(comments.createdAt))
      .limit(50);
  } else if (chapterId) {
    rows = await db
      .select()
      .from(comments)
      .where(eq(comments.chapterId, Number(chapterId)))
      .orderBy(desc(comments.createdAt))
      .limit(50);
  } else {
    rows = await db.select().from(comments).orderBy(desc(comments.createdAt)).limit(20);
  }
  return Response.json({ ok: true, comments: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { seriesId, chapterId, userName, content } = body;
    if (!userName?.trim() || !content?.trim()) {
      return Response.json({ ok: false, error: "missing fields" }, { status: 400 });
    }
    const color = COLORS[userName.length % COLORS.length];
    const [row] = await db
      .insert(comments)
      .values({
        seriesId: seriesId ? Number(seriesId) : null,
        chapterId: chapterId ? Number(chapterId) : null,
        userName: String(userName).slice(0, 40),
        avatarColor: color,
        content: String(content).slice(0, 1000),
      })
      .returning();
    return Response.json({ ok: true, comment: row });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
