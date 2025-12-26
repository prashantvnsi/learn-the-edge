import React from "react";

function mulberry32(a: number) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default function CoverArt({ seed = 1 }: { seed?: number }) {
    const rand = mulberry32(seed);
    const blobs = Array.from({ length: 6 }).map((_, i) => {
        const cx = 10 + rand() * 90;
        const cy = 10 + rand() * 90;
        const r = 10 + rand() * 28;
        const o = 0.18 + rand() * 0.22;
        return { cx, cy, r, o, i };
    });

    return (
        <svg viewBox="0 0 100 56" className="h-full w-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                    <stop offset="55%" stopColor="currentColor" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.28" />
                </linearGradient>
                <filter id="blur">
                    <feGaussianBlur stdDeviation="2.5" />
                </filter>
            </defs>
            <rect x="0" y="0" width="100" height="56" fill="url(#g)" />
            <g filter="url(#blur)">
                {blobs.map((b) => (
                    <circle key={b.i} cx={b.cx} cy={b.cy} r={b.r} fill="white" opacity={b.o} />
                ))}
            </g>
            <path
                d="M0,45 C20,38 32,52 52,44 C70,36 80,50 100,42 L100,56 L0,56 Z"
                fill="white"
                opacity="0.10"
            />
        </svg>
    );
}
