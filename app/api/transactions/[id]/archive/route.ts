import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){try{const user=await requireUser(Role.ADMIN),id=(await params).id;await db.transaction.update({where:{id},data:{archivedAt:new Date(),archivedById:user.id}});await audit(user.id,"ARCHIVE","transaction",id);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"Unauthorized"},{status:403});}}
