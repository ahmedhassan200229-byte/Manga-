import { db } from "@/db";
import { ratings, series } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { value, userKey } = await req.json();
  const v = Math.max(1, Math.min(10, Number(value)));
  if (!userKey || !v) return Response.json({ ok: false }, { status: 400 });

  const [s] = await db.select().from(series).where(eq(series.slug, slug)).limit(1);
  if (!s) return Response.json({ ok: false }, { status: 404 });

  const existing = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.userKey, userKey), eq(ratings.seriesId, s.id)))
    .limit(1);

  if (existing.length) {
    await db.update(ratings).set({ value: v }).where(eq(ratings.id, existing[0].id));
  } else {
    await db.insert(ratings).values({ userKey, seriesId: s.id, value: v });
  }

  const agg = await db
    .select({
      avg: sql<number>`avg(${ratings.value})`,
      count: sql<number>`count(*)`,
    })
    .from(ratings)
    .where(eq(ratings.seriesId, s.id));

  const userAvg = Number(agg[0]?.avg || v);
  const userCount = Number(agg[0]?.count || 1);
  // blend with base rating to keep stable average
  const blended = (s.rating * 0.85 + userAvg * 0.15);
  const totalCount = s.ratingsCount + userCount;

  await db
    .update(series)
    .set({ rating: Math.round(blended * 10) / 10, ratingsCount: totalCount })
    .where(eq(series.id, s.id));

  return Response.json({ ok: true, rating: Math.round(blended * 10) / 10, count: totalCount });
}
