import Link from "next/link";
import { Search, Library, RotateCcw } from "lucide-react";
import SeriesCard from "@/components/SeriesCard";
import { searchSeries, getAllGenres } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string; status?: string; type?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const [results, genreList] = await Promise.all([
    searchSeries({ q: sp.q, genre: sp.genre, status: sp.status, type: sp.type, sort: sp.sort }),
    getAllGenres(),
  ]);

  const hasFilter = sp.q || sp.genre || sp.status || sp.type;

  const linkFor = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { ...sp, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    return `/series?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-white md:text-3xl">
            <Library className="h-7 w-7 text-violet-400" />
            مكتبة الأعمال
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {results.length} عمل — ابحث وصفِّ حسب التصنيف والحالة والنوع
          </p>
        </div>
        {hasFilter && (
          <Link
            href="/series"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> مسح الفلاتر
          </Link>
        )}
      </div>

      {/* search */}
      <form action="/series" method="get" className="mt-5 flex gap-2">
        {sp.genre && <input type="hidden" name="genre" value={sp.genre} />}
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        {sp.type && <input type="hidden" name="type" value={sp.type} />}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder="ابحث بالاسم العربي أو الإنجليزي أو المؤلف..."
            className="w-full rounded-2xl border border-white/10 bg-[#12141f] py-3.5 pe-11 ps-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-600/20"
          />
        </div>
        <button className="rounded-2xl bg-gradient-to-l from-violet-600 to-purple-600 px-7 text-sm font-black text-white hover:brightness-110">
          بحث
        </button>
      </form>

      {/* filters */}
      <div className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-[#12141f] p-5 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-black text-slate-400">التصنيف</p>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
            <FilterChip label="الكل" active={!sp.genre} href={linkFor({ genre: undefined })} />
            {genreList.map((g) => (
              <FilterChip
                key={g.name}
                label={`${g.name} (${g.count})`}
                active={sp.genre === g.name}
                href={linkFor({ genre: g.name })}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-black text-slate-400">الحالة</p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="الكل" active={!sp.status} href={linkFor({ status: undefined })} />
            <FilterChip label="مستمرة" active={sp.status === "ongoing"} href={linkFor({ status: "ongoing" })} />
            <FilterChip label="مكتملة" active={sp.status === "completed"} href={linkFor({ status: "completed" })} />
            <FilterChip label="متوقفة" active={sp.status === "hiatus"} href={linkFor({ status: "hiatus" })} />
          </div>
          <p className="mb-2 mt-4 text-xs font-black text-slate-400">النوع</p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="الكل" active={!sp.type} href={linkFor({ type: undefined })} />
            <FilterChip label="مانهوا" active={sp.type === "manhwa"} href={linkFor({ type: "manhwa" })} />
            <FilterChip label="مانجا" active={sp.type === "manga"} href={linkFor({ type: "manga" })} />
            <FilterChip label="مانها" active={sp.type === "manhua"} href={linkFor({ type: "manhua" })} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-black text-slate-400">الترتيب</p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="الأكثر مشاهدة" active={!sp.sort || sp.sort === "views"} href={linkFor({ sort: "views" })} />
            <FilterChip label="الأعلى تقييماً" active={sp.sort === "rating"} href={linkFor({ sort: "rating" })} />
            <FilterChip label="الأحدث إصداراً" active={sp.sort === "year"} href={linkFor({ sort: "year" })} />
          </div>
          {sp.q && (
            <p className="mt-4 rounded-xl bg-violet-600/10 p-3 text-xs font-bold leading-6 text-violet-200">
              نتائج البحث عن: <span className="text-amber-300">«{sp.q}»</span>
            </p>
          )}
        </div>
      </div>

      {/* results */}
      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-lg font-black text-white">لا توجد نتائج مطابقة</p>
          <p className="mt-2 text-sm text-slate-500">جرّب كلمة بحث مختلفة أو أزل بعض الفلاتر</p>
          <Link
            href="/series"
            className="mt-5 inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-black text-white"
          >
            عرض كل الأعمال
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((s) => (
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
      )}
    </div>
  );
}

function FilterChip({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
        active
          ? "bg-violet-600 text-white shadow-lg shadow-violet-950/50"
          : "border border-white/10 bg-white/5 text-slate-300 hover:border-violet-500/40 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
