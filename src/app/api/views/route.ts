import { db } from "@/db";
import { series, chapters } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { slug, chapterId } = await req.json();
    if (slug) {
      await db
        .update(series)
        .set({ views: sql`${series.views} + 1` })
        .where(eq(series.slug, slug));
    }
    if (chapterId) {
      await db
        .update(chapters)
        .set({ views: sql`${chapters.views} + 1` })
        .where(eq(chapters.id, Number(chapterId)));
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
