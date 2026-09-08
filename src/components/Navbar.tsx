"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Home,
  Library,
  Bookmark,
  Globe,
  Menu,
  X,
  Zap,
  Crown,
} from "lucide-react";

const links = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/series", label: "المكتبة", icon: Library },
  { href: "/bookmarks", label: "مكتبتي", icon: Bookmark },
  { href: "/guide-domain", label: "دومين مجاني", icon: Globe },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/series?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled
          ? "border-white/10 bg-[#0b0d17]/90 backdrop-blur-xl shadow-lg shadow-black/40"
          : "border-white/5 bg-[#0b0d17]/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 shadow-lg shadow-violet-900/50">
            <Crown className="h-5 w-5 text-amber-300" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-white">
              أولمبس <span className="text-amber-400">ستاف</span>
            </span>
            <span className="block text-[11px] font-semibold tracking-[0.25em] text-violet-300/80">
              OLYMPUS STAFF
            </span>
          </span>
        </Link>

        <nav className="mx-4 hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-violet-600/20 text-amber-300 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.25)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={submit} className="ms-auto hidden min-w-0 flex-1 max-w-sm items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن مانهوا، مانجا..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pe-10 ps-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-violet-600/30"
            />
          </div>
        </form>

        <Link
          href="/series"
          className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-black text-black shadow-lg shadow-orange-900/40 transition hover:brightness-110 md:flex"
        >
          <Zap className="h-4 w-4" />
          ابدأ القراءة
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
          aria-label="القائمة"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0e1120] p-4 lg:hidden">
          <form onSubmit={submit} className="mb-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pe-10 ps-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500/60"
              />
            </div>
            <button className="rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">
              بحث
            </button>
          </form>
          <div className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold ${
                  pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                    ? "bg-violet-600/20 text-amber-300"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
