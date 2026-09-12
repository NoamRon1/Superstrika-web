import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
export async function GET(){await requireUser(Role.ADMIN);return NextResponse.json(await db.user.findMany({select:{id:true,email:true,name:true,role:true,createdAt:true},orderBy:{createdAt:"desc"}}));}
export async function POST(request:Request){try{const actor=await requireUser(Role.ADMIN),{email,name,password,role}=await request.json();if(!email||!password||password.length<10)throw new Error("Use an email and a password of at least 10 characters.");const user=await db.user.create({data:{email:String(email).toLowerCase(),name:name||null,passwordHash:await bcrypt.hash(password,12),role:role===Role.ADMIN?Role.ADMIN:Role.EDITOR}});await audit(actor.id,"CREATE","user",user.id);return NextResponse.json({id:user.id,email:user.email},{status:201});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Could not create user"},{status:400});}}
export async function DELETE(request:Request){try{const actor=await requireUser(Role.ADMIN),id=new URL(request.url).searchParams.get("id");if(!id||id===actor.id)throw new Error("You cannot remove your own account.");const target=await db.user.findUnique({where:{id}});if(!target)throw new Error("User not found.");if(target.role===Role.ADMIN&&await db.user.count({where:{role:Role.ADMIN}})<2)throw new Error("Keep at least one administrator.");await db.user.delete({where:{id}});await audit(actor.id,"DELETE","user",id);return NextResponse.json({ok:true});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Could not remove user"},{status:400});}}
