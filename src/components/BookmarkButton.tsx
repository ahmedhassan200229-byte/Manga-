"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { getUserKey } from "@/lib/utils";

export default function BookmarkButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = getUserKey();
    fetch(`/api/bookmarks?userKey=${key}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.slugs) && d.slugs.includes(slug)) setSaved(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, userKey: getUserKey() }),
      });
      const d = await res.json();
      if (d.ok) setSaved(!saved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
        saved
          ? "bg-amber-500/15 text-amber-300 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35)] hover:bg-amber-500/25"
          : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {saved ? "في مكتبتي" : "أضف للمكتبة"}
    </button>
  );
}
