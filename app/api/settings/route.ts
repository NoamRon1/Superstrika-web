import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
export async function GET(){await requireUser(Role.ADMIN);return NextResponse.json(await db.settings.upsert({where:{id:1},update:{},create:{id:1}}));}
export async function PATCH(request:Request){try{const user=await requireUser(Role.ADMIN),input=await request.json();const settings=await db.settings.upsert({where:{id:1},update:{fundingUrl:input.fundingUrl||null,uploadRoot:input.uploadRoot||undefined},create:{id:1,fundingUrl:input.fundingUrl||null,uploadRoot:input.uploadRoot||process.env.UPLOAD_DIR||"/app/uploads"}});await audit(user.id,"UPDATE","settings","1");return NextResponse.json(settings);}catch{return NextResponse.json({error:"Unauthorized"},{status:403});}}
