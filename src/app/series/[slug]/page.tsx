import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Eye,
  BookOpen,
  Calendar,
  User,
  Palette,
  Layers,
  BookMarked,
  Play,
  ListOrdered,
  ArrowDownWideNarrow,
  Heart,
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";
import RatingWidget from "@/components/RatingWidget";
import Comments from "@/components/Comments";
import SeriesCard from "@/components/SeriesCard";
import ViewTracker from "@/components/ViewTracker";
import ChapterSearch from "@/components/ChapterSearch";
import {
  getSeriesBySlug,
  getChapters,
  getRelated,
} from "@/lib/queries";
import { formatViews, statusLabel, typeLabel, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await getSeriesBySlug(slug);
  if (!s) notFound();

  const [chapterList, related] = await Promise.all([
    getChapters(s.id),
    getRelated(s),
  ]);

  const firstChapter = chapterList.length ? chapterList[chapterList.length - 1] : null;
  const lastChapter = chapterList.length ? chapterList[0] : null;

  return (
    <div>
      <ViewTracker slug={s.slug} />
      {/* banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.coverImage} alt="" className="h-full w-full scale-110 object-cover object-top opacity-25 blur-lg" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d17] via-[#0b0d17]/70 to-[#0b0d17]/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-8">
          {/* breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Link href="/" className="hover:text-amber-300">الرئيسية</Link>
            <span>/</span>
            <Link href="/series" className="hover:text-amber-300">المكتبة</Link>
            <span>/</span>
            <span className="max-w-[50vw] truncate text-slate-200">{s.titleAr}</span>
          </nav>

          <div className="grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr_300px]">
            {/* cover */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.coverImage} alt={s.titleAr} className="aspect-[3/4] w-full object-cover" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="flex items-center justify-center gap-1 text-sm font-black text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {Number(s.rating).toFixed(1)}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-500">التقييم</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="text-sm font-black text-white">{formatViews(s.views)}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-500">مشاهدة</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="text-sm font-black text-white">{chapterList.length}</p>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-500">فصل</p>
                </div>
              </div>
            </div>

            {/* info */}
            <div>
              <h1 className="text-2xl font-black leading-snug text-white md:text-3xl">
                {s.titleAr}
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-400" dir="ltr" style={{ textAlign: "right" }}>
                {s.titleEn}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.genres.map((g) => (
                  <Link
                    key={g}
                    href={`/series?genre=${encodeURIComponent(g)}`}
                    className="rounded-lg border border-violet-500/30 bg-violet-600/15 px-3 py-1.5 text-xs font-black text-violet-200 transition hover:border-amber-400/50 hover:text-amber-300"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 text-[13px] sm:grid-cols-3">
                <Info icon={<User className="h-4 w-4" />} label="المؤلف" value={s.author || "غير معروف"} />
                <Info icon={<Palette className="h-4 w-4" />} label="الرسام" value={s.artist || "غير معروف"} />
                <Info
                  icon={<BookMarked className="h-4 w-4" />}
                  label="الحالة"
                  value={statusLabel(s.status)}
                  highlight
                />
                <Info icon={<Layers className="h-4 w-4" />} label="النوع" value={typeLabel(s.type)} />
                <Info icon={<Calendar className="h-4 w-4" />} label="سنة الإصدار" value={String(s.year || "—")} />
                <Info icon={<Heart className="h-4 w-4" />} label="الإعجابات" value={formatViews(s.likes)} />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h2 className="mb-2 text-sm font-black text-white">القصة</h2>
                <p className="text-sm leading-8 text-slate-300">{s.description}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {firstChapter && (
                  <Link
                    href={`/read/${s.slug}/${firstChapter.number}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 transition hover:brightness-110"
                  >
                    <Play className="h-4 w-4" />
                    ابدأ من الفصل {firstChapter.number}
                  </Link>
                )}
                {lastChapter && (
                  <Link
                    href={`/read/${s.slug}/${lastChapter.number}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 px-4 py-3 text-sm font-black text-black shadow-lg shadow-orange-950/40 transition hover:brightness-110"
                  >
                    <BookOpen className="h-4 w-4" />
                    أكمل الفصل {lastChapter.number}
                  </Link>
                )}
                <div className="flex w-full sm:w-auto sm:min-w-44">
                  <BookmarkButton slug={s.slug} />
                </div>
              </div>
            </div>

            {/* side */}
            <div className="space-y-4">
              <RatingWidget slug={s.slug} rating={s.rating} count={s.ratingsCount} />
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-black text-white">معلومات سريعة</h3>
                <ul className="mt-3 space-y-2.5 text-xs font-bold text-slate-400">
                  <li className="flex items-center justify-between">
                    <span>آخر تحديث</span>
                    <span className="text-slate-200">
                      {lastChapter ? timeAgo(lastChapter.createdAt) : "—"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>عدد الفصول</span>
                    <span className="text-slate-200">{chapterList.length}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>مشاهدات الفصل الأخير</span>
                    <span className="text-slate-200">
                      {lastChapter ? formatViews(lastChapter.views) : "—"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>فريق الترجمة</span>
                    <span className="text-amber-300">أولمبس ستاف</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
        {/* chapters */}
        <div id="chapters" className="scroll-mt-20 overflow-hidden rounded-2xl border border-white/10 bg-[#12141f]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <ListOrdered className="h-5 w-5 text-violet-400" />
              قائمة الفصول
              <span className="rounded-full bg-violet-600/20 px-2.5 py-0.5 text-xs font-black text-violet-300">
                {chapterList.length}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <ChapterSearch />
              <span className="hidden items-center gap-1 text-[11px] font-bold text-slate-500 sm:flex">
                <ArrowDownWideNarrow className="h-4 w-4" /> الأحدث أولاً
              </span>
            </div>
          </div>
          <div className="max-h-[520px] divide-y divide-white/5 overflow-y-auto" id="chapter-list">
            {chapterList.map((c) => (
              <Link
                key={c.id}
                href={`/read/${s.slug}/${c.number}`}
                data-chapter={c.number}
                className="chapter-row group flex items-center gap-3 px-5 py-3.5 transition hover:bg-violet-600/[0.07]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-900/30 text-sm font-black text-violet-200 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.3)]">
                  {c.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-slate-100 transition group-hover:text-amber-300">
                    {s.titleAr} — فصل {c.number}
                  </span>
                  <span className="mt-1 flex items-center gap-3 text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {formatViews(c.views)}
                    </span>
                    <span>{timeAgo(c.createdAt)}</span>
                    <span>{c.pagesCount} صفحة</span>
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-black text-slate-300 transition group-hover:bg-violet-600 group-hover:text-white">
                  قراءة
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Comments seriesId={s.id} />

        {/* related */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-black text-white">قد يعجبك أيضاً</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {related.map((r) => (
                <SeriesCard
                  key={r.id}
                  s={{
                    id: r.id,
                    slug: r.slug,
                    titleAr: r.titleAr,
                    titleEn: r.titleEn,
                    coverImage: r.coverImage,
                    rating: r.rating,
                    views: r.views,
                    status: r.status,
                    type: r.type,
                    latestChapter: r.latestChapter,
                    genres: r.genres,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <span className="text-violet-400">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold text-slate-500">{label}</span>
        <span className={`block truncate text-[13px] font-black ${highlight ? "text-emerald-300" : "text-white"}`}>
          {value}
        </span>
      </span>
    </div>
  );
}
