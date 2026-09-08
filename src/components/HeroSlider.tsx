"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Eye, BookOpen, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { formatViews } from "@/lib/utils";

export type HeroItem = {
  id: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  description: string;
  coverImage: string;
  rating: number;
  views: number;
  genres: string[];
  latestChapter?: number | null;
};

export default function HeroSlider({ items }: { items: HeroItem[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) return null;
  const s = items[i];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={s.id}
          src={s.coverImage}
          alt=""
          className="h-full w-full scale-110 object-cover object-top opacity-30 blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0b0d17] via-[#0b0d17]/85 to-[#0b0d17]/40" />
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.25),transparent_55%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-10 md:grid-cols-[220px_1fr] md:pt-14 lg:grid-cols-[260px_1fr]">
        <div className="mx-auto hidden w-full md:block">
          <div className="animate-float-slow overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`c-${s.id}`}
              src={s.coverImage}
              alt={s.titleAr}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>

        <div key={`t-${s.id}`} className="animate-fade-up flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-l from-amber-500 to-orange-500 px-3 py-1 text-xs font-black text-black">
              <Flame className="h-3.5 w-3.5" /> مميز
            </span>
            {s.genres.slice(0, 4).map((g) => (
              <Link
                key={g}
                href={`/series?genre=${encodeURIComponent(g)}`}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur transition hover:border-amber-400/50 hover:text-amber-300"
              >
                {g}
              </Link>
            ))}
          </div>

          <h1 className="text-2xl font-black leading-snug text-white md:text-4xl md:leading-snug">
            {s.titleAr}
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-400" dir="ltr" style={{ textAlign: "right" }}>
            {s.titleEn}
          </p>
          <p className="line-clamp-3 mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-[15px]">
            {s.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {Number(s.rating).toFixed(1)} / 10
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Eye className="h-4 w-4" /> {formatViews(s.views)} مشاهدة
            </span>
            {s.latestChapter != null && (
              <span className="flex items-center gap-1.5 text-violet-300">
                <BookOpen className="h-4 w-4" /> {s.latestChapter} فصل
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/series/${s.slug}`}
              className="animate-glow rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 px-7 py-3 text-sm font-black text-white transition hover:brightness-110"
            >
              اقرأ الآن
            </Link>
            <Link
              href={`/series/${s.slug}#chapters`}
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/10"
            >
              قائمة الفصول
            </Link>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={() => setI((i - 1 + items.length) % items.length)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-violet-600"
              aria-label="السابق"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setI((i + 1) % items.length)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-violet-600"
              aria-label="التالي"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  onClick={() => setI(idx)}
                  aria-label={`شريحة ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === i ? "w-8 bg-amber-400" : "w-2 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <span className="ms-auto text-xs font-bold text-slate-500">
              {i + 1} / {items.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
