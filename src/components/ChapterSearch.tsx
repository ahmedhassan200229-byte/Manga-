"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function ChapterSearch() {
  const [q, setQ] = useState("");

  const onChange = (v: string) => {
    setQ(v);
    const rows = document.querySelectorAll<HTMLElement>(".chapter-row");
    rows.forEach((r) => {
      const num = r.dataset.chapter || "";
      r.style.display = !v || num.includes(v.trim()) ? "" : "none";
    });
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      <input
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="رقم الفصل..."
        inputMode="numeric"
        className="w-36 rounded-xl border border-white/10 bg-white/5 py-2 pe-9 ps-3 text-xs font-bold text-white placeholder:text-slate-500 outline-none focus:border-violet-500/60"
      />
    </div>
  );
}
