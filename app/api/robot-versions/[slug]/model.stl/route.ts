import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { findStlFileForSlug } from "@/lib/robot-versions";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === "." || slug === ".." || slug.includes("/") || slug.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = await findStlFileForSlug(slug);
  if (!filePath) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readFile(filePath);
    return new NextResponse(data, { headers: { "content-type": "model/stl", "cache-control": "no-store" } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
