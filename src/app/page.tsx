import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Prashant’s Lab Notes
        </h1>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          A place for science mysteries, AI experiments, and curiosity-driven writing.
        </p>

        <div className="mt-8">
          <Link
            href="/mysteries"
            className="inline-flex items-center rounded-2xl border px-5 py-3 hover:bg-muted/40 transition-colors"
          >
            Explore Mysteries →
          </Link>
        </div>
      </div>
    </div>
  );
}
