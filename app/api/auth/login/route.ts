import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_MAX_AGE_SECONDS,
  COOKIE_NAME,
  signAdminToken,
  verifyCredentials,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { username, password } = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  if (!username || !password) {
    return NextResponse.json({ error: "missing credentials" }, { status: 400 });
  }
  const ok = await verifyCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }
  const token = signAdminToken(username);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return NextResponse.json({ ok: true, username });
}
