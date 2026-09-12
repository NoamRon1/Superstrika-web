import { Role } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const key = new TextEncoder().encode(process.env.AUTH_SECRET || "unsafe-development-secret");
export type Session = { id: string; email: string; role: Role; name: string | null };
export async function createSession(user: Session) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
  const jar = await cookies();
  jar.set("fund_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function clearSession() { (await cookies()).delete("fund_session"); }
export async function getSession(): Promise<Session | null> {
  try {
    const token = (await cookies()).get("fund_session")?.value;
    if (!token) return null;
    const payload = (await jwtVerify(token, key)).payload;
    const user = await db.user.findUnique({ where: { id: String(payload.id) } });
    return user ? { id: user.id, email: user.email, role: user.role, name: user.name } : null;
  } catch { return null; }
}
export async function requireUser(role?: Role) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role === Role.ADMIN && session.role !== Role.ADMIN) redirect("/team");
  return session;
}
