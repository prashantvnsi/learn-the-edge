import OpenAI from "openai";
import { redis } from "@/lib/redis";
import { ArticleSchema, type Article } from "@/lib/articleSchema";
import { TOPICS } from "@/lib/mysteryTopics";

const CACHE_VERSION = "v1";
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1", // OpenAI-compatible Groq endpoint :contentReference[oaicite:11]{index=11}
});

function cacheKey(id: string) {
    return `mystery:${CACHE_VERSION}:${id}`;
}
function lockKey(id: string) {
    return `mystery:${CACHE_VERSION}:${id}:lock`;
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function getOrGenerateArticle(id: string): Promise<{ article: Article; fromCache: boolean }> {
    const normalizedId = decodeURIComponent(id).trim().toLowerCase();

    // TEMP DEBUG (remove later)
    console.log("Requested id:", JSON.stringify(id), "normalized:", JSON.stringify(normalizedId));
    console.log("Known ids:", TOPICS.map(t => t.id));
    // Only allow known topics (prevents abuse of “generate anything”)
    const topic = TOPICS.find((m) => m.id === id);
    if (!topic) throw new Error("Unknown topic id");

    // 1) Cache hit?
    const cached = await redis.get<Article>(cacheKey(id));
    if (cached) return { article: cached, fromCache: true };

    // 2) Acquire a lock (prevents multiple users generating the same topic at the same time)
    // SET lock NX EX is supported by Upstash redis.set options :contentReference[oaicite:12]{index=12}
    const gotLock = await redis.set(lockKey(id), "1", { nx: true, ex: 60 });

    // If someone else is generating, wait briefly and re-check cache
    if (gotLock !== "OK") {
        for (let i = 0; i < 12; i++) {
            await sleep(1000);
            const c2 = await redis.get<Article>(cacheKey(id));
            if (c2) return { article: c2, fromCache: true };
        }
        // If still not ready, continue anyway (rare) — try generating ourselves.
    }

    // 3) Generate via Groq (JSON mode)
    // Groq supports JSON Object Mode via response_format {"type":"json_object"} :contentReference[oaicite:13]{index=13}
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    const system = [
        "You write vivid, accurate science explainer articles.",
        "Return ONLY valid JSON (no markdown).",
        "The JSON MUST follow the requested shape.",
        "Include the word JSON in your output requirements.",
    ].join(" ");

    const user = `
Write a blog-style article about this open scientific mystery.

Topic:
- id: ${topic.id}
- title: ${topic.title}
- hook: ${topic.hook}
- category: ${topic.category}

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
  "sections": [ { "heading": string, "paragraphs": string[] } ],
  "keyTakeaways": string[],
  "sources": [ { "label": string, "url": string } ]
}

Constraints:
- 4 to 7 sections, each section 2-4 paragraphs.
- Keep it exciting, but avoid fake certainty.
- Sources must be real-looking reputable orgs/journals (NASA/ESA, Nature/Science, university pages, etc.)
- Output MUST be valid JSON.
`.trim();


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

    const article = ArticleSchema.parse(parsed);

    // 4) Cache forever (no TTL)
    await redis.set(cacheKey(id), article);

    // 5) Release lock (best-effort)
    await redis.del(lockKey(id));

    return { article, fromCache: false };
}
