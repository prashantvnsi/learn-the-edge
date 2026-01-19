import OpenAI from "openai";

export async function repairWithGroq(args: {
    groq: OpenAI;
    model: string;
    topicSummary: string;
    styleInstruction: string;
    badJson: unknown;
    issues: { severity: string; code: string; message: string }[];
}) {
    const { groq, model, topicSummary, styleInstruction, badJson, issues } = args;

    const system = [
        "You are a careful technical editor for explainer articles.",
        "You will FIX the JSON to satisfy the schema and the constraints.",
        "Return ONLY valid JSON (no markdown).",
        "Do not omit required fields.",
    ].join(" ");

    const user = `
You previously generated JSON for an article, but it failed quality checks.

STYLE:
${styleInstruction}

TOPIC:
${topicSummary}

QUALITY ISSUES TO FIX:
${issues.map((i) => `- [${i.severity}] ${i.code}: ${i.message}`).join("\n")}

BAD JSON (needs repair):
${JSON.stringify(badJson).slice(0, 12000)}

Return repaired JSON with the same required shape:
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

Hard constraints:
- 4 to 7 sections
- Each section must have 2–4 paragraphs (paragraphs array must not be empty)
- quick.keyPoints: 3–8
- quick.whatWouldChangeOurMind: 2–6
- learn.prerequisites: 3–10
- learn.learningPath: 3–12
- learn.practiceQuestions: 3–8
- Sources: 3–10 and must be plausible real URLs
- Output MUST be valid JSON only.
`.trim();

    const resp = await groq.chat.completions.create({
        model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    });

    const content = resp.choices?.[0]?.message?.content ?? "";
    return JSON.parse(content);
}
