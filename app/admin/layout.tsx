import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminFromCookies } from "@/lib/authServer";

export const dynamic = "force-dynamic";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/concerts", label: "Concerts" },
  { href: "/admin/venues", label: "Venues" },
  { href: "/admin/travel", label: "Travel" },
  { href: "/admin/records", label: "Vinyl" },
  { href: "/admin/resume", label: "Resume" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = getAdminFromCookies();
  if (!admin) redirect("/login");

  return (
    <div className="flex gap-8 -mt-10">
      <aside className="w-48 shrink-0 border-r border-border pt-10 pr-6 min-h-[calc(100vh-14rem)]">
        <div className="text-xs uppercase tracking-wider text-muted mb-3">Admin</div>
        <nav className="flex flex-col gap-2 text-sm">
          {adminLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/logout" method="post" className="mt-8">
          <button
            formAction="/api/auth/logout"
            className="text-xs text-muted hover:text-accent"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </aside>
      <div className="flex-1 pt-10">{children}</div>
    </div>
  );
}
