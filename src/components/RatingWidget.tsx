"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { getUserKey } from "@/lib/utils";

export default function RatingWidget({
  slug,
  rating,
  count,
}: {
  slug: string;
  rating: number;
  count: number;
}) {
  const [val, setVal] = useState(0);
  const [hover, setHover] = useState(0);
  const [avg, setAvg] = useState(rating);
  const [total, setTotal] = useState(count);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (v: number) => {
    setVal(v);
    setLoading(true);
    try {
      const res = await fetch(`/api/series/${slug}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: v, userKey: getUserKey() }),
      });
      const data = await res.json();
      if (data.ok) {
        setAvg(data.rating);
        setTotal(data.count);
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <p className="text-3xl font-black text-amber-300">{Number(avg).toFixed(1)}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{total} تقييم</p>
      <div className="mt-3 flex justify-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => submit(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            disabled={loading}
            aria-label={`قيّم ${n}`}
            className="transition-transform hover:scale-125"
          >
            <Star
              className={`h-4 w-4 ${
                n <= (hover || val || Math.round(avg))
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-600"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-bold text-slate-500">
        {done ? "شكراً! تم حفظ تقييمك" : "اضغط على نجمة لتقييم العمل (1 - 10)"}
      </p>
    </div>
  );
}
