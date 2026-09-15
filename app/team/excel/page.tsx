import { requireUser } from "@/lib/auth";
import { ExcelImporter } from "@/components/excel-importer";
export default async function Excel(){await requireUser();return <div className="card page-card"><header className="page-heading"><h1>Import Excel order</h1><p>Select sheets and match columns.</p></header><ExcelImporter/></div>}
