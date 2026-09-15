import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { fmtIls } from "@/lib/money";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [settings, entries, totals] = await Promise.all([
    db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    db.transaction.findMany({ where: { archivedAt: null }, orderBy: { createdAt: "desc" }, take: 50, include: { items: true } }),
    db.transaction.groupBy({ by: ["kind"], where: { archivedAt: null }, _sum: { ilsAmount: true } })
  ]);
  const balance = totals.reduce((sum, item) => sum + (item.kind === "GAIN" ? Number(item._sum.ilsAmount || 0) : -Number(item._sum.ilsAmount || 0)), 0);
  return <main className="container"><nav className="nav"><Link className="brand" href="/">Superstrika#7046</Link><Link className="button secondary" href="/login">Team login</Link></nav>
    <header className="public-heading"><div><h1>Team fund</h1></div><div className="team-stamp"><Image className="team-logo" src="/brand/superstrika.jpeg" alt="Superstrika 7046 RoboCup team logo" width={70} height={70} priority /><span>RoboCup Junior</span></div></header>
    <section className="fund-summary"><div className="balance-panel"><span className="eyebrow">Balance</span><div className="balance">{fmtIls(balance)}</div></div><div className="support-panel">{settings.fundingUrl ? <a className="button" href={settings.fundingUrl} target="_blank" rel="noreferrer">Support the team ↗</a> : <span className="notice">Contributions unavailable</span>}</div></section>
    <section className="card section-card"><header className="section-heading"><div><h2>Activity</h2></div></header><div className="ledger">{entries.map(t => <Link className="entry public-entry" href={`/ledger/${t.id}`} key={t.id}><span className={`entry-symbol ${t.kind === "EXPENSE" ? "expense" : ""}`} aria-hidden="true">{t.kind === "GAIN" ? "+" : "−"}</span><div className="entry-copy"><h3>{t.kind === "GAIN" && t.anonymous ? "Anonymous supporter" : t.senderName || t.title}</h3><span className="muted">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(t.createdAt)} · {t.description || t.title}</span></div><div className="entry-amount"><strong style={{ color: t.kind === "GAIN" ? "var(--brand)" : "var(--red)" }}>{t.kind === "GAIN" ? "+" : "−"}{fmtIls(t.ilsAmount)}</strong><span className={`pill ${t.kind === "EXPENSE" ? "expense" : ""}`}>{t.kind === "GAIN" ? "CONTRIBUTION" : "EXPENSE"}</span></div><span className="entry-arrow muted" aria-hidden="true">↗</span></Link>)}{entries.length === 0 && <p className="empty-state">No entries yet.</p>}</div></section></main>;
}
