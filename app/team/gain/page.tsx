import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TransactionForm } from "@/components/transaction-form";
export default async function Gain(){await requireUser();const people=await db.transaction.findMany({where:{kind:"GAIN",senderName:{not:null}},distinct:["senderName"],select:{senderName:true}});return <div className="card"><h1>Log a gain</h1><p className="muted">Record a contribution. It is visible to investors immediately after saving.</p><TransactionForm kind="GAIN" investors={people.flatMap(x=>x.senderName?[x.senderName]:[])}/></div>}
