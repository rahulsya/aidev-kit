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
  title: "DevKit AI",
  description: "Test app for ai-cost-tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight text-blue-600">
              DevKit AI
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/cover-letter" className="hover:text-blue-600 transition-colors">Cover Letter</Link>
              <Link href="/sql-explainer" className="hover:text-blue-600 transition-colors">SQL Explainer</Link>
              <Link href="/code-reviewer" className="hover:text-blue-600 transition-colors">Code Reviewer</Link>
              <Link href="/email-drafter" className="hover:text-blue-600 transition-colors">Email Drafter</Link>
              <Link href="/restaurant-finder" className="hover:text-blue-600 transition-colors">Restaurant Finder</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
