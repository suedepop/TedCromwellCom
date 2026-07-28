"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // redirect() / permanentRedirect() and notFound() communicate to Next.js by
  // THROWING a specially-tagged error. In Next 14 those errors bubble through
  // the framework's rendering pipeline BUT if a route has an error.tsx
  // boundary, that boundary catches them first and renders empty content.
  // The user-visible symptom: redirects silently no-op and 404s render
  // "Something went wrong" instead of the not-found UI. Re-throw so Next can
  // handle them.
  const digest = error.digest ?? "";
  if (digest === "NEXT_REDIRECT" || digest.startsWith("NEXT_REDIRECT;") || digest === "NEXT_NOT_FOUND") {
    throw error;
  }
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
