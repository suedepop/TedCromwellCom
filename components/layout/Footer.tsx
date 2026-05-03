import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-muted flex items-center justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} Ted Cromwell</span>
        <Link href="/privacy" className="hover:text-accent">
          Privacy &amp; comments
        </Link>
      </div>
    </footer>
  );
}
