import { db } from "@/db";
import { series, genres, seriesGenres, chapters } from "@/db/schema";
import { desc, eq, sql, and, ilike, or, inArray } from "drizzle-orm";

export type SeriesWithMeta = typeof series.$inferSelect & {
  genres: string[];
  latestChapter: number | null;
  chaptersCount: number;
};

async function attachMeta(
  rows: (typeof series.$inferSelect)[]
): Promise<SeriesWithMeta[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);

  const gRows = await db
    .select({ seriesId: seriesGenres.seriesId, name: genres.name })
    .from(seriesGenres)
    .innerJoin(genres, eq(seriesGenres.genreId, genres.id))
    .where(inArray(seriesGenres.seriesId, ids));

  const cRows = await db
    .select({
      seriesId: chapters.seriesId,
      latest: sql<number | null>`max(${chapters.number})`,
      count: sql<number>`count(*)`,
    })
    .from(chapters)
    .where(inArray(chapters.seriesId, ids))
    .groupBy(chapters.seriesId);

  const gMap = new Map<number, string[]>();
  for (const g of gRows) {
    if (!gMap.has(g.seriesId)) gMap.set(g.seriesId, []);
    gMap.get(g.seriesId)!.push(g.name);
  }
  const cMap = new Map<number, { latest: number | null; count: number }>();
  for (const c of cRows) cMap.set(c.seriesId, { latest: c.latest, count: Number(c.count) });

  return rows.map((r) => ({
    ...r,
    genres: gMap.get(r.id) || [],
    latestChapter: cMap.get(r.id)?.latest ?? null,
    chaptersCount: cMap.get(r.id)?.count ?? 0,
  }));
}

export async function getFeatured(): Promise<SeriesWithMeta[]> {
  const rows = await db
    .select()
    .from(series)
    .where(eq(series.featured, true))
    .orderBy(desc(series.views))
    .limit(6);
  return attachMeta(rows);
}

export async function getTrending(): Promise<SeriesWithMeta[]> {
  const rows = await db
    .select()
    .from(series)
    .where(eq(series.trending, true))
    .orderBy(desc(series.views))
    .limit(12);
  return attachMeta(rows);
}

export async function getLatestUpdated(limit = 12): Promise<SeriesWithMeta[]> {
  const rows = await db
    .select()
    .from(series)
    .orderBy(desc(series.updatedAt), desc(series.id))
    .limit(limit);
  return attachMeta(rows);
}

export async function getAllGenres(): Promise<{ name: string; count: number }[]> {
  const rows = await db
    .select({ name: genres.name, count: sql<number>`count(${seriesGenres.id})` })
    .from(genres)
    .leftJoin(seriesGenres, eq(seriesGenres.genreId, genres.id))
    .groupBy(genres.id, genres.name)
    .orderBy(genres.name);
  return rows.map((r) => ({ name: r.name, count: Number(r.count) }));
}

export async function searchSeries(opts: {
  q?: string;
  genre?: string;
  status?: string;
  type?: string;
  sort?: string;
}): Promise<SeriesWithMeta[]> {
  const conds = [];
  if (opts.q) {
    conds.push(
      or(
        ilike(series.titleAr, `%${opts.q}%`),
        ilike(series.titleEn, `%${opts.q}%`),
        ilike(series.author, `%${opts.q}%`)
      )
    );
  }
  if (opts.status) conds.push(eq(series.status, opts.status as "ongoing" | "completed" | "hiatus"));
  if (opts.type) conds.push(eq(series.type, opts.type as "manhwa" | "manga" | "manhua" | "novel"));

  let rows: (typeof series.$inferSelect)[];
  const order =
    opts.sort === "rating"
      ? desc(series.rating)
      : opts.sort === "year"
        ? desc(series.year)
        : desc(series.views);

  if (opts.genre) {
    const g = await db.select().from(genres).where(eq(genres.name, opts.genre)).limit(1);
    if (!g.length) return [];
    const sg = await db
      .select({ seriesId: seriesGenres.seriesId })
      .from(seriesGenres)
      .where(eq(seriesGenres.genreId, g[0].id));
    const ids = sg.map((r) => r.seriesId);
    if (!ids.length) return [];
    rows = await db
      .select()
      .from(series)
      .where(and(inArray(series.id, ids), ...conds))
      .orderBy(order)
      .limit(60);
  } else {
    rows = await db
      .select()
      .from(series)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(order)
      .limit(60);
  }
  return attachMeta(rows);
}

export async function getSeriesBySlug(slug: string): Promise<SeriesWithMeta | null> {
  const rows = await db.select().from(series).where(eq(series.slug, slug)).limit(1);
  if (!rows.length) return null;
  const withMeta = await attachMeta(rows);
  return withMeta[0];
}

export async function getChapters(seriesId: number) {
  return db
    .select()
    .from(chapters)
    .where(eq(chapters.seriesId, seriesId))
    .orderBy(desc(chapters.number));
}

export async function getChapter(seriesId: number, num: number) {
  const rows = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.seriesId, seriesId), eq(chapters.number, num)))
    .limit(1);
  return rows[0] || null;
}

export async function getLatestChaptersFeed(limit = 14) {
  const rows = await db
    .select({
      id: chapters.id,
      number: chapters.number,
      title: chapters.title,
      createdAt: chapters.createdAt,
      views: chapters.views,
      slug: series.slug,
      titleAr: series.titleAr,
      coverImage: series.coverImage,
    })
    .from(chapters)
    .innerJoin(series, eq(chapters.seriesId, series.id))
    .orderBy(desc(chapters.createdAt))
    .limit(limit);
  return rows;
}

export async function getRelated(s: SeriesWithMeta, limit = 6): Promise<SeriesWithMeta[]> {
  if (!s.genres.length) return [];
  const g = await db.select().from(genres).where(inArray(genres.name, s.genres.slice(0, 3)));
  if (!g.length) return [];
  const sg = await db
    .select({ seriesId: seriesGenres.seriesId })
    .from(seriesGenres)
    .where(inArray(seriesGenres.genreId, g.map((x) => x.id)));
  const ids = [...new Set(sg.map((r) => r.seriesId))].filter((id) => id !== s.id).slice(0, 12);
  if (!ids.length) return [];
  const rows = await db.select().from(series).where(inArray(series.id, ids)).limit(limit);
  return attachMeta(rows);
}

export async function getStats() {
  const s = await db.select({ c: sql<number>`count(*)` }).from(series);
  const c = await db.select({ c: sql<number>`count(*)` }).from(chapters);
  const v = await db.select({ s: sql<number>`coalesce(sum(${series.views}),0)` }).from(series);
  return {
    series: Number(s[0]?.c || 0),
    chapters: Number(c[0]?.c || 0),
    views: Number(v[0]?.s || 0),
  };
}
