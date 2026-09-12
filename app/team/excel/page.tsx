import { requireUser } from "@/lib/auth";
import { ExcelImporter } from "@/components/excel-importer";
export default async function Excel(){await requireUser();return <div className="card"><h1>Import an Excel order</h1><p className="muted">Choose workbook sheets, map each sheet’s columns, then review the generated items before publishing.</p><ExcelImporter/></div>}
