import path from "path";
import { readdir, readFile } from "fs/promises";

const MODEL_EXTENSIONS = [".stl"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

export type MediaItem =
  | { type: "model"; url: string }
  | { type: "image"; url: string }
  | { type: "video"; url: string };

export type RobotVersion = {
  slug: string;
  displayName: string;
  date: string;
  order: number;
  changelog: string;
  media: MediaItem[];
};

export function robotVersionsDir() {
  return path.resolve(process.env.ROBOT_VERSIONS_DIR || "./robot-versions");
}

function mediaTypeForExt(ext: string): MediaItem["type"] | null {
  if (MODEL_EXTENSIONS.includes(ext)) return "model";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (VIDEO_EXTENSIONS.includes(ext)) return "video";
  return null;
}

async function listMediaFiles(dir: string) {
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => mediaTypeForExt(path.extname(f).toLowerCase()) !== null)
    .sort((a, b) => a.localeCompare(b));
}

export async function getRobotVersions(): Promise<RobotVersion[]> {
  const root = robotVersionsDir();
  let slugs: string[];
  try {
    slugs = (await readdir(root, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }

  const versions: RobotVersion[] = [];
  for (const slug of slugs) {
    const dir = path.join(root, slug);
    let info: { displayName?: unknown; date?: unknown; order?: unknown; changelog?: unknown };
    try {
      info = JSON.parse(await readFile(path.join(dir, "info.json"), "utf-8"));
    } catch (err) {
      console.warn(`[robot-versions] skipping "${slug}": missing or invalid info.json (${(err as Error).message})`);
      continue;
    }
    if (typeof info.displayName !== "string" || typeof info.date !== "string" || typeof info.order !== "number" || typeof info.changelog !== "string") {
      console.warn(`[robot-versions] skipping "${slug}": info.json is missing required fields (displayName, date, order, changelog)`);
      continue;
    }
    const files = await listMediaFiles(dir);
    const media: MediaItem[] = files.map((file) => ({
      type: mediaTypeForExt(path.extname(file).toLowerCase())!,
      url: `/api/robot-versions/${encodeURIComponent(slug)}/media/${encodeURIComponent(file)}`,
    }));
    versions.push({ slug, displayName: info.displayName, date: info.date, order: info.order, changelog: info.changelog, media });
  }

  return versions.sort((a, b) => a.order - b.order || a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
}

export async function resolveMediaFile(slug: string, filename: string) {
  if (!slug || slug === "." || slug === ".." || slug.includes("/") || slug.includes("\\")) return null;
  if (!filename || filename.includes("/") || filename.includes("\\") || filename === "." || filename === "..") return null;
  const ext = path.extname(filename).toLowerCase();
  if (mediaTypeForExt(ext) === null) return null;

  const root = robotVersionsDir();
  const dir = path.join(root, slug);
  if (path.relative(root, dir).startsWith("..")) return null;

  const filePath = path.join(dir, filename);
  if (path.relative(dir, filePath).startsWith("..")) return null;

  return { filePath, ext };
}
