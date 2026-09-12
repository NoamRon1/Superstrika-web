import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { db } from "@/lib/db";
export async function saveUpload(file: File, transactionId: string, kind: string) {
  const settings = await db.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const stored = `${transactionId}-${crypto.randomUUID()}-${safeName}`;
  await mkdir(settings.uploadRoot, { recursive: true });
  await writeFile(path.join(settings.uploadRoot, stored), Buffer.from(await file.arrayBuffer()));
  return db.attachment.create({ data: { transactionId, name: file.name, path: stored, mimeType: file.type || "application/octet-stream", kind } });
}
