"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="max-w-xl space-y-4">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="text-muted text-sm">{error.message}</p>
      <button onClick={reset} className="border border-border px-3 py-1.5 rounded text-sm hover:border-accent">
        Try again
      </button>
    </section>
  );
}
