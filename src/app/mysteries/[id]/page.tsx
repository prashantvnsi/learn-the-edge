import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrGenerateArticle } from "@/lib/getOrGenerateArticle";

export default async function MysteryArticlePage(
    props: { params: Promise<{ id: string }> } // <-- params is async in your Next version
) {
    const { id } = await props.params;         // <-- unwrap it
    const { article, fromCache } = await getOrGenerateArticle(id);

    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/mysteries" className="text-sm text-muted-foreground hover:underline">
                        ← Back to Mysteries
                    </Link>
                    <div className="text-xs text-muted-foreground">
                        {fromCache ? "Cached" : "Freshly generated"}
                    </div>
                </div>

                <h1 className="mt-6 text-3xl md:text-5xl font-semibold leading-tight">{article.title}</h1>
                {article.subtitle && (
                    <p className="mt-3 text-muted-foreground text-base md:text-lg">{article.subtitle}</p>
                )}

                <div className="mt-3 text-sm text-muted-foreground">{article.readingMinutes} min read</div>

                <div className="mt-8 rounded-3xl border bg-muted/30 p-6">
                    <div className="text-xs text-muted-foreground">Hero image idea</div>
                    <div className="mt-1 text-sm">{article.hero.alt}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Query: {article.hero.unsplashQuery}</div>
                </div>

                <article className="mt-10 space-y-10">
                    {article.sections.map((s) => (
                        <section key={s.heading} className="space-y-3">
                            <h2 className="text-xl md:text-2xl font-semibold">{s.heading}</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                {s.paragraphs.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </section>
                    ))}
                </article>

                <div className="mt-12 space-y-3">
                    <h3 className="text-lg font-semibold">Key takeaways</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                        {article.keyTakeaways.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </div>

                <div className="mt-12 space-y-3">
                    <h3 className="text-lg font-semibold">Sources</h3>
                    <ul className="space-y-2 text-sm">
                        {article.sources.map((s) => (
                            <li key={s.url}>
                                <a className="underline text-muted-foreground hover:text-foreground" href={s.url} target="_blank">
                                    {s.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
