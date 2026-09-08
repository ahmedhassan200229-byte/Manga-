"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, Loader2, Library } from "lucide-react";
import SeriesCard from "@/components/SeriesCard";
import { getUserKey } from "@/lib/utils";

type Item = {
  slug: string;
  titleAr: string;
  titleEn: string;
  coverImage: string;
  rating: number;
  views: number;
  status: string;
  type: string;
  id: number;
};

export default function BookmarksPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookmarks?userKey=${getUserKey()}`);
      const d = await res.json();
      if (d.ok) setItems(d.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (slug: string) => {
    await fetch("/api/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, userKey: getUserKey() }),
    });
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="flex items-center gap-2 text-2xl font-black text-white md:text-3xl">
        <Bookmark className="h-7 w-7 text-amber-400" />
        مكتبتي
      </h1>
      <p className="mt-1 text-sm font-bold text-slate-500">
        الأعمال المحفوظة على هذا الجهاز — تُحفظ تلقائياً وتظهر هنا
      </p>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" /> جارٍ تحميل مكتبتك...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <Library className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-4 text-lg font-black text-white">مكتبتك فارغة</p>
          <p className="mt-2 text-sm text-slate-500">
            تصفح الأعمال واضغط «أضف للمكتبة» لحفظ ما يعجبك هنا
          </p>
          <Link
            href="/series"
            className="mt-5 inline-block rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-black text-white"
          >
            تصفح المكتبة
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((s) => (
            <div key={s.slug} className="relative">
              <SeriesCard
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
                }}
              />
              <button
                onClick={() => remove(s.slug)}
                title="إزالة من المكتبة"
                className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/70 text-rose-300 backdrop-blur transition hover:bg-rose-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
