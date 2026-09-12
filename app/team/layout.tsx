import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
export default async function TeamLayout({children}:{children:React.ReactNode}){const user=await getSession();return <main className="container"><nav className="nav"><Link className="brand" href="/">Fund Ledger</Link><div className="muted">{user?.email} <LogoutButton /></div></nav><div className="team-layout"><aside className="side card"><Link href="/team">Overview</Link><Link href="/team/gain">Log gain</Link><Link href="/team/expense">Log expense</Link><Link href="/team/excel">Excel import</Link>{user?.role==="ADMIN"&&<><Link href="/team/admin">Admin</Link><Link href="/team/archive">Audit archive</Link></>}</aside><section>{children}</section></div></main>}
