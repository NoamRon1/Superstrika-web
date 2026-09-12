import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
export async function POST(request: Request) { const { email, password } = await request.json(); const user = await db.user.findUnique({ where: { email: String(email).toLowerCase() } }); if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 }); await createSession({ id:user.id,email:user.email,role:user.role,name:user.name }); return NextResponse.json({ ok:true }); }
