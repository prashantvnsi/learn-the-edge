import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topics = [
    { id: "dark-matter", title: "Dark Matter: The Invisible Sculptor of Galaxies", category: "cosmology" },
    { id: "hubble-tension", title: "The Hubble Tension: Two Rulers, Two Universes", category: "cosmology" },
    { id: "quantum-measurement", title: "Quantum Measurement: When Does Possibility Become Reality?", category: "physics" },
    { id: "abiogenesis", title: "Abiogenesis: The Moment Chemistry Began to Remember", category: "biology" },
];

const OUT_DIR = path.join(process.cwd(), "src", "content", "mysteries");

function articlePrompt(t) {
    return `
Write a beautiful, accurate, magazine-style science article.
Topic: "${t.title}"
Category: "${t.category}"

Return VALID JSON only, matching this schema:
{
  "id": string,
  "title": string,
  "subtitle": string,
  "readingMinutes": number,
  "sections": [{ "heading": string, "paragraphs": string[] }],
  "keyTakeaways": string[],
  "sources": [{ "label": string, "url": string }]
}

Rules:
- 6–9 sections, each 1–3 short paragraphs.
- Vivid but careful. No sensational claims.
- Include at least 4 reputable sources (NASA/ESA/CERN, universities, Nature/Science review pages).
`;
}

async function generateOne(topic) {
    const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama3.2",          // you can change this
            prompt: articlePrompt(topic),
            stream: false,
            format: "json",             // Ollama supports structured JSON output :contentReference[oaicite:8]{index=8}
        }),
    });

    if (!res.ok) throw new Error(`Ollama failed: ${res.status} ${await res.text()}`);
    const data = await res.json();

    // Ollama returns the model output in `response`
    const jsonText = (data.response || "").trim();
    let article;
    try {
        article = JSON.parse(jsonText);
    } catch (e) {
        throw new Error(`Invalid JSON from model for ${topic.id}:\n${jsonText}`);
    }

    // Ensure id is stable
    article.id = topic.id;

    await fs.mkdir(OUT_DIR, { recursive: true });
    await fs.writeFile(path.join(OUT_DIR, `${topic.id}.json`), JSON.stringify(article, null, 2), "utf-8");
    console.log(`✅ Generated ${topic.id}`);
}

async function main() {
    for (const t of topics) {
        const outPath = path.join(OUT_DIR, `${t.id}.json`);
        try {
            // Skip if already generated (cache forever)
            await fs.access(outPath);
            console.log(`⏭️  Skip ${t.id} (already exists)`);
            continue;
        } catch { }
        await generateOne(t);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
