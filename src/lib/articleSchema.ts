import { z } from "zod";

const SectionSchema = z.object({
    heading: z.string(),
    paragraphs: z.array(z.string()).min(1),
});

const SourceSchema = z.object({
    label: z.string(),
    url: z.string(),
});

const QuickSchema = z.object({
    tldr: z.string(),
    keyPoints: z.array(z.string()).min(3).max(8),
    whatWouldChangeOurMind: z.array(z.string()).min(2).max(6),
});

const LearnSchema = z.object({
    prerequisites: z
        .array(
            z.object({
                term: z.string(),
                explanation: z.string(),
            })
        )
        .min(3)
        .max(10),
    learningPath: z
        .array(
            z.object({
                level: z.enum(["Beginner", "Intermediate", "Advanced"]),
                title: z.string(),
                url: z.string(),
            })
        )
        .min(3)
        .max(12),
    practiceQuestions: z
        .array(
            z.object({
                question: z.string(),
                answer: z.string(),
            })
        )
        .min(3)
        .max(8),
});

export const ArticleSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional().default(""),
    readingMinutes: z.number(),
    hero: z.object({
        unsplashQuery: z.string(),
        alt: z.string(),
    }),

    sections: z.array(SectionSchema).min(1),
    keyTakeaways: z.array(z.string()).default([]),
    sources: z.array(SourceSchema).default([]),

    // ✅ Reader modes (optional for backward compatibility)
    quick: QuickSchema.optional().default({
        tldr: "",
        keyPoints: [],
        whatWouldChangeOurMind: [],
    }),
    learn: LearnSchema.optional().default({
        prerequisites: [],
        learningPath: [],
        practiceQuestions: [],
    }),

    // already in your project (keep optional)
    meta: z
        .object({
            generatedAt: z.string(),
            model: z.string(),
            style: z.string(),
            cacheVersion: z.string(),
        })
        .optional(),
});

export type Article = z.infer<typeof ArticleSchema>;
