export type MysteryCategory =
    | "cosmology"
    | "physics"
    | "biology"
    | "neuroscience"
    | "earth"
    | "math"
    | "chemistry";

export type MysteryTopic = {
    id: string;
    title: string;
    category: MysteryCategory;
    hook: string;
    seed: number; // for CoverArt
    // Optional: extra guidance for generation (helps quality)
    known?: string[];
    unknown?: string[];
    hypotheses?: string[];
    howToTest?: string[];
};

export const CATEGORY_META: Record<
    MysteryCategory,
    { label: string; badgeClass: string; gradientClass: string }
> = {
    cosmology: {
        label: "Cosmology",
        badgeClass: "bg-violet-500/15 text-violet-200 border-violet-400/30",
        gradientClass: "from-violet-500/30 via-fuchsia-500/20 to-sky-500/25",
    },
    physics: {
        label: "Physics",
        badgeClass: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
        gradientClass: "from-cyan-500/25 via-emerald-500/15 to-blue-500/25",
    },
    biology: {
        label: "Biology",
        badgeClass: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
        gradientClass: "from-emerald-500/25 via-lime-500/15 to-teal-500/25",
    },
    neuroscience: {
        label: "Mind & Brain",
        badgeClass: "bg-rose-500/15 text-rose-200 border-rose-400/30",
        gradientClass: "from-rose-500/25 via-orange-500/15 to-pink-500/25",
    },
    earth: {
        label: "Earth & Climate",
        badgeClass: "bg-amber-500/15 text-amber-200 border-amber-400/30",
        gradientClass: "from-amber-500/25 via-green-500/10 to-sky-500/25",
    },
    math: {
        label: "Math & Computation",
        badgeClass: "bg-indigo-500/15 text-indigo-200 border-indigo-400/30",
        gradientClass: "from-indigo-500/25 via-slate-500/10 to-fuchsia-500/25",
    },
    chemistry: {
        label: "Chemistry",
        badgeClass: "bg-teal-500/15 text-teal-200 border-teal-400/30",
        gradientClass: "from-teal-500/25 via-cyan-500/10 to-emerald-500/25",
    },
};

export const TOPICS: MysteryTopic[] = [
    {
        id: "dark-matter",
        title: "Dark Matter: The Invisible Sculptor of Galaxies",
        category: "cosmology",
        hook: "We see its gravity, but not its light.",
        seed: 11,
    },
    {
        id: "dark-energy",
        title: "Dark Energy: Why is the universe’s expansion accelerating?",
        category: "cosmology",
        hook: "The universe is speeding up — and we don’t know why.",
        seed: 13,
    },
    {
        id: "quantum-measurement",
        title: "Quantum Measurement: When does possibility become reality?",
        category: "physics",
        hook: "Quantum math predicts probabilities perfectly — but why do outcomes feel definite?",
        seed: 19,
    },
    {
        id: "abiogenesis",
        title: "Abiogenesis: How chemistry began to remember",
        category: "biology",
        hook: "How do lifeless molecules assemble into a system that can evolve?",
        seed: 31,
    },
];
