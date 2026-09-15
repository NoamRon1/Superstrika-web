import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TransactionForm } from "@/components/transaction-form";
export default async function Gain(){await requireUser();const people=await db.transaction.findMany({where:{kind:"GAIN",senderName:{not:null}},distinct:["senderName"],select:{senderName:true}});return <div className="card page-card"><header className="page-heading"><h1>Add contribution</h1><p>Visible publicly after saving.</p></header><TransactionForm kind="GAIN" investors={people.flatMap(x=>x.senderName?[x.senderName]:[])}/></div>}
