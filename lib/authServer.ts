import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken, type AdminTokenPayload } from "./auth";

export function getAdminFromCookies(): AdminTokenPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function requireAdminFromRequest(req: Request): AdminTokenPayload | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const token = decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
  return verifyAdminToken(token);
}
