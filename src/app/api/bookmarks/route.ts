import { db } from "@/db";
import { bookmarks, series } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userKey = url.searchParams.get("userKey");
  if (!userKey) return Response.json({ ok: true, slugs: [], items: [] });

  const rows = await db
    .select({
      id: bookmarks.id,
      seriesId: bookmarks.seriesId,
      createdAt: bookmarks.createdAt,
      slug: series.slug,
      titleAr: series.titleAr,
      titleEn: series.titleEn,
      coverImage: series.coverImage,
      rating: series.rating,
      views: series.views,
      status: series.status,
      type: series.type,
    })
    .from(bookmarks)
    .innerJoin(series, eq(bookmarks.seriesId, series.id))
    .where(eq(bookmarks.userKey, userKey));

  return Response.json({ ok: true, slugs: rows.map((r) => r.slug), items: rows });
}

export async function POST(req: Request) {
  const { slug, userKey } = await req.json();
  if (!slug || !userKey) return Response.json({ ok: false }, { status: 400 });
  const [s] = await db.select().from(series).where(eq(series.slug, slug)).limit(1);
  if (!s) return Response.json({ ok: false }, { status: 404 });
  const existing = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userKey, userKey), eq(bookmarks.seriesId, s.id)))
    .limit(1);
  if (!existing.length) {
    await db.insert(bookmarks).values({ userKey, seriesId: s.id });
  }
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { slug, userKey } = await req.json();
  if (!slug || !userKey) return Response.json({ ok: false }, { status: 400 });
  const [s] = await db.select().from(series).where(eq(series.slug, slug)).limit(1);
  if (!s) return Response.json({ ok: false }, { status: 404 });
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userKey, userKey), eq(bookmarks.seriesId, s.id)));
  return Response.json({ ok: true });
}
