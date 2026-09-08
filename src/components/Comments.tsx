"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, Loader2, ThumbsUp } from "lucide-react";
import { avatarColorFor, getUserName, setUserName, timeAgo } from "@/lib/utils";

type Comment = {
  id: number;
  userName: string;
  avatarColor: string | null;
  content: string;
  likes: number;
  createdAt: string;
};

export default function Comments({
  seriesId,
  chapterId,
}: {
  seriesId?: number;
  chapterId?: number;
}) {
  const [list, setList] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const query = seriesId
    ? `seriesId=${seriesId}`
    : chapterId
      ? `chapterId=${chapterId}`
      : "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?${query}`);
      const d = await res.json();
      if (d.ok) setList(d.comments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setName(getUserName());
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSending(true);
    try {
      setUserName(name.trim());
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seriesId,
          chapterId,
          userName: name.trim(),
          content: content.trim(),
        }),
      });
      const d = await res.json();
      if (d.ok) {
        setContent("");
        load();
      }
    } finally {
      setSending(false);
    }
  };

  const like = async (id: number) => {
    await fetch(`/api/comments/${id}/like`, { method: "POST" });
    setList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141f] p-5">
      <h3 className="flex items-center gap-2 text-lg font-black text-white">
        <MessageSquare className="h-5 w-5 text-violet-400" />
        التعليقات
        <span className="rounded-full bg-violet-600/20 px-2.5 py-0.5 text-xs font-black text-violet-300">
          {list.length}
        </span>
      </h3>

      <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="grid gap-3 md:grid-cols-[200px_1fr]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك..."
            maxLength={40}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500/60"
          />
          <div className="text-xs font-bold text-slate-500 flex items-center">
            تعليقك سيظهر باسمك — كن محترماً وتجنب الحرق بدون تحذير
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="شارك رأيك حول العمل أو الفصل..."
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 outline-none focus:border-violet-500/60"
        />
        <button
          disabled={sending || !name.trim() || !content.trim()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-black text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          نشر التعليق
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" /> جارٍ تحميل التعليقات...
          </div>
        ) : list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-slate-500">
            لا توجد تعليقات بعد — كن أول من يشارك رأيه!
          </p>
        ) : (
          list.map((c) => (
            <div key={c.id} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-black text-white ${c.avatarColor || avatarColorFor(c.userName)}`}
              >
                {c.userName.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-white">{c.userName}</span>
                  <span className="text-[11px] font-bold text-slate-500">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-7 text-slate-300">{c.content}</p>
                <button
                  onClick={() => like(c.id)}
                  className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-400 transition hover:bg-violet-600/20 hover:text-violet-300"
                >
                  <ThumbsUp className="h-3.5 w-3.5" /> {c.likes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
