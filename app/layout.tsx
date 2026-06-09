import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "AI Catalog RU",
    template: "%s | AI Catalog — нейросети для маркетинга",
  },
  description: "Проверенные ИИ-инструменты для создания контента: текст, видео, изображения. Бесплатно и с партнёрскими скидками.",
  alternates: {
    languages: {
      "ru-RU": "/",
    },
  },
  openGraph: {
    locale: "ru_RU",
    siteName: "AI Catalog RU",
    type: "website",
    title: "AI Catalog RU",
    description: "Проверенные ИИ-инструменты для создания контента: текст, видео, изображения. Бесплатно и с партнёрскими скидками.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-[#050816] font-sans text-slate-100 antialiased">{children}</body>
    </html>
  );
}
