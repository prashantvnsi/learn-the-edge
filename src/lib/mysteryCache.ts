import { promises as fs } from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "mysteries");

export async function readCache<T>(id: string): Promise<T | null> {
    try {
        const p = path.join(CACHE_DIR, `${id}.json`);
        const raw = await fs.readFile(p, "utf-8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export async function writeCache<T>(id: string, data: T): Promise<void> {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const p = path.join(CACHE_DIR, `${id}.json`);
    await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}
