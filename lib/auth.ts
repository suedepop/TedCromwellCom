import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export const COOKIE_NAME = "admin_token";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface AdminTokenPayload extends JwtPayload {
  sub: string;
  role: "admin";
}

function requireSecret(): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET must be set");
  return JWT_SECRET;
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) return false;
  if (username !== ADMIN_USERNAME) return false;
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function signAdminToken(username: string): string {
  return jwt.sign({ sub: username, role: "admin" } satisfies AdminTokenPayload, requireSecret(), {
    expiresIn: COOKIE_MAX_AGE_SECONDS,
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, requireSecret());
    if (typeof decoded === "string") return null;
    if ((decoded as AdminTokenPayload).role !== "admin") return null;
    return decoded as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}
