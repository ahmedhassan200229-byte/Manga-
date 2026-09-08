import Link from "next/link";
import { Star, Eye, BookOpen } from "lucide-react";
import { formatViews, statusLabel } from "@/lib/utils";

export type SeriesCardData = {
  id: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  coverImage: string;
  rating: number;
  views: number;
  status: string;
  type: string;
  latestChapter?: number | null;
  genres?: string[];
};

export default function SeriesCard({ s }: { s: SeriesCardData }) {
  return (
    <Link
      href={`/series/${s.slug}`}
      className="card-shine group overflow-hidden rounded-2xl border border-white/10 bg-[#12141f] transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-950/50"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.coverImage}
          alt={s.titleAr}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <span
          className={`absolute right-2 top-2 rounded-lg px-2 py-1 text-[11px] font-black shadow ${
            s.status === "ongoing"
              ? "bg-emerald-500/90 text-white"
              : s.status === "completed"
                ? "bg-sky-500/90 text-white"
                : "bg-amber-500/90 text-black"
          }`}
        >
          {statusLabel(s.status)}
        </span>
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-[11px] font-black text-amber-300 backdrop-blur">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {Number(s.rating).toFixed(1)}
        </span>
        {s.latestChapter != null && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-violet-600/90 px-2 py-1 text-[11px] font-black text-white shadow">
            <BookOpen className="h-3 w-3" />
            فصل {s.latestChapter}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.8em] text-sm font-black leading-6 text-white transition group-hover:text-amber-300">
          {s.titleAr}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-[11px] font-medium text-slate-500" dir="ltr" style={{ textAlign: "right" }}>
          {s.titleEn}
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {formatViews(s.views)}
          </span>
          {s.genres?.slice(0, 2).map((g) => (
            <span key={g} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
