"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug, chapterId }: { slug?: string; chapterId?: number }) {
  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, chapterId }),
    }).catch(() => {});
  }, [slug, chapterId]);
  return null;
}
