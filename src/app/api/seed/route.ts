import { db } from "@/db";
import { series, genres, seriesGenres, chapters, comments } from "@/db/schema";
import { GENRES, SERIES, SEED_COMMENTS } from "@/lib/seed-data";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const existing = await db.select({ c: sql<number>`count(*)` }).from(series);
    if (Number(existing[0]?.c || 0) > 0) {
      return Response.json({ ok: true, message: "already seeded" });
    }

    // genres
    const genreMap = new Map<string, number>();
    for (const g of GENRES) {
      const [row] = await db
        .insert(genres)
        .values({ name: g, slug: encodeURIComponent(g) })
        .onConflictDoNothing()
        .returning();
      if (row) genreMap.set(g, row.id);
    }
    // fetch all genres to fill map
    const allGenres = await db.select().from(genres);
    for (const g of allGenres) genreMap.set(g.name, g.id);

    for (const s of SERIES) {
      const [row] = await db
        .insert(series)
        .values({
          slug: s.slug,
          titleAr: s.titleAr,
          titleEn: s.titleEn,
          description: s.description,
          coverImage: s.coverImage,
          author: s.author,
          artist: s.artist,
          status: s.status,
          type: s.type,
          year: s.year,
          rating: s.rating,
          ratingsCount: Math.floor(s.views / 900),
          views: s.views,
          likes: s.likes,
          featured: s.featured,
          trending: s.trending,
        })
        .returning();

      for (const g of s.genres) {
        const gid = genreMap.get(g);
        if (gid) {
          await db.insert(seriesGenres).values({ seriesId: row.id, genreId: gid });
        }
      }

      // chapters
      const now = Date.now();
      for (let n = 1; n <= s.chaptersCount; n++) {
        const daysAgo = (s.chaptersCount - n) * 2 + Math.floor(Math.random() * 2);
        await db.insert(chapters).values({
          seriesId: row.id,
          number: n,
          title: `الفصل ${n}`,
          views: Math.max(500, Math.floor(s.views / (s.chaptersCount - n + 2))),
          pagesCount: 10 + ((n * 7) % 9),
          createdAt: new Date(now - daysAgo * 86400000),
        });
      }

      // seed comments (3 per series)
      for (let c = 0; c < 3; c++) {
        const cm = SEED_COMMENTS[(row.id + c) % SEED_COMMENTS.length];
        await db.insert(comments).values({
          seriesId: row.id,
          userName: cm.userName,
          content: cm.content,
          likes: Math.floor(Math.random() * 120),
          createdAt: new Date(now - (c * 5 + row.id) * 3600000),
        });
      }
    }

    const count = await db.select({ c: sql<number>`count(*)` }).from(series);
    return Response.json({ ok: true, series: Number(count[0]?.c || 0) });
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE() {
  await db.delete(comments);
  await db.delete(seriesGenres);
  await db.delete(chapters);
  await db.delete(series);
  await db.delete(genres).where(eq(genres.id, -1));
  return Response.json({ ok: true });
}
