import { requireUser } from "@/lib/auth";
import { TransactionForm } from "@/components/transaction-form";
export default async function Expense(){await requireUser();return <div className="card"><h1>Log an expense</h1><p className="muted">Add one or more order items. Each item can have its own currency.</p><TransactionForm kind="EXPENSE"/></div>}
