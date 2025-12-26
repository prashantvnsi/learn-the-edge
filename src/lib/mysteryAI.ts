import OpenAI from "openai";
import type { MysteryTopic } from "./mysteryTopics";

export type GeneratedArticle = {
    id: string;
    title: string;
    subtitle: string;
    readingMinutes: number;
    hero: {
        // still “images”, but safe + simple: you can render this as a colorful cover
        vibe: string; // e.g. "cosmic", "mysterious", "lab-notes"
        imagePrompt: string; // optional, for future real image gen
    };
    sections: Array<{
        heading: string;
        paragraphs: string[];
    }>;
    keyTakeaways: string[];
    sources: Array<{ label: string; url: string }>;
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function mustEnv(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
}

export async function generateArticle(topic: MysteryTopic): Promise<GeneratedArticle> {
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    mustEnv("OPENAI_API_KEY");

    const prompt = `
You are writing a beautiful, science-magazine style article that feels inspiring and accurate (no sensationalism).
Audience: curious engineers + students.
Tone: vivid but careful, avoid overclaiming, always distinguish evidence vs hypothesis.

Task: Generate ONE article about:
Title/topic: "${topic.title}"
Category: "${topic.category}"
Slug/id: "${topic.id}"

Hard requirements:
- Output MUST be valid JSON only (no markdown).
- Use this JSON schema:

{
  "id": string,
  "title": string,
  "subtitle": string,
  "readingMinutes": number,
  "hero": { "vibe": string, "imagePrompt": string },
  "sections": [{ "heading": string, "paragraphs": string[] }],
  "keyTakeaways": string[],
  "sources": [{ "label": string, "url": string }]
}

Content requirements:
- 5–8 sections, each with 1–3 short paragraphs.
- Include at least 4 sources (reputable: NASA/ESA/CERN, Nature/Science, university pages, major surveys).
- If you are unsure about a fact, phrase it cautiously.
`;

    // Use web search tool so the model can pull up-to-date sources. :contentReference[oaicite:2]{index=2}
    const resp = await openai.responses.create({
        model,
        input: prompt,
        tools: [{ type: "web_search" }],
    });

    // The Responses API returns structured output items; simplest robust extraction:
    const text = resp.output_text?.trim();
    if (!text) throw new Error("No output_text returned from model");

    // Parse JSON
    let data: GeneratedArticle;
    try {
        data = JSON.parse(text);
    } catch (e) {
        // If model ever emits extra text, fail loudly so you can inspect.
        throw new Error("Model did not return valid JSON. Raw:\n" + text);
    }

    return data;
}
