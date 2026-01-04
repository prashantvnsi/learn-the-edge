"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/articleSchema";

type Mode = "quick" | "deep" | "learn";

export default function ReaderModes({ article }: { article: Article }) {
    const [mode, setMode] = useState<Mode>("deep");

    const hasQuick = useMemo(() => {
        const q = article.quick;
        return Boolean(q?.tldr) || (q?.keyPoints?.length ?? 0) > 0 || (q?.whatWouldChangeOurMind?.length ?? 0) > 0;
    }, [article.quick]);

    const hasLearn = useMemo(() => {
        const l = article.learn;
        return (l?.prerequisites?.length ?? 0) > 0 || (l?.learningPath?.length ?? 0) > 0 || (l?.practiceQuestions?.length ?? 0) > 0;
    }, [article.learn]);

    return (
        <div className="mt-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                <TabButton active={mode === "quick"} onClick={() => setMode("quick")} label="Quick" disabled={!hasQuick} />
                <TabButton active={mode === "deep"} onClick={() => setMode("deep")} label="Deep" />
                <TabButton active={mode === "learn"} onClick={() => setMode("learn")} label="Learn" disabled={!hasLearn} />
            </div>

            {/* Panels */}
            {mode === "quick" && (
                <div className="mt-6 space-y-6">
                    <Panel title="TL;DR">
                        <p className="text-muted-foreground leading-relaxed">
                            {article.quick?.tldr || "Quick mode isn’t available yet for this article. Open Deep or Learn."}
                        </p>
                    </Panel>

                    <Panel title="Key points">
                        {article.quick?.keyPoints?.length ? (
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                {article.quick.keyPoints.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No key points available yet.</p>
                        )}
                    </Panel>

                    <Panel title="What would change our mind?">
                        {article.quick?.whatWouldChangeOurMind?.length ? (
                            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                {article.quick.whatWouldChangeOurMind.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No falsifiable tests listed yet.</p>
                        )}
                    </Panel>
                </div>
            )}

            {mode === "deep" && (
                <div className="mt-8 space-y-10">
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
                </div>
            )}

            {mode === "learn" && (
                <div className="mt-6 space-y-6">
                    <Panel title="Prerequisites (you’ll understand the article better if you know these)">
                        {article.learn?.prerequisites?.length ? (
                            <div className="space-y-3">
                                {article.learn.prerequisites.map((p) => (
                                    <div key={p.term} className="rounded-2xl border bg-muted/10 p-4">
                                        <div className="font-medium">{p.term}</div>
                                        <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.explanation}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No prerequisites available yet.</p>
                        )}
                    </Panel>

                    <Panel title="Learning path (Beginner → Advanced)">
                        {article.learn?.learningPath?.length ? (
                            <div className="space-y-2">
                                {article.learn.learningPath.map((l, idx) => (
                                    <a
                                        key={`${l.url}-${idx}`}
                                        href={l.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-2xl border bg-muted/10 p-4 hover:bg-muted/20 transition"
                                    >
                                        <div className="text-xs text-muted-foreground">{l.level}</div>
                                        <div className="mt-1 font-medium">{l.title}</div>
                                        <div className="mt-1 text-xs text-muted-foreground break-all">{l.url}</div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No learning path links available yet.</p>
                        )}
                    </Panel>

                    <Panel title="Practice questions (expand to reveal answers)">
                        {article.learn?.practiceQuestions?.length ? (
                            <div className="space-y-3">
                                {article.learn.practiceQuestions.map((qa, idx) => (
                                    <details key={idx} className="rounded-2xl border bg-muted/10 p-4">
                                        <summary className="cursor-pointer font-medium">{qa.question}</summary>
                                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{qa.answer}</div>
                                    </details>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No practice questions available yet.</p>
                        )}
                    </Panel>
                </div>
            )}
        </div>
    );
}

function TabButton({
    label,
    active,
    onClick,
    disabled,
}: {
    label: string;
    active?: boolean;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={[
                "rounded-full border px-4 py-2 text-sm transition",
                disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/30",
                active ? "bg-muted" : "",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border bg-background p-6">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="mt-3">{children}</div>
        </div>
    );
}
