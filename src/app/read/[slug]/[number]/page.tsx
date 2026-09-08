import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronLeft, ListOrdered, Home, Eye } from "lucide-react";
import Comments from "@/components/Comments";
import ViewTracker from "@/components/ViewTracker";
import ReaderControls from "@/components/ReaderControls";
import { getSeriesBySlug, getChapter, getChapters } from "@/lib/queries";
import { formatViews } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string; number: string }>;
}) {
  const { slug, number } = await params;
  const s = await getSeriesBySlug(slug);
  if (!s) notFound();

  const num = Number(number);
  const chapter = await getChapter(s.id, num);
  if (!chapter) notFound();

  const all = await getChapters(s.id);
  const idx = all.findIndex((c) => c.number === num);
  const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null; // smaller number
  const next = idx > 0 ? all[idx - 1] : null; // bigger number

  let realUrls: string[] = [];
  if (chapter.pageUrls) {
    try {
      realUrls = JSON.parse(chapter.pageUrls);
    } catch {
      realUrls = [];
    }
  }
  const pages = realUrls.length
    ? realUrls.map((_, i) => i + 1)
    : Array.from({ length: chapter.pagesCount }, (_, i) => i + 1);
  const pageSrc = (p: number) =>
    realUrls.length
      ? realUrls[p - 1]
      : `/api/placeholder-page?page=${p}&chapter=${num}&title=${encodeURIComponent(s.titleAr.slice(0, 24))}`;

  return (
    <div className="bg-[#07080f]">
      <ViewTracker slug={s.slug} chapterId={chapter.id} />

      {/* top bar */}
      <div className="sticky top-16 z-40 border-b border-white/10 bg-[#0b0d17]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-4 py-3">
          <nav className="flex min-w-0 flex-1 items-center gap-1.5 text-xs font-bold text-slate-400">
            <Link href="/" className="flex shrink-0 items-center gap-1 hover:text-amber-300">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <span>/</span>
            <Link href={`/series/${s.slug}`} className="max-w-[35vw] truncate hover:text-amber-300">
              {s.titleAr}
            </Link>
            <span>/</span>
            <span className="shrink-0 text-slate-100">فصل {num}</span>
          </nav>
          <div className="flex items-center gap-1.5">
            {prev ? (
              <NavBtn href={`/read/${s.slug}/${prev.number}`} label={`السابق (${prev.number})`} dir="prev" />
            ) : (
              <span className="cursor-not-allowed rounded-lg bg-white/5 px-3 py-2 text-xs font-black text-slate-600">
                السابق
              </span>
            )}
            <Link
              href={`/series/${s.slug}#chapters`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-violet-600 hover:text-white"
              title="قائمة الفصول"
            >
              <ListOrdered className="h-4 w-4" />
            </Link>
            {next ? (
              <NavBtn href={`/read/${s.slug}/${next.number}`} label={`التالي (${next.number})`} dir="next" />
            ) : (
              <span className="cursor-not-allowed rounded-lg bg-white/5 px-3 py-2 text-xs font-black text-slate-600">
                التالي
              </span>
            )}
          </div>
        </div>
        {/* chapter select */}
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto px-4 py-2">
            {all.slice(0, 40).map((c) => (
              <Link
                key={c.id}
                href={`/read/${s.slug}/${c.number}`}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-black transition ${
                  c.number === num
                    ? "bg-amber-400 text-black"
                    : "bg-white/5 text-slate-300 hover:bg-violet-600 hover:text-white"
                }`}
              >
                {c.number}
              </Link>
            ))}
            {all.length > 40 && (
              <Link href={`/series/${s.slug}#chapters`} className="shrink-0 text-xs font-bold text-violet-300">
                + {all.length - 40} فصل...
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* title */}
      <div className="mx-auto max-w-4xl px-4 pb-2 pt-8 text-center">
        <h1 className="text-xl font-black text-white md:text-2xl">{s.titleAr}</h1>
        <p className="mt-2 flex items-center justify-center gap-3 text-xs font-bold text-slate-400">
          <span className="rounded-lg bg-violet-600/20 px-3 py-1 text-violet-200">الفصل {num}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {formatViews(chapter.views)} مشاهدة
          </span>
          <span>{chapter.pagesCount} صفحة</span>
        </p>
      </div>

      <ReaderControls />

      {/* pages */}
      <div className="mx-auto max-w-3xl space-y-3 px-3 pb-8 md:px-4" id="reader-pages">
        <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-l from-amber-500/10 to-transparent p-4 text-center">
          <p className="text-sm font-black text-amber-300">ترجمة فريق أولمبس ستاف</p>
          <p className="mt-1 text-xs font-bold text-slate-400">
            إذا أعجبك الفصل ادعمنا بمشاركته — القراءة من مصدرنا تدعم استمرار الترجمة
          </p>
        </div>
        {pages.map((p) => (
          <div key={p} className="reader-page overflow-hidden rounded-lg border border-white/10 bg-[#12141f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pageSrc(p)}
              alt={`${s.titleAr} فصل ${num} صفحة ${p}`}
              loading={p <= 3 ? "eager" : "lazy"}
              className="w-full"
            />
          </div>
        ))}
        <div className="rounded-xl border border-white/10 bg-[#12141f] p-6 text-center">
          <p className="text-base font-black text-white">نهاية الفصل {num}</p>
          <p className="mt-1 text-xs font-bold text-slate-500">شكراً لقراءتك من أولمبس ستاف</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {prev && (
              <Link
                href={`/read/${s.slug}/${prev.number}`}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-black text-white hover:bg-white/10"
              >
                الفصل السابق
              </Link>
            )}
            {next ? (
              <Link
                href={`/read/${s.slug}/${next.number}`}
                className="rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-black text-white hover:brightness-110"
              >
                الفصل التالي ({next.number})
              </Link>
            ) : (
              <span className="rounded-xl bg-emerald-500/15 px-6 py-2.5 text-sm font-black text-emerald-300">
                أنت تتابع آخر فصل مترجم
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-3 pb-12 md:px-4">
        <Comments chapterId={chapter.id} />
      </div>
    </div>
  );
}

function NavBtn({ href, label, dir }: { href: string; label: string; dir: "prev" | "next" }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-black text-white transition hover:bg-violet-500"
    >
      {dir === "prev" ? <ChevronRight className="h-4 w-4" /> : null}
      {label}
      {dir === "next" ? <ChevronLeft className="h-4 w-4" /> : null}
    </Link>
  );
}
