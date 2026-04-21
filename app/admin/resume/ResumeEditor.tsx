"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Resume, ResumeEntry, SkillGroup } from "@/lib/types";
import UploadDropzone from "@/components/media/UploadDropzone";

interface EntryDraft {
  id: string;
  organization: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  bullets: string; // newline-separated
  sortOrder: number;
}

function toEntryDraft(e: ResumeEntry): EntryDraft {
  return { ...e, bullets: e.bullets.join("\n") };
}
function fromEntryDraft(d: EntryDraft, idx: number): ResumeEntry {
  return {
    id: d.id,
    organization: d.organization,
    role: d.role,
    location: d.location,
    startDate: d.startDate,
    endDate: d.endDate || undefined,
    bullets: d.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
    sortOrder: idx,
  };
}

function blankEntry(order: number): EntryDraft {
  return {
    id: crypto.randomUUID(),
    organization: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: "",
    sortOrder: order,
  };
}

export default function ResumeEditor({ resume }: { resume: Resume | null }) {
  const router = useRouter();
  const [name, setName] = useState(resume?.name ?? "");
  const [tagline, setTagline] = useState(resume?.tagline ?? "");
  const [email, setEmail] = useState(resume?.email ?? "");
  const [location, setLocation] = useState(resume?.location ?? "");
  const [website, setWebsite] = useState(resume?.website ?? "");
  const [linkedin, setLinkedin] = useState(resume?.linkedin ?? "");
  const [github, setGithub] = useState(resume?.github ?? "");
  const [summary, setSummary] = useState(resume?.summary ?? "");
  const [pdfBlobUrl, setPdfBlobUrl] = useState(resume?.pdfBlobUrl ?? "");
  const [experience, setExperience] = useState<EntryDraft[]>(
    (resume?.experience ?? []).map(toEntryDraft),
  );
  const [education, setEducation] = useState<EntryDraft[]>(
    (resume?.education ?? []).map(toEntryDraft),
  );
  const [skills, setSkills] = useState<SkillGroup[]>(resume?.skills ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);
    const payload: Partial<Resume> = {
      name,
      tagline,
      email,
      location,
      website,
      linkedin: linkedin || undefined,
      github: github || undefined,
      summary,
      pdfBlobUrl: pdfBlobUrl || undefined,
      experience: experience.map(fromEntryDraft),
      education: education.map(fromEntryDraft),
      skills: skills.map((s, i) => ({ ...s, sortOrder: i })),
    };
    const res = await fetch("/api/resume", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) return setError(`Save failed: ${res.status}`);
    setSaved(true);
    router.refresh();
  }

  function updateEntry(
    list: EntryDraft[],
    setter: (v: EntryDraft[]) => void,
    idx: number,
    patch: Partial<EntryDraft>,
  ) {
    setter(list.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }

  const entrySection = (
    title: string,
    list: EntryDraft[],
    setter: (v: EntryDraft[]) => void,
  ) => (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">{title}</h2>
        <button type="button" onClick={() => setter([...list, blankEntry(list.length)])} className="border border-border px-3 py-1 rounded text-xs">
          + Add entry
        </button>
      </div>
      <ul className="space-y-3">
        {list.map((e, i) => (
          <li key={e.id} className="border border-border rounded p-3 bg-surface space-y-2">
            <div className="grid grid-cols-6 gap-2">
              <input placeholder="Organization" value={e.organization} onChange={(ev) => updateEntry(list, setter, i, { organization: ev.target.value })} className="col-span-3 bg-bg border border-border rounded px-2 py-1 text-sm" />
              <input placeholder="Role" value={e.role} onChange={(ev) => updateEntry(list, setter, i, { role: ev.target.value })} className="col-span-3 bg-bg border border-border rounded px-2 py-1 text-sm" />
            </div>
            <div className="grid grid-cols-6 gap-2">
              <input placeholder="Location" value={e.location ?? ""} onChange={(ev) => updateEntry(list, setter, i, { location: ev.target.value })} className="col-span-2 bg-bg border border-border rounded px-2 py-1 text-sm" />
              <input placeholder="YYYY-MM start" value={e.startDate} onChange={(ev) => updateEntry(list, setter, i, { startDate: ev.target.value })} className="col-span-2 bg-bg border border-border rounded px-2 py-1 text-sm font-mono" />
              <input placeholder="YYYY-MM end (blank=present)" value={e.endDate ?? ""} onChange={(ev) => updateEntry(list, setter, i, { endDate: ev.target.value })} className="col-span-2 bg-bg border border-border rounded px-2 py-1 text-sm font-mono" />
            </div>
            <textarea
              rows={3}
              placeholder="Bullets (one per line, markdown OK)"
              value={e.bullets}
              onChange={(ev) => updateEntry(list, setter, i, { bullets: ev.target.value })}
              className="w-full bg-bg border border-border rounded px-2 py-1 text-sm"
            />
            <div className="flex justify-between">
              <div className="flex gap-1">
                <button type="button" disabled={i === 0} onClick={() => { const next = [...list]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; setter(next); }} className="text-xs border border-border px-2 rounded disabled:opacity-30">↑</button>
                <button type="button" disabled={i === list.length - 1} onClick={() => { const next = [...list]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; setter(next); }} className="text-xs border border-border px-2 rounded disabled:opacity-30">↓</button>
              </div>
              <button type="button" onClick={() => setter(list.filter((_, j) => j !== i))} className="text-xs text-red-400 border border-red-500/40 px-2 rounded">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Resume</h1>
        <div className="flex gap-2 items-center">
          {saved && <span className="text-xs text-accent">Saved.</span>}
          <a href="/resume" className="text-xs text-muted border border-border px-3 py-1.5 rounded" target="_blank" rel="noreferrer">
            Preview
          </a>
          <button onClick={save} disabled={busy} className="bg-accent text-bg px-3 py-1.5 rounded text-sm disabled:opacity-50">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <Field label="Tagline"><input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <Field label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <Field label="Website"><input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <Field label="LinkedIn"><input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <Field label="GitHub"><input value={github} onChange={(e) => setGithub(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2" /></Field>
        <div className="col-span-2 space-y-2">
          <span className="text-xs uppercase tracking-wider text-muted">Resume PDF</span>
          <input value={pdfBlobUrl} onChange={(e) => setPdfBlobUrl(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 font-mono text-xs" placeholder="URL or upload below" />
          <UploadDropzone endpoint="/api/upload/resume-pdf" accept="application/pdf" onUploaded={(r) => setPdfBlobUrl(r.blobUrl)} label="Upload PDF" />
        </div>
      </div>
      <Field label="Summary (markdown)">
        <textarea rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full bg-surface border border-border rounded px-3 py-2 text-sm" />
      </Field>

      {entrySection("Experience", experience, setExperience)}
      {entrySection("Education", education, setEducation)}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Skills</h2>
          <button type="button" onClick={() => setSkills([...skills, { category: "", skills: [], sortOrder: skills.length }])} className="border border-border px-3 py-1 rounded text-xs">
            + Add group
          </button>
        </div>
        <ul className="space-y-3">
          {skills.map((g, i) => (
            <li key={i} className="border border-border rounded p-3 bg-surface space-y-2">
              <div className="flex gap-2">
                <input placeholder="Category" value={g.category} onChange={(e) => setSkills(skills.map((s, j) => (j === i ? { ...s, category: e.target.value } : s)))} className="flex-1 bg-bg border border-border rounded px-2 py-1 text-sm" />
                <button type="button" onClick={() => setSkills(skills.filter((_, j) => j !== i))} className="text-xs text-red-400 border border-red-500/40 px-2 rounded">
                  Remove
                </button>
              </div>
              <input
                placeholder="Skills (comma-separated)"
                value={g.skills.join(", ")}
                onChange={(e) => setSkills(skills.map((s, j) => (j === i ? { ...s, skills: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) } : s)))}
                className="w-full bg-bg border border-border rounded px-2 py-1 text-sm"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}
