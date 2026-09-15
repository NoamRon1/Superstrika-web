"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/team", "Overview"],
  ["/team/gain", "Add contribution"],
  ["/team/expense", "Add expense"],
  ["/team/excel", "Import Excel"]
] as const;

export function TeamNav({ admin }: { admin: boolean }) {
  const pathname = usePathname();
  const nav = admin ? [...links, ["/team/admin", "Team settings"] as const, ["/team/archive", "Archive"] as const] : links;
  return <nav className="side" aria-label="Team workspace">
    <span className="side-label">Workspace</span>
    {nav.map(([href, label]) => <Link href={href} data-active={pathname === href} aria-current={pathname === href ? "page" : undefined} key={href}>{label}</Link>)}
  </nav>;
}
