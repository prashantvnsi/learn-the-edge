import { z } from "zod";

export const ArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().default(""),
    readingMinutes: z.number().int().min(1).max(30),
    hero: z
        .object({
            unsplashQuery: z.string().min(2),
            alt: z.string().min(2),
        })
        .default({ unsplashQuery: "space", alt: "Abstract science illustration" }),
    sections: z
        .array(
            z.object({
                heading: z.string(),
                paragraphs: z.array(z.string()).min(1),
            })
        )
        .min(3),
    keyTakeaways: z.array(z.string()).min(3).max(8),
    sources: z
        .array(
            z.object({
                label: z.string(),
                url: z.string().url(),
            })
        )
        .min(2)
        .max(8),
});

export type Article = z.infer<typeof ArticleSchema>;
