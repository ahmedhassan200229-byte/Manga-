import Link from "next/link";
import { Crown, Send, MessageCircle, Globe, Heart, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#080a12]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 shadow-lg shadow-violet-900/50">
              <Crown className="h-5 w-5 text-amber-300" />
            </span>
            <span>
              <span className="block text-xl font-black text-white">
                أولمبس <span className="text-amber-400">ستاف</span>
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.3em] text-violet-300/70">
                OLYMPUS STAFF
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            أفضل موقع للمانجا المترجمة — مكتبة هائلة من المانهوا والمانجا والمانها
            المترجمة بجودة عالية، مع سرعة في ترجمة الفصول الجديدة وتجربة قراءة
            مريحة على جميع الأجهزة.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="#"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-sky-500/50 hover:text-sky-300"
            >
              <Send className="h-4 w-4" /> تيليجرام
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-indigo-500/50 hover:text-indigo-300"
            >
              <MessageCircle className="h-4 w-4" /> ديسكورد
            </a>
            <Link
              href="/guide-domain"
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20"
            >
              <Globe className="h-4 w-4" /> دومين مجاني
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 flex items-center gap-2 text-sm font-black text-white">
            <BookOpen className="h-4 w-4 text-violet-400" /> أقسام الموقع
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link className="hover:text-amber-300" href="/">الرئيسية</Link></li>
            <li><Link className="hover:text-amber-300" href="/series">جميع الأعمال</Link></li>
            <li><Link className="hover:text-amber-300" href="/series?type=manhwa">مانهوا كورية</Link></li>
            <li><Link className="hover:text-amber-300" href="/series?type=manga">مانجا يابانية</Link></li>
            <li><Link className="hover:text-amber-300" href="/bookmarks">مكتبتي</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-black text-white">التصنيفات الرائجة</h4>
          <div className="flex flex-wrap gap-2">
            {["أكشن", "خيال", "دراما", "كوميدي", "غموض", "رومانسي", "إثارة", "مغامرات"].map(
              (g) => (
                <Link
                  key={g}
                  href={`/series?genre=${encodeURIComponent(g)}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-violet-500/50 hover:text-violet-300"
                >
                  {g}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 md:flex-row">
          <p>© 2026 أولمبس ستاف — جميع الحقوق محفوظة</p>
          <p className="flex items-center gap-1">
            صُنع بـ <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> لعشاق المانجا العرب
          </p>
        </div>
      </div>
    </footer>
  );
}
