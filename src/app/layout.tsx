import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أولمبس ستاف | Olympus Staff - مانجا مترجمة",
  description:
    "افضل موقع للمانجا المترجمة يضم مكتبة هائلة من المانهوا والمانجا المترجمة بجودة عالية وسرعة في ترجمة الفصول الجديدة.",
  keywords: ["مانجا", "مانهوا", "مانجا مترجمة", "أولمبس", "فصول", "قراءة"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} min-h-screen bg-[#0b0d17] text-slate-100 antialiased`}>
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
