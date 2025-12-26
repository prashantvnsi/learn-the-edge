export default function LoadingMysteryArticle() {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
                <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                <div className="h-48 w-full rounded-3xl bg-muted animate-pulse" />
                <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-4 w-full rounded bg-muted animate-pulse" />
                    ))}
                </div>
                <div className="text-sm text-muted-foreground">
                    Generating this article for the first time…
                </div>
            </div>
        </div>
    );
}
