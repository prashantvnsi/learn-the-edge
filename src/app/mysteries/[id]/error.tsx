"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-semibold">Something broke while generating this article</h1>
                <p className="mt-3 text-muted-foreground">
                    This is usually an env var issue (Groq/Upstash), a missing topic id, or invalid JSON from the model.
                </p>

                <pre className="mt-6 rounded-2xl border bg-muted/30 p-4 text-xs overflow-auto">
                    {error.message}
                </pre>

                <button
                    className="mt-6 rounded-2xl border px-4 py-2 hover:bg-muted/40"
                    onClick={() => reset()}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
