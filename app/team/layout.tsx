import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { TeamNav } from "@/components/team-nav";

export default async function TeamLayout({children}:{children:React.ReactNode}) {
  const user=await getSession();
  return <main className="container team-shell">
    <nav className="nav"><Link className="brand" href="/">Superstrika#7046</Link><div className="account"><span className="muted">{user?.email}</span><LogoutButton /></div></nav>
    <div className="team-layout"><TeamNav admin={user?.role==="ADMIN"}/><section>{children}</section></div>
  </main>;
}
