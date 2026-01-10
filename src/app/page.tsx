import Link from "next/link";
import LatestAI from "@/components/mysteries/LatestAI";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <div className="rounded-3xl border bg-gradient-to-br from-slate-900/30 via-background to-slate-900/20 p-8 md:p-12">
          <div className="text-sm text-muted-foreground">Learn the Edge</div>

          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">
            Learn by reading, exploring, and experimenting
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground text-base md:text-lg">
            Clear explainers, practical demos, and curated resources — powered by an AI pipeline
            that generates once and serves fast from cache.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/mysteries"
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm hover:bg-muted/30 transition"
            >
              Explore topics →
            </Link>

            <Link
              href="/mysteries?cat=ai"
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm hover:bg-muted/30 transition"
            >
              AI & Computing →
            </Link>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Next.js • Groq • Upstash Redis • schema validation • caching
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl">
              <CardContent className="p-6 md:p-8 space-y-2">
                <div className="text-sm text-muted-foreground">What you’ll find</div>
                <div className="text-xl md:text-2xl font-semibold">A learning hub</div>

                <ul className="mt-3 list-disc pl-5 text-muted-foreground space-y-2">
                  <li>
                    <span className="text-foreground font-medium">Explainers</span> — structured articles on hard topics.
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Experiments</span> — interactive demos and practical intuition.
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Learning paths</span> — prerequisites + curated links + practice questions.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardContent className="p-6 md:p-8 space-y-2">
                <div className="text-sm text-muted-foreground">How it works</div>
                <div className="text-xl md:text-2xl font-semibold">Generate once, read forever</div>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  The first reader triggers AI generation. The output is validated, cleaned, cached in Redis,
                  and served instantly for everyone after.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <LatestAI />
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Learn the Edge
        </div>
      </div>
    </div>
  );
}
