import path from "path";
import { readdir, readFile } from "fs/promises";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export type RobotVersion = {
  slug: string;
  displayName: string;
  date: string;
  order: number;
  changelog: string;
  hasModel: boolean;
  hasPhoto: boolean;
};

export function robotVersionsDir() {
  return path.resolve(process.env.ROBOT_VERSIONS_DIR || "./robot-versions");
}

async function findFileByExt(dir: string, extensions: string[]) {
  let files: string[] = [];
  try {
    files = await readdir(dir);
  } catch {
    return null;
  }
  const matches = files.filter((f) => extensions.includes(path.extname(f).toLowerCase())).sort((a, b) => a.localeCompare(b));
  if (matches.length > 1) console.warn(`[robot-versions] multiple matching files (${extensions.join(", ")}) in ${dir}, using "${matches[0]}"`);
  return matches[0] ?? null;
}

function findStlFile(dir: string) {
  return findFileByExt(dir, [".stl"]);
}

function findImageFile(dir: string) {
  return findFileByExt(dir, IMAGE_EXTENSIONS);
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
    const [stlFile, imageFile] = await Promise.all([findStlFile(dir), findImageFile(dir)]);
    versions.push({
      slug,
      displayName: info.displayName,
      date: info.date,
      order: info.order,
      changelog: info.changelog,
      hasModel: stlFile !== null,
      hasPhoto: imageFile !== null,
    });
  }

  return versions.sort((a, b) => a.order - b.order || a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
}

function resolveVersionDir(slug: string) {
  const root = robotVersionsDir();
  const dir = path.join(root, slug);
  if (path.relative(root, dir).startsWith("..")) return null;
  return dir;
}

export async function findStlFileForSlug(slug: string) {
  const dir = resolveVersionDir(slug);
  if (!dir) return null;
  const file = await findStlFile(dir);
  return file ? path.join(dir, file) : null;
}

export async function findImageFileForSlug(slug: string) {
  const dir = resolveVersionDir(slug);
  if (!dir) return null;
  const file = await findImageFile(dir);
  return file ? path.join(dir, file) : null;
}
