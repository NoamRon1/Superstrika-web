import { requireUser } from "@/lib/auth";
import { TransactionForm } from "@/components/transaction-form";
export default async function Expense(){await requireUser();return <div className="card page-card"><header className="page-heading"><h1>Add expense</h1><p>One order per entry.</p></header><TransactionForm kind="EXPENSE"/></div>}
