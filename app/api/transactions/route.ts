import { NextResponse } from "next/server";
import { z } from "zod";
import { TransactionKind } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { quoteToIls } from "@/lib/fx";
import { audit } from "@/lib/audit";
const item = z.object({ name:z.string().min(1), quantity:z.coerce.number().positive(), unitPrice:z.coerce.number().min(0), currency:z.string().length(3), description:z.string().optional(), link:z.string().url().optional().or(z.literal("")) });
const schema = z.object({ kind:z.enum(["GAIN","EXPENSE"]), title:z.string().min(1), description:z.string().optional(), senderName:z.string().optional(), anonymous:z.boolean().optional(), amount:z.coerce.number().positive().optional(), currency:z.string().length(3).optional(), adjustmentIls:z.coerce.number().optional(), items:z.array(item).optional() });
export async function POST(request:Request){try{const user=await requireUser();const input=schema.parse(await request.json()); let originalAmount=0,ilsAmount=0,rate=1,source="ILS parity",capturedAt=new Date(); const rows=[] as Array<{name:string;description?:string;link?:string;quantity:number;unitPrice:number;currency:string;fxRate:number;ilsTotal:number}>;
  if(input.kind===TransactionKind.GAIN){if(!input.amount||!input.currency) throw new Error("Amount and currency are required.");const q=await quoteToIls(input.currency);originalAmount=input.amount;rate=q.rate;source=q.source;capturedAt=q.capturedAt;ilsAmount=input.amount*q.rate;}
  else {const items=input.items||[]; if(!items.length) throw new Error("Add at least one expense item.");for(const i of items){const q=await quoteToIls(i.currency);const line=i.quantity*i.unitPrice*q.rate;rows.push({...i,link:i.link||undefined,fxRate:q.rate,ilsTotal:line});originalAmount+=i.quantity*i.unitPrice;ilsAmount+=line;source=q.source;capturedAt=q.capturedAt;}ilsAmount+=input.adjustmentIls||0;rate=1;}
  const tx=await db.transaction.create({data:{kind:input.kind,title:input.title,description:input.description||null,senderName:input.senderName||null,anonymous:input.anonymous||false,currency:input.kind==="GAIN"?input.currency!:"MIXED",originalAmount,ilsAmount,fxRate:rate,fxSource:source,fxCapturedAt:capturedAt,createdById:user.id,items:{create:rows}},include:{items:true}});await audit(user.id,"CREATE","transaction",tx.id,{kind:tx.kind});return NextResponse.json(tx,{status:201});
}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Unable to save transaction"},{status:400});}}
