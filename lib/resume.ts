import { containers } from "./cosmos";
import type { Resume } from "./types";

const RESUME_ID = "resume" as const;

export async function getResume(): Promise<Resume | null> {
  try {
    const { resource } = await containers.resume.item(RESUME_ID, RESUME_ID).read<Resume>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function upsertResume(patch: Partial<Resume>): Promise<Resume> {
  const existing = await getResume();
  const now = new Date().toISOString();
  const base: Resume = existing ?? {
    id: RESUME_ID,
    pk: RESUME_ID,
    name: "",
    tagline: "",
    email: "",
    location: "",
    website: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    updatedAt: now,
  };
  const next: Resume = {
    ...base,
    ...patch,
    id: RESUME_ID,
    pk: RESUME_ID,
    updatedAt: now,
  };
  const { resource } = await containers.resume.items.upsert(next);
  return resource as unknown as Resume;
}
