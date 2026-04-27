import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-xl mx-auto text-center space-y-6 py-16">
      <h1 className="font-display text-6xl">404</h1>
      <p className="text-muted">
        That page isn&apos;t here. It may have been renamed, removed, or never existed in the
        first place.
      </p>
      <div className="flex justify-center gap-3 text-sm">
        <Link href="/" className="border border-border hover:border-accent hover:text-accent px-3 py-1.5 rounded">
          Go home
        </Link>
        <Link href="/search" className="border border-border hover:border-accent hover:text-accent px-3 py-1.5 rounded">
          Search the site
        </Link>
      </div>
    </section>
  );
}
