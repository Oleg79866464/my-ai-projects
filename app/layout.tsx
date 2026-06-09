import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Каталог AI-инструментов",
    template: "%s · Каталог AI-инструментов",
  },
  description: "Премиальный русскоязычный каталог AI-инструментов с SSR, SEO, партнёрскими переходами и Supabase.",
  openGraph: {
    title: "Каталог AI-инструментов",
    description: "Премиальный русскоязычный каталог AI-инструментов с SSR, SEO, партнёрскими переходами и Supabase.",
    type: "website",
    locale: "ru_RU",
    siteName: "Каталог AI-инструментов",
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог AI-инструментов",
    description: "Премиальный русскоязычный каталог AI-инструментов с SSR, SEO, партнёрскими переходами и Supabase.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-[#050816] font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
