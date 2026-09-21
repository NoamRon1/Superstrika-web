import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { resolveMediaFile } from "@/lib/robot-versions";

const CONTENT_TYPES: Record<string, string> = {
  ".stl": "model/stl",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
};

export async function GET(_: Request, { params }: { params: Promise<{ slug: string; filename: string }> }) {
  const { slug, filename } = await params;
  const resolved = await resolveMediaFile(slug, filename);
  if (!resolved) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readFile(resolved.filePath);
    return new NextResponse(data, {
      headers: { "content-type": CONTENT_TYPES[resolved.ext] || "application/octet-stream", "cache-control": "no-store" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
