"use client";
import { useRouter } from "next/navigation";
export function LogoutButton(){const r=useRouter();return <button className="button secondary" style={{padding:"6px 9px",marginLeft:8}} onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});r.push("/");r.refresh();}}>Log out</button>}
