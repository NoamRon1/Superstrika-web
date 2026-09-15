import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { AdminPanel } from "@/components/admin-panel";
export default async function Admin(){await requireUser(Role.ADMIN);return <div className="card page-card"><header className="page-heading"><h1>Team settings</h1></header><AdminPanel/></div>}
