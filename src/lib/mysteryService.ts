import { TOPICS } from "./mysteryTopics";
import { readCache, writeCache } from "./mysteryCache";
import { generateArticle, type GeneratedArticle } from "./mysteryAI";

export async function getOrGenerateArticle(id: string, force = false): Promise<GeneratedArticle> {
    const topic = TOPICS.find((t) => t.id === id);
    if (!topic) throw new Error(`Unknown topic: ${id}`);

    if (!force) {
        const cached = await readCache<GeneratedArticle>(id);
        if (cached) return cached;
    }

    const article = await generateArticle(topic);
    await writeCache(id, article);
    return article;
}
