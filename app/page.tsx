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
    <section className="team-intro card"><div><span className="eyebrow">RoboCup Junior team</span><h1>We are Superstrika#7046.</h1><p>Our students design, build, and program robots for RoboCup Junior competition. This ledger shows the contributions that support the team and how the money is used.</p></div><Image className="team-logo" src="/brand/superstrika.jpeg" alt="Superstrika 7046 RoboCup team logo" width={190} height={190} priority /></section>
    <section className="hero"><div className="card"><span className="muted">Current team balance</span><div className="balance">{fmtIls(balance)}</div><span className="muted">Updated as contributions and expenses are recorded</span></div><div className="card"><h2>Support Superstrika#7046</h2><p className="muted">Help the team pay for robot parts, tools, and competition costs.</p>{settings.fundingUrl ? <a className="button" href={settings.fundingUrl} target="_blank">Support the team →</a> : <span className="notice">The contribution link will be available soon.</span>}</div></section>
    <section className="card"><h1>Fund activity</h1><p className="muted">All current gains and expenses. Select an entry for full details and attachments.</p><div className="ledger">{entries.map(t => <Link className="entry" href={`/ledger/${t.id}`} key={t.id}><div><span className={`pill ${t.kind === "EXPENSE" ? "expense" : ""}`}>{t.kind === "GAIN" ? "GAIN" : "EXPENSE"}</span><h3 style={{ margin: "8px 0 2px" }}>{t.kind === "GAIN" && t.anonymous ? "Anonymous investor" : t.senderName || t.title}</h3><span className="muted">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(t.createdAt)} · {t.description || t.title}</span></div><strong style={{ color: t.kind === "GAIN" ? "var(--brand)" : "var(--red)" }}>{t.kind === "GAIN" ? "+" : "−"}{fmtIls(t.ilsAmount)}</strong></Link>)}{entries.length === 0 && <p className="muted">No transactions have been published yet.</p>}</div></section></main>;
}
