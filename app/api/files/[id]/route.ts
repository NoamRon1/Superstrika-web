import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { db } from "@/lib/db";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const file=await db.attachment.findUnique({where:{id:(await params).id}});const settings=await db.settings.findUnique({where:{id:1}});if(!file||!settings)return new NextResponse("Not found",{status:404});try{return new NextResponse(await readFile(path.join(settings.uploadRoot,file.path)),{headers:{"content-type":file.mimeType,"content-disposition":`attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`}})}catch{return new NextResponse("File unavailable",{status:404});}}
