import path from "path";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { findImageFileForSlug } from "@/lib/robot-versions";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug === "." || slug === ".." || slug.includes("/") || slug.includes("\\")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = await findImageFileForSlug(slug);
  if (!filePath) return new NextResponse("Not found", { status: 404 });

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";

  try {
    const data = await readFile(filePath);
    return new NextResponse(data, { headers: { "content-type": contentType, "cache-control": "no-store" } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
