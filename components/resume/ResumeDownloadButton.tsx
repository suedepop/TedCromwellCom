"use client";
import { trackEvent } from "@/lib/analytics";

export default function ResumeDownloadButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      onClick={() => trackEvent("resume_download_click", { url: href })}
      className="inline-block mt-3 border border-accent text-accent text-sm px-3 py-1.5 rounded print:hidden"
    >
      Download PDF
    </a>
  );
}
