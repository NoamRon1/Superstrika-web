import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtCurrency, fmtIls } from "@/lib/money";
export default async function LedgerDetail({ params }: { params: Promise<{ id: string }> }) {
  const tx = await db.transaction.findFirst({ where: { id: (await params).id, archivedAt: null }, include: { items: true, attachments: true } }); if (!tx) notFound();
  return <main className="container"><nav className="nav"><Link className="brand" href="/">← Fund Ledger</Link></nav><article className="card"><span className={`pill ${tx.kind === "EXPENSE" ? "expense" : ""}`}>{tx.kind}</span><h1>{tx.kind === "GAIN" && tx.anonymous ? "Anonymous investor" : tx.senderName || tx.title}</h1><p className="muted">{tx.description}</p><h2>{tx.kind === "GAIN" ? "+" : "−"}{fmtIls(tx.ilsAmount)}</h2><p className="muted">{tx.currency === "MIXED" ? "Each item was converted to ILS at its individually captured rate." : <>Original value: {fmtCurrency(tx.originalAmount, tx.currency)} · Fixed conversion rate: {Number(tx.fxRate).toFixed(4)} ILS/{tx.currency}</>}</p>
    {tx.items.length > 0 && <><h2>Order items</h2><table><thead><tr><th>Item</th><th>Quantity</th><th>Unit price</th><th>ILS total</th></tr></thead><tbody>{tx.items.map(i => <tr key={i.id}><td>{i.name}{i.description && <><br/><span className="muted">{i.description}</span></>}{i.link && <><br/><a href={i.link} target="_blank" style={{color:"var(--brand)"}}>Item link ↗</a></>}</td><td>{String(i.quantity)}</td><td>{fmtCurrency(i.unitPrice, i.currency)}</td><td>{fmtIls(i.ilsTotal)}</td></tr>)}</tbody></table></>}
    {tx.attachments.length > 0 && <><h2>Files</h2><div className="ledger">{tx.attachments.map(a => <a className="entry" href={`/api/files/${a.id}`} key={a.id}><span>{a.name}</span><strong>Download ↓</strong></a>)}</div></>}</article></main>;
}
