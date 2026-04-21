import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Resume, ResumeEntry } from "@/lib/types";

function fmtDate(d?: string): string {
  if (!d) return "Present";
  return d;
}

function EntryBlock({ entry }: { entry: ResumeEntry }) {
  return (
    <article className="space-y-1">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="font-display text-xl">
          {entry.role} <span className="text-muted font-sans text-base">· {entry.organization}</span>
        </h3>
        <div className="text-xs text-muted font-mono">
          {entry.startDate} – {fmtDate(entry.endDate)}
        </div>
      </div>
      {entry.location && <p className="text-xs text-muted">{entry.location}</p>}
      {entry.bullets.length > 0 && (
        <ul className="list-disc ml-5 text-sm space-y-1 marker:text-accent">
          {entry.bullets.map((b, i) => (
            <li key={i}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ children }) => <>{children}</> }}>
                {b}
              </ReactMarkdown>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function ResumeView({ resume }: { resume: Resume }) {
  const sortedExp = [...resume.experience].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedEdu = [...resume.education].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedSkills = [...resume.skills].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <article className="space-y-10 print:text-black">
      <header className="space-y-1">
        <h1 className="font-display text-5xl">{resume.name}</h1>
        {resume.tagline && <p className="text-xl text-accent">{resume.tagline}</p>}
        <div className="flex flex-wrap gap-3 text-sm text-muted mt-2">
          {resume.email && <a href={`mailto:${resume.email}`}>{resume.email}</a>}
          {resume.location && <span>{resume.location}</span>}
          {resume.website && (
            <a href={resume.website} className="hover:text-accent">
              {resume.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {resume.linkedin && (
            <a href={resume.linkedin} className="hover:text-accent">
              LinkedIn
            </a>
          )}
          {resume.github && (
            <a href={resume.github} className="hover:text-accent">
              GitHub
            </a>
          )}
        </div>
        {resume.pdfBlobUrl && (
          <a
            href={resume.pdfBlobUrl}
            className="inline-block mt-3 border border-accent text-accent text-sm px-3 py-1.5 rounded print:hidden"
          >
            Download PDF
          </a>
        )}
      </header>

      {resume.summary && (
        <section>
          <h2 className="font-display text-2xl mb-2">Summary</h2>
          <div className="prose prose-invert max-w-none print:prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{resume.summary}</ReactMarkdown>
          </div>
        </section>
      )}

      {sortedExp.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display text-2xl">Experience</h2>
          {sortedExp.map((e) => (
            <EntryBlock key={e.id} entry={e} />
          ))}
        </section>
      )}

      {sortedEdu.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display text-2xl">Education</h2>
          {sortedEdu.map((e) => (
            <EntryBlock key={e.id} entry={e} />
          ))}
        </section>
      )}

      {sortedSkills.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl">Skills</h2>
          <dl className="grid sm:grid-cols-2 gap-3">
            {sortedSkills.map((g) => (
              <div key={g.category}>
                <dt className="text-xs uppercase tracking-wider text-muted">{g.category}</dt>
                <dd className="text-sm">{g.skills.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
