export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

export function statusLabel(status: string): string {
  switch (status) {
    case "ongoing":
      return "مستمرة";
    case "completed":
      return "مكتملة";
    case "hiatus":
      return "متوقفة";
    default:
      return status;
  }
}

export function typeLabel(type: string): string {
  switch (type) {
    case "manhwa":
      return "مانهوا";
    case "manga":
      return "مانجا";
    case "manhua":
      return "مانها";
    case "novel":
      return "رواية";
    default:
      return type;
  }
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;
  const months = Math.floor(days / 30);
  if (months < 12) return `منذ ${months} شهر`;
  return `منذ ${Math.floor(months / 12)} سنة`;
}

export function getUserKey(): string {
  if (typeof window === "undefined") return "server";
  let key = localStorage.getItem("olympus_user_key");
  if (!key) {
    key = `u_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem("olympus_user_key", key);
  }
  return key;
}

export function getUserName(): string {
  if (typeof window === "undefined") return "زائر";
  return localStorage.getItem("olympus_user_name") || "";
}

export function setUserName(name: string) {
  localStorage.setItem("olympus_user_name", name);
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-700",
  "from-amber-500 to-orange-700",
  "from-emerald-500 to-teal-700",
  "from-rose-500 to-red-700",
  "from-sky-500 to-blue-700",
  "from-fuchsia-500 to-pink-700",
];

export function avatarColorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
