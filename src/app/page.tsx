import Link from "next/link";
import {
  Flame,
  Clock,
  Sparkles,
  LayoutGrid,
  ChevronLeft,
  Eye,
  BookOpen,
  Library,
  Globe,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import SeriesCard from "@/components/SeriesCard";
import {
  getFeatured,
  getTrending,
  getLatestChaptersFeed,
  getAllGenres,
  getStats,
  getLatestUpdated,
} from "@/lib/queries";
import { formatViews, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, trending, feed, genreList, stats, latest] = await Promise.all([
    getFeatured(),
    getTrending(),
    getLatestChaptersFeed(12),
    getAllGenres(),
    getStats(),
    getLatestUpdated(10),
  ]);

  return (
    <div>
      <HeroSlider
        items={featured.map((s) => ({
          id: s.id,
          slug: s.slug,
          titleAr: s.titleAr,
          titleEn: s.titleEn,
          description: s.description,
          coverImage: s.coverImage,
          rating: s.rating,
          views: s.views,
          genres: s.genres,
          latestChapter: s.latestChapter,
        }))}
      />

      {/* stats strip */}
      <div className="border-y border-white/10 bg-[#0e1120]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4">
          {[
            { icon: Library, label: "عمل مترجم", value: `${stats.series}+` },
            { icon: BookOpen, label: "فصل متاح", value: `${stats.chapters}+` },
            { icon: Eye, label: "مشاهدة", value: formatViews(stats.views) },
            { icon: Zap, label: "تحديث يومي", value: "24/7" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-600/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]">
                <s.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-black leading-none text-white">{s.value}</span>
                <span className="mt-1 block text-xs font-bold text-slate-400">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10">
        {/* trending */}
        <section>
          <SectionHead
            icon={<Flame className="h-5 w-5 text-orange-400" />}
            title="الأكثر رواجاً"
            subtitle="الأعمال التي يقرأها الجميع الآن"
            href="/series?sort=views"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {trending.slice(0, 6).map((s) => (
              <SeriesCard
                key={s.id}
                s={{
                  id: s.id,
                  slug: s.slug,
                  titleAr: s.titleAr,
                  titleEn: s.titleEn,
                  coverImage: s.coverImage,
                  rating: s.rating,
                  views: s.views,
                  status: s.status,
                  type: s.type,
                  latestChapter: s.latestChapter,
                  genres: s.genres,
                }}
              />
            ))}
          </div>
        </section>

        {/* latest chapters + sidebar */}
        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12141f]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <Clock className="h-5 w-5 text-emerald-400" />
                آخر الفصول المضافة
              </h2>
              <Link href="/series" className="flex items-center gap-1 text-xs font-black text-violet-300 hover:text-amber-300">
                عرض الكل <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {feed.map((f) => (
                <Link
                  key={f.id}
                  href={`/read/${f.slug}/${f.number}`}
                  className="group flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.coverImage}
                    alt=""
                    loading="lazy"
                    className="h-16 w-12 shrink-0 rounded-lg border border-white/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white transition group-hover:text-amber-300">
                      {f.titleAr}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                      <span className="rounded-md bg-violet-600/20 px-2 py-0.5 text-violet-300">
                        فصل {f.number}
                      </span>
                      <span>{timeAgo(f.createdAt)}</span>
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Eye className="h-3.5 w-3.5" /> {formatViews(f.views)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* top rated */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12141f]">
              <div className="border-b border-white/10 bg-gradient-to-l from-amber-500/15 to-transparent px-5 py-4">
                <h2 className="flex items-center gap-2 text-base font-black text-white">
                  <Crown className="h-5 w-5 text-amber-400" />
                  الأعلى تقييماً
                </h2>
              </div>
              <div className="space-y-1 p-3">
                {[...trending]
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((s, idx) => (
                    <Link
                      key={s.id}
                      href={`/series/${s.slug}`}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.04]"
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-black ${
                          idx === 0
                            ? "bg-amber-400 text-black"
                            : idx === 1
                              ? "bg-slate-300 text-black"
                              : idx === 2
                                ? "bg-orange-400 text-black"
                                : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.coverImage} alt="" loading="lazy" className="h-14 w-10 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-black text-white">{s.titleAr}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {Number(s.rating).toFixed(1)}
                          <span className="font-medium text-slate-500">• {formatViews(s.views)}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* genres */}
            <div className="rounded-2xl border border-white/10 bg-[#12141f] p-5">
              <h2 className="flex items-center gap-2 text-base font-black text-white">
                <LayoutGrid className="h-5 w-5 text-violet-400" />
                التصنيفات
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {genreList.map((g) => (
                  <Link
                    key={g.name}
                    href={`/series?genre=${encodeURIComponent(g.name)}`}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-violet-500/50 hover:text-violet-300"
                  >
                    {g.name}
                    <span className="ms-1.5 text-[10px] text-slate-500">({g.count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* free domain CTA */}
            <Link
              href="/guide-domain"
              className="group block overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-bl from-amber-500/15 via-orange-500/10 to-transparent p-5 transition hover:border-amber-400/60"
            >
              <p className="flex items-center gap-2 text-base font-black text-amber-300">
                <Globe className="h-5 w-5" />
                احصل على دومين مجاني لموقعك!
              </p>
              <p className="mt-2 text-[13px] leading-6 text-slate-300">
                شرح خطوة بخطوة: كيف تنشر موقع مانجا مثل هذا وتحصل على نطاق مجاني على الإنترنت.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-xl bg-amber-400 px-4 py-2 text-xs font-black text-black transition group-hover:brightness-110">
                اقرأ الشرح المجاني <ChevronLeft className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </section>

        {/* latest updated grid */}
        <section>
          <SectionHead
            icon={<Sparkles className="h-5 w-5 text-violet-400" />}
            title="أُضيفت حديثاً"
            subtitle="أحدث الأعمال في المكتبة"
            href="/series"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latest.slice(0, 10).map((s) => (
              <SeriesCard
                key={s.id}
                s={{
                  id: s.id,
                  slug: s.slug,
                  titleAr: s.titleAr,
                  titleEn: s.titleEn,
                  coverImage: s.coverImage,
                  rating: s.rating,
                  views: s.views,
                  status: s.status,
                  type: s.type,
                  latestChapter: s.latestChapter,
                  genres: s.genres,
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHead({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-black text-white md:text-2xl">
          {icon}
          {title}
        </h2>
        <p className="mt-1 text-xs font-bold text-slate-500 md:text-sm">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-slate-200 transition hover:border-violet-500/50 hover:text-violet-300"
      >
        عرض الكل <ChevronLeft className="h-4 w-4" />
      </Link>
    </div>
  );
}
