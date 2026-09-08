"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, ArrowUp } from "lucide-react";

export default function ReaderControls() {
  const [width, setWidth] = useState(768);

  const apply = (w: number) => {
    setWidth(w);
    const el = document.getElementById("reader-pages");
    if (el) el.style.maxWidth = `${w}px`;
  };

  return (
    <div className="sticky top-[118px] z-30 mx-auto flex max-w-3xl justify-center px-4 pb-3">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0b0d17]/90 p-1 shadow-xl backdrop-blur">
        <button
          onClick={() => apply(Math.min(1024, width + 96))}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ZoomIn className="h-3.5 w-3.5" /> توسيع
        </button>
        <button
          onClick={() => apply(Math.max(480, width - 96))}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ZoomOut className="h-3.5 w-3.5" /> تضييق
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ArrowUp className="h-3.5 w-3.5" /> للأعلى
        </button>
      </div>
    </div>
  );
}
