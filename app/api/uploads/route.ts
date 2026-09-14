import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveUpload } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    await requireUser();
    const data = await request.formData();
    const transactionId = data.get("transactionId");
    const file = data.get("file");
    const kind = data.get("kind");

    if (typeof transactionId !== "string" || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "A transaction and file are required." }, { status: 400 });
    }

    const transaction = await db.transaction.findUnique({ where: { id: transactionId }, select: { id: true } });
    if (!transaction) return NextResponse.json({ error: "Transaction not found." }, { status: 404 });

    const attachment = await saveUpload(file, transactionId, typeof kind === "string" ? kind : "receipt");
    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
