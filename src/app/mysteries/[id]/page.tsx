import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrGenerateArticle } from "@/lib/getOrGenerateArticle";
import ReaderModes from "@/components/mysteries/ReaderModes";

export default async function MysteryArticlePage(props: any) {
    try {
        // Next 15: params/searchParams can be Promises in Server Components
        const params = await Promise.resolve(props.params);
        const searchParams = await Promise.resolve(props.searchParams);

        const id = params?.id as string;
        const style = (searchParams?.style as string) || "default";

        const { article, fromCache } = await getOrGenerateArticle(id, style);

        return (
            <div className="min-h-screen">
                <div className="mx-auto max-w-3xl px-4 py-10">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/mysteries" className="text-sm text-muted-foreground hover:underline">
                            ← Back to Explore
                        </Link>

                        <div className="text-xs text-muted-foreground text-right">
                            <div>
                                {fromCache ? "Cached" : "Freshly generated"}
                                {article.meta?.generatedAt ? ` • ${new Date(article.meta.generatedAt).toLocaleString()}` : ""}
                            </div>
                            <div className="mt-1">
                                {article.meta?.model ? `Model: ${article.meta.model}` : null}
                                {article.meta?.style ? ` • Style: ${article.meta.style}` : style ? ` • Style: ${style}` : ""}
                                {article.meta?.cacheVersion ? ` • Cache: ${article.meta.cacheVersion}` : null}
                            </div>
                        </div>
                    </div>

                    <h1 className="mt-6 text-3xl md:text-5xl font-semibold leading-tight">{article.title}</h1>
                    {article.subtitle ? (
                        <p className="mt-3 text-muted-foreground text-base md:text-lg">{article.subtitle}</p>
                    ) : null}

                    <div className="mt-3 text-sm text-muted-foreground">{article.readingMinutes} min read</div>

                    {/* Hero placeholder */}
                    <div className="mt-8 rounded-3xl border bg-muted/30 p-6">
                        <div className="text-xs text-muted-foreground">Hero image idea</div>
                        <div className="mt-1 text-sm">{article.hero?.alt}</div>
                        <div className="mt-2 text-xs text-muted-foreground">Query: {article.hero?.unsplashQuery}</div>
                    </div>

                    {/* ✅ Quality panel (NOW it actually renders) */}
                    <div className="mt-6 rounded-3xl border p-4">
                        <div className="flex items-center justify-between">
                            <div className="font-medium">Quality</div>
                            <div className="text-sm text-muted-foreground">
                                {article.quality ? `${article.quality.grade} (${article.quality.score}/100)` : "—"}
                            </div>
                        </div>

                        {article.quality?.issues?.length ? (
                            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                {article.quality.issues.slice(0, 6).map((i: any) => (
                                    <li key={`${i.code}-${i.message}`}>
                                        <span className="font-medium text-foreground">{String(i.severity).toUpperCase()}</span>{" "}
                                        {i.message}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="mt-2 text-sm text-muted-foreground">No issues detected.</div>
                        )}
                    </div>

                    {/* ✅ Reader modes */}
                    <ReaderModes article={article} />

                    {/* Takeaways */}
                    {article.keyTakeaways?.length ? (
                        <div className="mt-12 space-y-3">
                            <h3 className="text-lg font-semibold">Key takeaways</h3>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                {article.keyTakeaways.map((x: string) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* Sources */}
                    {article.sources?.length ? (
                        <div className="mt-12 space-y-3">
                            <h3 className="text-lg font-semibold">Sources</h3>
                            <ul className="space-y-2 text-sm">
                                {article.sources.map((s: any) => (
                                    <li key={s.url}>
                                        <a
                                            className="underline text-muted-foreground hover:text-foreground"
                                            href={s.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    } catch {
        notFound();
    }
}
