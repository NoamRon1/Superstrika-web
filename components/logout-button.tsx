"use client";
import { useRouter } from "next/navigation";
export function LogoutButton(){const r=useRouter();return <button className="button secondary compact" onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});r.push("/");r.refresh();}}>Log out</button>}
