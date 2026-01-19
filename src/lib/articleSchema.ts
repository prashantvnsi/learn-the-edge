import { z } from "zod";

export const QualityReportSchema = z.object({
    score: z.number().min(0).max(100),
    grade: z.enum(["A", "B", "C", "D", "F"]),
    passed: z.boolean(),
    checks: z.record(z.string(), z.any()).optional(),
    issues: z
        .array(
            z.object({
                severity: z.enum(["info", "warn", "critical"]),
                code: z.string(),
                message: z.string(),
            })
        )
        .default([]),
});

export const ArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional().default(""),
    readingMinutes: z.number().int().min(1).max(60),

    hero: z
        .object({
            unsplashQuery: z.string(),
            alt: z.string(),
        })
        .default({ unsplashQuery: "", alt: "" }),

    quick: z
        .object({
            tldr: z.string().default(""),
            keyPoints: z.array(z.string()).default([]),
            whatWouldChangeOurMind: z.array(z.string()).default([]),
        })
        .default({ tldr: "", keyPoints: [], whatWouldChangeOurMind: [] }),

    sections: z.array(
        z.object({
            heading: z.string(),
            paragraphs: z.array(z.string()).min(1),
        })
    ),

    learn: z
        .object({
            prerequisites: z
                .array(
                    z.object({
                        term: z.string(),
                        explanation: z.string(),
                    })
                )
                .default([]),
            learningPath: z
                .array(
                    z.object({
                        level: z.enum(["Beginner", "Intermediate", "Advanced"]),
                        title: z.string(),
                        url: z.string(),
                    })
                )
                .default([]),
            practiceQuestions: z
                .array(
                    z.object({
                        question: z.string(),
                        answer: z.string(),
                    })
                )
                .default([]),
        })
        .default({ prerequisites: [], learningPath: [], practiceQuestions: [] }),

    keyTakeaways: z.array(z.string()).default([]),
    sources: z
        .array(
            z.object({
                label: z.string(),
                url: z.string(),
            })
        )
        .default([]),

    meta: z
        .object({
            generatedAt: z.string().optional(),
            model: z.string().optional(),
            style: z.string().optional(),
            cacheVersion: z.string().optional(),
        })
        .optional(),

    // ✅ new
    quality: QualityReportSchema.optional(),
});

export type Article = z.infer<typeof ArticleSchema>;
export type QualityReport = z.infer<typeof QualityReportSchema>;
