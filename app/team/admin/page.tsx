import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { AdminPanel } from "@/components/admin-panel";
export default async function Admin(){await requireUser(Role.ADMIN);return <div className="card"><h1>Administration</h1><p className="muted">Manage the public funding link, upload storage path, and team access.</p><AdminPanel/></div>}
