"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

type Sheet = {
  name: string;
  headers: string[];
  rows: Record<string, unknown>[];
  enabled: boolean;
  nameCol: string;
  qtyCol: string;
  priceCol: string;
  currencyCol: string;
  descriptionCol: string;
  linkCol: string;
};

export function ExcelImporter() {
  const router = useRouter();
  const [workbook, setWorkbook] = useState<File | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [adjustmentIls, setAdjustmentIls] = useState("0");
  const [description, setDescription] = useState("");
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function read(input: File) {
    setWorkbook(input);
    setMessage("");
    try {
      const parsed = XLSX.read(await input.arrayBuffer());
      setSheets(parsed.SheetNames.map(name => {
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(parsed.Sheets[name], { defval: "" });
        const headers = rows.length ? Object.keys(rows[0]) : [];
        return {
          name,
          headers,
          rows,
          enabled: false,
          nameCol: headers[0] || "",
          qtyCol: headers[1] || "",
          priceCol: headers[2] || "",
          currencyCol: headers.find(column => /currency/i.test(column)) || "",
          descriptionCol: "",
          linkCol: ""
        };
      }));
    } catch {
      setSheets([]);
      setMessage("Could not read that workbook.");
    }
  }

  function update(index: number, key: keyof Sheet, value: string | boolean) {
    setSheets(current => current.map((sheet, sheetIndex) => sheetIndex === index ? { ...sheet, [key]: value } : sheet));
  }

  async function upload(file: File, transactionId: string, kind: string) {
    const data = new FormData();
    data.set("transactionId", transactionId);
    data.set("file", file);
    data.set("kind", kind);
    const response = await fetch("/api/uploads", { method: "POST", body: data });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || `Could not upload ${file.name}.`);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const items = sheets
      .filter(sheet => sheet.enabled)
      .flatMap(sheet => sheet.rows.map(row => ({
        name: String(row[sheet.nameCol] || ""),
        quantity: Number(row[sheet.qtyCol]) || 0,
        unitPrice: Number(row[sheet.priceCol]) || 0,
        currency: String(row[sheet.currencyCol] || "ILS").toUpperCase(),
        description: sheet.descriptionCol ? String(row[sheet.descriptionCol] || "") : "",
        link: sheet.linkCol ? String(row[sheet.linkCol] || "") : ""
      })).filter(item => item.name && item.quantity > 0));

    if (!items.length) {
      setMessage("Map at least one sheet with valid item, quantity, and price values.");
      return;
    }

    setSaving(true);
    setMessage("Capturing exchange rates and saving imported order...");
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "EXPENSE",
          title: title.trim(),
          description,
          adjustmentIls: adjustmentIls || 0,
          items
        })
      });
      const transaction = await response.json();
      if (!response.ok) throw new Error(transaction.error || "Import failed.");

      if (workbook) await upload(workbook, transaction.id, "source-spreadsheet");
      if (receipt) await upload(receipt, transaction.id, "receipt");
      router.push("/team");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Order / expense name
        <input value={title} onChange={event => setTitle(event.target.value)} required placeholder="e.g. Equipment order" />
      </label>
      <label>
        Workbook
        <input type="file" accept=".xlsx,.xls" required onChange={event => event.target.files?.[0] && read(event.target.files[0])} />
      </label>

      {sheets.map((sheet, index) => (
        <div className="card" key={sheet.name}>
          <label>
            <span><input type="checkbox" checked={sheet.enabled} onChange={event => update(index, "enabled", event.target.checked)} /> Import "{sheet.name}" ({sheet.rows.length} rows)</span>
          </label>
          {sheet.enabled && <>
            <div className="grid">
              <Column label="Item name" value={sheet.nameCol} onChange={value => update(index, "nameCol", value)} options={sheet.headers} />
              <Column label="Quantity" value={sheet.qtyCol} onChange={value => update(index, "qtyCol", value)} options={sheet.headers} />
              <Column label="Unit price" value={sheet.priceCol} onChange={value => update(index, "priceCol", value)} options={sheet.headers} />
              <Column label="Currency" value={sheet.currencyCol} onChange={value => update(index, "currencyCol", value)} options={["", ...sheet.headers]} />
              <Column label="Item description (optional)" value={sheet.descriptionCol} onChange={value => update(index, "descriptionCol", value)} options={["", ...sheet.headers]} />
              <Column label="Item link (optional)" value={sheet.linkCol} onChange={value => update(index, "linkCol", value)} options={["", ...sheet.headers]} />
            </div>
            <p className="muted">Preview: {sheet.rows.slice(0, 2).map(row => JSON.stringify(row)).join(" · ")}</p>
          </>}
        </div>
      ))}

      <label>
        Order adjustment in ILS (shipping, tax, discount)
        <input type="number" step="0.01" value={adjustmentIls} onChange={event => setAdjustmentIls(event.target.value)} />
      </label>
      <label>
        Description (optional)
        <textarea value={description} onChange={event => setDescription(event.target.value)} />
      </label>
      <label>
        Receipt or source file
        <input type="file" accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls" onChange={event => setReceipt(event.target.files?.[0] || null)} />
      </label>
      <p className="muted">The original workbook and any receipt or source file will be attached to the published expense.</p>
      {message && <p className={message.includes("saving") ? "notice" : "error"}>{message}</p>}
      {sheets.length > 0 && <button className="button" disabled={saving}>{saving ? "Publishing import..." : "Review mapping and publish import"}</button>}
    </form>
  );
}

function Column({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label>{label}<select value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option} value={option}>{option || "Not supplied (ILS)"}</option>)}</select></label>;
}
