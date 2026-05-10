import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-muted flex items-center justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} Ted Cromwell</span>
        <nav className="flex items-center gap-4">
          <Link href="/experiments" className="hover:text-accent">
            Experiments
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
