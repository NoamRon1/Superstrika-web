import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { TransactionKind } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createContributionReceipt } from "@/lib/contribution-receipt";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const transaction = await db.transaction.findFirst({
    where: { id: (await params).id, kind: TransactionKind.GAIN },
    select: {
      id: true,
      senderName: true,
      description: true,
      originalAmount: true,
      currency: true,
      ilsAmount: true,
      createdAt: true
    }
  });

  if (!transaction) return NextResponse.json({ error: "Contribution not found." }, { status: 404 });

  const [regularFont, boldFont, logo] = await Promise.all([
    readFile(path.join(process.cwd(), "assets/fonts/NotoSansHebrew-Regular.ttf")),
    readFile(path.join(process.cwd(), "assets/fonts/NotoSansHebrew-Bold.ttf")),
    readFile(path.join(process.cwd(), "public/brand/superstrika.jpeg"))
  ]);
  const pdf = await createContributionReceipt({
    ...transaction,
    contributor: transaction.senderName || "Anonymous contributor",
    originalAmount: Number(transaction.originalAmount),
    ilsAmount: Number(transaction.ilsAmount),
  }, regularFont, boldFont, logo);

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="contribution-${transaction.id}.pdf"`,
      "cache-control": "private, no-store"
    }
  });
}
