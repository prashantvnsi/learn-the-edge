import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Learn the Edge",
  description: "Clear explainers, practical demos, and curated resources.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            {/* Brand */}
            <Link href="/" className="font-semibold tracking-tight">
              Learn the Edge
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-4 text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="/mysteries">
                Explore
              </Link>

              <Link className="text-muted-foreground hover:text-foreground" href="/mysteries?cat=ai">
                AI
              </Link>

              <a
                className="text-muted-foreground hover:text-foreground"
                href="https://github.com/prashantvnsi/learn-the-edge"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Learn the Edge</div>
            <div className="flex gap-3">
              <Link className="hover:text-foreground" href="/mysteries">
                Explore
              </Link>
              <a
                className="hover:text-foreground"
                href="https://github.com/prashantvnsi/learn-the-edge"
                target="_blank"
                rel="noreferrer"
              >
                Source
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
