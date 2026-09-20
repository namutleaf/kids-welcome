import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "아이랑어디가 | 아이와 갈 만한 곳 찾기",
  description:
    "서촌, 성수/서울숲, 해방촌 같은 동네별로 아기의자, 노키즈존 여부, 주차, 즐길거리까지 확인하고 아이와 갈 만한 곳을 찾아보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-teal-200/70 bg-white/80 backdrop-blur sticky top-0 z-10 dark:bg-[#102220]/80 dark:border-teal-900/40">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl" aria-hidden>
                🧸
              </span>
              <span className="text-lg font-bold text-teal-800 dark:text-teal-200">
                아이랑어디가
              </span>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link
                href="/places/new"
                className="rounded-full bg-teal-500 px-4 py-2 font-semibold text-white hover:bg-teal-600 transition-colors"
              >
                장소 제보하기
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-teal-200/70 py-6 text-center text-xs text-teal-800/70 dark:border-teal-900/40 dark:text-teal-200/60">
          아이랑어디가 · 이용자들이 직접 채워가는 아이 동반 장소 정보
        </footer>
      </body>
    </html>
  );
}
