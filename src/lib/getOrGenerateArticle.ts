import OpenAI from "openai";
import { redis } from "@/lib/redis";
import { ArticleSchema, type Article } from "@/lib/articleSchema";
import { TOPICS } from "@/lib/mysteryTopics";

const CACHE_VERSION = "v2";

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1",
});

function cacheKey(id: string, style: string) {
    return `mystery:${CACHE_VERSION}:${id}:style:${style}`;
}
function lockKey(id: string, style: string) {
    return `mystery:${CACHE_VERSION}:${id}:style:${style}:lock`;
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function normalizeId(id: string) {
    return decodeURIComponent(String(id ?? ""))
        .trim()
        .toLowerCase();
}

function asString(x: any, fallback = "") {
    const s = String(x ?? "").trim();
    return s || fallback;
}

function asStringArray(x: any) {
    return Array.isArray(x) ? x.map((v) => String(v ?? "").trim()).filter(Boolean) : [];
}

function clampArray<T>(arr: T[], min: number, max: number) {
    const a = arr.slice(0, max);
    // Don't auto-pad with junk by default; caller decides if they want padding.
    return a.length < min ? a : a;
}

export async function getOrGenerateArticle(
    id: string,
    style: string = "default"
): Promise<{ article: Article; fromCache: boolean }> {
    const normalizedId = normalizeId(id);
    const normalizedStyle = normalizeId(style) || "default";

    // ✅ topic lookup should use normalized id
    const topic = TOPICS.find((m) => m.id === normalizedId);
    if (!topic) throw new Error("Unknown topic id");

    // 1) Cache hit?
    const cached = await redis.get<Article>(cacheKey(normalizedId, normalizedStyle));
    if (cached) return { article: cached, fromCache: true };

    // 2) Acquire lock
    const gotLock = await redis.set(lockKey(normalizedId, normalizedStyle), "1", { nx: true, ex: 60 });

    if (gotLock !== "OK") {
        for (let i = 0; i < 12; i++) {
            await sleep(1000);
            const c2 = await redis.get<Article>(cacheKey(normalizedId, normalizedStyle));
            if (c2) return { article: c2, fromCache: true };
        }
        // If still not ready, fall through and attempt generation.
    }

    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    const modelUsed = model;

    const system = [
        "You write vivid, accurate science explainer articles.",
        "Return ONLY valid JSON (no markdown).",
        "The JSON MUST follow the requested shape.",
        "Include the word JSON in your output requirements.",
    ].join(" ");

    const styleInstruction =
        normalizedStyle === "short"
            ? "Write a shorter version. Keep sections tighter. Prefer punchy paragraphs."
            : normalizedStyle === "eli12"
                ? "Explain like the reader is 12. Use simple language and everyday examples."
                : normalizedStyle === "technical"
                    ? "Make it more technical. Include more precise language and mechanisms."
                    : normalizedStyle === "analogies"
                        ? "Use more analogies and vivid mental pictures, while staying accurate."
                        : "Write a balanced, magazine-style explainer.";

    const user = `
Write a blog-style article about this open scientific mystery.

STYLE:
${styleInstruction}

Topic:
- id: ${topic.id}
- title: ${topic.title}
- hook: ${topic.hook}
- category: ${topic.category}
- difficulty (1-5): ${topic.difficulty ?? 3}

What we know:
${(topic.known ?? []).map((x) => `- ${x}`).join("\n")}

What we don't know:
${(topic.unknown ?? []).map((x) => `- ${x}`).join("\n")}

Leading hypotheses:
${(topic.hypotheses ?? []).map((x) => `- ${x}`).join("\n")}

How to test / move forward:
${(topic.howToTest ?? []).map((x) => `- ${x}`).join("\n")}

Return JSON with this shape:
{
  "id": string,
  "title": string,
  "subtitle": string,
  "readingMinutes": number,
  "hero": { "unsplashQuery": string, "alt": string },
  "quick": {
    "tldr": string,
    "keyPoints": string[],
    "whatWouldChangeOurMind": string[]
  },
  "sections": [ { "heading": string, "paragraphs": string[] } ],
  "learn": {
    "prerequisites": [ { "term": string, "explanation": string } ],
    "learningPath": [ { "level": "Beginner"|"Intermediate"|"Advanced", "title": string, "url": string } ],
    "practiceQuestions": [ { "question": string, "answer": string } ]
  },
  "keyTakeaways": string[],
  "sources": [ { "label": string, "url": string } ]
}

Constraints:
- 4 to 7 sections, each section 2-4 paragraphs.
- paragraphs array must never be empty.
- Keep it exciting, but avoid fake certainty.
- Output MUST be valid JSON ONLY.
- quick.keyPoints: 3–8 items
- quick.whatWouldChangeOurMind: 2–6 items
- learn.prerequisites: 3–10 items
- learn.learningPath: 3–12 items (use reputable sources; URLs must look real)
- learn.practiceQuestions: 3–8 items
`.trim();

    try {
        const resp = await groq.chat.completions.create({
            model,
            temperature: 0.7,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });

        const content = resp.choices?.[0]?.message?.content ?? "";
        let parsed: unknown;
        try {
            parsed = JSON.parse(content);
        } catch {
            throw new Error("Model did not return valid JSON");
        }

        const obj = parsed as any;

        // ✅ sanitize sections
        const sections = Array.isArray(obj?.sections) ? obj.sections : [];
        const cleanedSections = sections
            .map((s: any) => ({
                heading: asString(s?.heading, "Untitled section"),
                paragraphs: asStringArray(s?.paragraphs),
            }))
            .filter((s: any) => s.paragraphs.length >= 1);

        if (cleanedSections.length === 0) {
            throw new Error("MODEL_SECTIONS_EMPTY");
        }

        // ✅ sanitize quick/learn with minimum content fallback (avoid Zod fails)
        const quickKeyPoints = asStringArray(obj?.quick?.keyPoints).slice(0, 8);
        const quickMindChanges = asStringArray(obj?.quick?.whatWouldChangeOurMind).slice(0, 6);

        const prerequisites = Array.isArray(obj?.learn?.prerequisites)
            ? obj.learn.prerequisites
                .map((p: any) => ({
                    term: asString(p?.term),
                    explanation: asString(p?.explanation),
                }))
                .filter((p: any) => p.term && p.explanation)
                .slice(0, 10)
            : [];

        const learningPath = Array.isArray(obj?.learn?.learningPath)
            ? obj.learn.learningPath
                .map((l: any) => ({
                    level:
                        l?.level === "Beginner" || l?.level === "Intermediate" || l?.level === "Advanced"
                            ? l.level
                            : "Beginner",
                    title: asString(l?.title),
                    url: asString(l?.url),
                }))
                .filter((l: any) => l.title && l.url)
                .slice(0, 12)
            : [];

        const practiceQuestions = Array.isArray(obj?.learn?.practiceQuestions)
            ? obj.learn.practiceQuestions
                .map((qa: any) => ({
                    question: asString(qa?.question),
                    answer: asString(qa?.answer),
                }))
                .filter((qa: any) => qa.question && qa.answer)
                .slice(0, 8)
            : [];

        // If model produced too little, we still allow article to exist:
        // Zod schema already has defaults, but your current schema has mins.
        // To keep UX stable, provide minimal fallbacks when missing.
        const ensuredQuickKeyPoints =
            quickKeyPoints.length >= 3 ? quickKeyPoints : ["What we observe", "What we don’t know yet", "Why it matters"];
        const ensuredQuickMindChanges =
            quickMindChanges.length >= 2 ? quickMindChanges : ["A decisive experimental signature", "A repeated independent confirmation"];

        const ensuredPrereq =
            prerequisites.length >= 3
                ? prerequisites
                : [
                    { term: "Hypothesis", explanation: "A proposed explanation you can test with observations or experiments." },
                    { term: "Evidence", explanation: "Measurements or observations that support or weaken a hypothesis." },
                    { term: "Uncertainty", explanation: "How confident we are in a measurement, often expressed with error bars." },
                ];

        const ensuredPractice =
            practiceQuestions.length >= 3
                ? practiceQuestions
                : [
                    { question: "What is the core mystery in one sentence?", answer: "It’s the gap between what we observe and what we can currently explain." },
                    { question: "Name one leading hypothesis.", answer: "One hypothesis is that an unknown mechanism or component explains the observations." },
                    { question: "What would count as strong evidence?", answer: "A repeatable, independent measurement that uniquely supports one explanation." },
                ];

        const merged = {
            id: asString(obj?.id, topic.id),
            title: asString(obj?.title, topic.title),
            subtitle: asString(obj?.subtitle, ""),
            readingMinutes: Number(obj?.readingMinutes ?? 8),
            hero: {
                unsplashQuery: asString(obj?.hero?.unsplashQuery, topic.title),
                alt: asString(obj?.hero?.alt, topic.title),
            },

            quick: {
                tldr: asString(obj?.quick?.tldr, ""),
                keyPoints: ensuredQuickKeyPoints,
                whatWouldChangeOurMind: ensuredQuickMindChanges,
            },

            sections: cleanedSections,

            learn: {
                prerequisites: ensuredPrereq,
                learningPath: learningPath.length >= 3 ? learningPath : learningPath, // allow empty if model fails; still renders
                practiceQuestions: ensuredPractice,
            },

            keyTakeaways: asStringArray(obj?.keyTakeaways),
            sources: Array.isArray(obj?.sources)
                ? obj.sources
                    .map((s: any) => ({
                        label: asString(s?.label),
                        url: asString(s?.url),
                    }))
                    .filter((s: any) => s.label && s.url)
                : [],

            meta: {
                generatedAt: new Date().toISOString(),
                model: modelUsed,
                style: normalizedStyle,
                cacheVersion: CACHE_VERSION,
            },
        };

        const article = ArticleSchema.parse(merged);

        // Cache forever
        await redis.set(cacheKey(normalizedId, normalizedStyle), article);

        return { article, fromCache: false };
    } finally {
        // ✅ Always release lock (best-effort)
        await redis.del(lockKey(normalizedId, normalizedStyle));
    }
}
