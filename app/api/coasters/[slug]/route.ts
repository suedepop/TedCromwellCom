import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/authServer";
import { deleteCoaster, getCoaster, upsertCoasterBySlug } from "@/lib/coasters";
import type { CoasterStats, CoasterStatus, CoasterType } from "@/lib/types";

export const runtime = "nodejs";

const COASTER_TYPES: CoasterType[] = [
  "steel", "wood", "hybrid", "kiddie", "powered", "launched", "inverted", "flying", "mountain", "water", "other",
];
const COASTER_STATUSES: CoasterStatus[] = [
  "open", "closed", "sbno", "under-construction", "relocated",
];

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const coaster = await getCoaster(params.slug);
  if (!coaster) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(coaster);
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function str(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

function parseStats(v: unknown): CoasterStats | undefined {
  if (!v || typeof v !== "object") return undefined;
  const s = v as Record<string, unknown>;
  const out: CoasterStats = {};
  const hf = num(s.heightFeet); if (hf !== undefined) out.heightFeet = hf;
  const df = num(s.dropFeet); if (df !== undefined) out.dropFeet = df;
  const lf = num(s.lengthFeet); if (lf !== undefined) out.lengthFeet = lf;
  const ts = num(s.topSpeedMph); if (ts !== undefined) out.topSpeedMph = ts;
  const inv = num(s.inversions); if (inv !== undefined) out.inversions = inv;
  const dur = num(s.durationSeconds); if (dur !== undefined) out.durationSeconds = dur;
  const mg = num(s.maxG); if (mg !== undefined) out.maxG = mg;
  return Object.keys(out).length ? out : undefined;
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(body.name);
  const parkId = str(body.parkId);
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!parkId) return NextResponse.json({ error: "parkId required" }, { status: 400 });

  const externalIds: { coasterCountId?: number; rcdbId?: number } = {};
  if (body.externalIds && typeof body.externalIds === "object") {
    const ext = body.externalIds as Record<string, unknown>;
    const cc = num(ext.coasterCountId);
    const rc = num(ext.rcdbId);
    if (cc !== undefined) externalIds.coasterCountId = cc;
    if (rc !== undefined) externalIds.rcdbId = rc;
  }

  const typeRaw = str(body.type);
  const type = typeRaw && (COASTER_TYPES as string[]).includes(typeRaw) ? (typeRaw as CoasterType) : undefined;

  const statusRaw = str(body.status);
  const status = statusRaw && (COASTER_STATUSES as string[]).includes(statusRaw)
    ? (statusRaw as CoasterStatus)
    : undefined;

  const updated = await upsertCoasterBySlug(params.slug, {
    name,
    parkId,
    externalIds,
    manufacturer: str(body.manufacturer),
    type,
    openedYear: num(body.openedYear),
    status,
    stats: parseStats(body.stats),
    description: typeof body.description === "string" ? body.description : undefined,
    writeUp: typeof body.writeUp === "string" ? body.writeUp : undefined,
    coverImageUrl: str(body.coverImageUrl),
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!requireAdminFromRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const ok = await deleteCoaster(params.slug);
  return NextResponse.json({ ok });
}
