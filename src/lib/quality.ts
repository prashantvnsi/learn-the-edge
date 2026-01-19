import type { Article, QualityReport } from "@/lib/articleSchema";

type Issue = QualityReport["issues"][number];

function gradeFromScore(score: number): QualityReport["grade"] {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

function addIssue(issues: Issue[], severity: Issue["severity"], code: string, message: string) {
    issues.push({ severity, code, message });
}

function looksLikeFakeUrl(url: string) {
    // very light heuristic — avoids obviously broken URLs
    try {
        const u = new URL(url);
        return !(u.protocol === "http:" || u.protocol === "https:");
    } catch {
        return true;
    }
}

export function evaluateArticleQuality(article: Article): QualityReport {
    const issues: Issue[] = [];

    const sectionCount = article.sections?.length ?? 0;
    const totalParagraphs = article.sections.reduce((acc, s) => acc + (s.paragraphs?.length ?? 0), 0);
    const sourcesCount = article.sources?.length ?? 0;

    // Start from 100 and subtract
    let score = 100;

    // Sections
    if (sectionCount < 4) {
        score -= 25;
        addIssue(issues, "critical", "SECTIONS_TOO_FEW", "Too few sections. Expected 4–7.");
    } else if (sectionCount > 8) {
        score -= 10;
        addIssue(issues, "warn", "SECTIONS_TOO_MANY", "Too many sections. Consider tightening.");
    }

    // Paragraph density
    if (totalParagraphs < 8) {
        score -= 20;
        addIssue(issues, "critical", "TOO_LITTLE_CONTENT", "Not enough content / paragraphs overall.");
    }

    // Empty paragraphs (should never happen due to schema, but keep as guard)
    for (const [i, s] of article.sections.entries()) {
        if (!s.paragraphs || s.paragraphs.length === 0) {
            score -= 30;
            addIssue(issues, "critical", "EMPTY_PARAGRAPHS", `Section ${i + 1} has no paragraphs.`);
        }
    }

    // Quick section usefulness
    if (!article.quick?.tldr || article.quick.tldr.trim().length < 40) {
        score -= 8;
        addIssue(issues, "warn", "TLDR_WEAK", "TL;DR is missing or too short.");
    }
    if ((article.quick?.keyPoints?.length ?? 0) < 3) {
        score -= 8;
        addIssue(issues, "warn", "KEYPOINTS_FEW", "Quick key points are too few (<3).");
    }
    if ((article.quick?.whatWouldChangeOurMind?.length ?? 0) < 2) {
        score -= 8;
        addIssue(issues, "warn", "MINDCHANGE_FEW", "What would change our mind is too few (<2).");
    }

    // Learn section
    if ((article.learn?.prerequisites?.length ?? 0) < 3) {
        score -= 6;
        addIssue(issues, "warn", "PREREQS_FEW", "Prerequisites are too few (<3).");
    }
    if ((article.learn?.learningPath?.length ?? 0) < 3) {
        score -= 6;
        addIssue(issues, "warn", "LEARNINGPATH_FEW", "Learning path is too short (<3).");
    }
    if ((article.learn?.practiceQuestions?.length ?? 0) < 3) {
        score -= 6;
        addIssue(issues, "warn", "PRACTICE_FEW", "Practice questions are too few (<3).");
    }

    // Sources sanity
    if (sourcesCount < 3) {
        score -= 12;
        addIssue(issues, "warn", "SOURCES_FEW", "Too few sources (<3).");
    }
    const badUrls = (article.sources ?? []).filter((s) => looksLikeFakeUrl(s.url));
    if (badUrls.length > 0) {
        score -= 15;
        addIssue(issues, "warn", "SOURCES_BAD_URLS", "Some sources have invalid-looking URLs.");
    }

    // Key takeaways
    if ((article.keyTakeaways?.length ?? 0) < 3) {
        score -= 6;
        addIssue(issues, "warn", "TAKEAWAYS_FEW", "Key takeaways are too few (<3).");
    }

    score = Math.max(0, Math.min(100, score));
    const grade = gradeFromScore(score);

    const passed = score >= 75 && !issues.some((i) => i.severity === "critical");

    return {
        score,
        grade,
        passed,
        checks: {
            sectionCount,
            totalParagraphs,
            sourcesCount,
            badUrls: badUrls.length,
        },
        issues,
    };
}
