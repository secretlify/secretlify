'use client';

export default function AppHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6 text-center bg-background text-foreground">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Secretly
        </span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl">
        Secretly is a simple way to share secrets with your collaborators —
        private, fast, and <span className="font-semibold">free forever</span>.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/app/page-a"
          className="rounded-md border border-border px-4 py-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition"
        >
          Try Page A
        </a>
        <a
          href="/app/page-b"
          className="rounded-md border border-border px-4 py-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition"
        >
          Try Page B
        </a>
      </div>
      <div className="text-xs text-muted-foreground">
        No subscriptions. No paywalls. Just secure sharing.
      </div>
    </div>
  );
}
