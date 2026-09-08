import Link from "next/link";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  Server,
  Link2,
  ShieldCheck,
  Cloud,
  ChevronLeft,
  Crown,
  Gift,
} from "lucide-react";

export const dynamic = "force-static";

export default function GuideDomainPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* hero */}
      <div className="overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-bl from-amber-500/15 via-orange-500/5 to-violet-600/10 p-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-4 py-1.5 text-xs font-black text-amber-300">
          <Gift className="h-4 w-4" /> شرح مجاني بالكامل
        </span>
        <h1 className="mt-4 text-2xl font-black leading-snug text-white md:text-4xl md:leading-snug">
          كيف تحصل على دومين مجاني
          <br />
          وتنشر موقع مانجا مثل هذا؟
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          دليل عملي خطوة بخطوة: من امتلاك نطاق مجاني، إلى نشر موقعك على الإنترنت،
          وربط الدومين بموقعك — بدون دفع أي مبلغ.
        </p>
      </div>

      {/* steps */}
      <div className="mt-8 space-y-5">
        <Step
          n={1}
          icon={<Server className="h-5 w-5" />}
          title="انشر موقعك مجاناً أولاً (قبل الدومين)"
          color="violet"
        >
          <p>
            موقع مثل هذا (Next.js) يمكن نشره مجاناً والحصول فوراً على رابط جاهز مثل:
            <code dir="ltr" className="mx-1 rounded bg-black/40 px-2 py-0.5 text-amber-300">olympus-manga.vercel.app</code>
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><Check /> أنشئ حساباً مجانياً على <b>Vercel</b> أو <b>Netlify</b> أو <b>Cloudflare Pages</b></li>
            <li className="flex gap-2"><Check /> ارفع كود الموقع على <b>GitHub</b> ثم اربطه بضغطة واحدة</li>
            <li className="flex gap-2"><Check /> ستحصل على رابط <code dir="ltr" className="rounded bg-black/40 px-1.5 py-0.5 text-[12px] text-emerald-300">*.vercel.app</code> مجاني + شهادة HTTPS مجانية</li>
          </ul>
          <div className="mt-3 rounded-xl bg-sky-500/10 p-3 text-[13px] leading-6 text-sky-200">
            نصيحة: رابط Vercel المجاني يكفي للبداية، ويمكنك ترقيته لدومين خاص لاحقاً بدون تغيير أي شيء في الموقع.
          </div>
        </Step>

        <Step
          n={2}
          icon={<Gift className="h-5 w-5" />}
          title="احصل على دومين مجاني 100%"
          color="amber"
        >
          <p>هذه أشهر الطرق المجانية للحصول على نطاق (رتّبناها من الأفضل):</p>
          <div className="mt-3 space-y-3">
            <Option
              name="نطاق فرعي مجاني من منصات النشر (الأسهل)"
              desc="مثل: manga-team.vercel.app أو olympus.netlify.app — مجاني للأبد، موثوق، ويعمل فوراً بدون أي إعداد."
              tag="موصى به للبداية"
            />
            <Option
              name="Cloudflare + نطاق EU.org المجاني"
              desc="سجّل نطاقاً مجانياً من EU.org (مثل olympus-staff.eu.org) ثم أضفه لـ Cloudflare مجاناً للحصول على حماية وسرعة."
              tag="مجاني تماماً"
            />
            <Option
              name="نطاقات is-a.dev / GitHub Student"
              desc="للمطورين: احصل على yourname.is-a.dev مجاناً عبر GitHub، أو دومين .me مجاني لمدة سنة مع حزمة GitHub Student."
              tag="للمطورين"
            />
            <Option
              name="عروض السنة الأولى (شبه مجاني)"
              desc="مواقع مثل Cloudflare Registrar وPorkbun وNamecheap تقدم نطاقات ‎.xyz و‎.site و‎.online بسعر رمزي (أقل من 1$) للسنة الأولى."
              tag="الأكثر احترافية"
            />
          </div>
          <div className="mt-3 flex gap-2 rounded-xl bg-amber-500/10 p-3 text-[13px] leading-6 text-amber-200">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>تنبيه: خدمات «الدومين المجاني» القديمة مثل Freenom (.tk / .ml / .ga) توقفت أو صارت غير موثوقة — تجنّبها لأن نطاقك قد يُسحب منك في أي لحظة.</span>
          </div>
        </Step>

        <Step
          n={3}
          icon={<Link2 className="h-5 w-5" />}
          title="اربط الدومين بموقعك (5 دقائق)"
          color="emerald"
        >
          <ol className="mt-3 space-y-2.5">
            {[
              "من لوحة Vercel افتح مشروعك ← Settings ← Domains",
              "أدخل الدومين الذي حصلت عليه واضغط Add",
              "ستظهر لك تعليمات DNS: سجل من نوع A أو CNAME",
              "انسخ القيم وأضفها في لوحة تحكم الدومين (أو Cloudflare)",
              "انتظر من 5 دقائق حتى 24 ساعة لانتشار الـ DNS",
              "سيعمل موقعك على دومينك مع HTTPS تلقائياً ومجاناً!",
            ].map((t, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-white/[0.03] p-3 text-[13px] font-bold text-slate-200">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-[11px] font-black text-emerald-300">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </Step>

        <Step
          n={4}
          icon={<Cloud className="h-5 w-5" />}
          title="قاعدة البيانات والصور مجاناً"
          color="sky"
        >
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><Check /> قاعدة البيانات: <b>Neon</b> أو <b>Supabase</b> — خدمة PostgreSQL مجانية (تكفي لآلاف الفصول)</li>
            <li className="flex gap-2"><Check /> الصور: <b>Cloudflare R2</b> (10GB مجاناً) أو <b>Cloudinary</b> — لرفع أغلفة وصفحات الفصول</li>
            <li className="flex gap-2"><Check /> الحماية والسرعة: فعّل <b>Cloudflare</b> المجاني أمام موقعك لتسريع الصور وحمايتها</li>
          </ul>
        </Step>

        <Step
          n={5}
          icon={<Rocket className="h-5 w-5" />}
          title="انطلق واكبر بموقعك"
          color="rose"
        >
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2"><Check /> انشر فصولاً بانتظام — الاستمرارية هي سر نجاح مواقع المانجا</li>
            <li className="flex gap-2"><Check /> أنشئ قناة تيليجرام وسيرفر ديسكورد لفريقك كما يفعل أولمبس ستاف</li>
            <li className="flex gap-2"><Check /> أضف موقعك لمحركات البحث عبر Google Search Console (مجاني)</li>
            <li className="flex gap-2"><Check /> عندما يكبر موقعك، اشترِ دومين ‎.com (حوالي 10$/سنة) ووجّه دومينك المجاني إليه</li>
          </ul>
        </Step>
      </div>

      {/* summary box */}
      <div className="mt-8 rounded-3xl border border-emerald-500/25 bg-emerald-500/[0.07] p-6">
        <h2 className="flex items-center gap-2 text-lg font-black text-emerald-300">
          <ShieldCheck className="h-5 w-5" /> الخلاصة: التكلفة الإجمالية = 0$
        </h2>
        <div className="mt-4 grid gap-2 text-sm font-bold text-slate-200 sm:grid-cols-2">
          <div className="rounded-xl bg-black/30 p-3">الاستضافة: Vercel <span className="text-emerald-300">مجاناً</span></div>
          <div className="rounded-xl bg-black/30 p-3">الرابط: vercel.app <span className="text-emerald-300">مجاناً</span></div>
          <div className="rounded-xl bg-black/30 p-3">الدومين: EU.org <span className="text-emerald-300">مجاناً</span></div>
          <div className="rounded-xl bg-black/30 p-3">قاعدة البيانات: Neon <span className="text-emerald-300">مجاناً</span></div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/series"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 px-6 py-3 text-sm font-black text-white hover:brightness-110"
        >
          <Crown className="h-4 w-4" /> تصفح الموقع كمثال حي
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-white hover:bg-white/10"
        >
          عودة للرئيسية <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
        <Globe className="h-3.5 w-3.5" /> هذا الشرح لأغراض تعليمية — تأكد دائماً من احترام حقوق النشر عند ترجمة الأعمال
      </p>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  color,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  color: "violet" | "amber" | "emerald" | "sky" | "rose";
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    violet: "from-violet-600 to-purple-700 text-violet-200",
    amber: "from-amber-500 to-orange-600 text-amber-200",
    emerald: "from-emerald-500 to-teal-700 text-emerald-200",
    sky: "from-sky-500 to-blue-700 text-sky-200",
    rose: "from-rose-500 to-red-700 text-rose-200",
  };
  return (
    <section className="rounded-2xl border border-white/10 bg-[#12141f] p-6">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
          {icon}
        </span>
        <div>
          <span className="text-[11px] font-black tracking-widest text-slate-500">الخطوة {n}</span>
          <h2 className="text-base font-black text-white md:text-lg">{title}</h2>
        </div>
      </div>
      <div className="mt-4 text-sm leading-7 text-slate-300">{children}</div>
    </section>
  );
}

function Option({ name, desc, tag }: { name: string; desc: string; tag: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black text-white">{name}</p>
        <span className="rounded-full bg-violet-600/20 px-2.5 py-0.5 text-[11px] font-black text-violet-300">{tag}</span>
      </div>
      <p className="mt-1.5 text-[13px] leading-6 text-slate-400">{desc}</p>
    </div>
  );
}

function Check() {
  return <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />;
}
