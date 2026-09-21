# Robot versions — how to add one

Real content lives in `robot-versions/` at the project root (not this folder — this one is just a checked-in example/reference). Docker mounts `robot-versions/` from the host, so you can drop files in without rebuilding or redeploying.

For each hardware version, create a folder with EITHER a `.stl` file (for the interactive 3D viewer) OR a photo (`.jpg`/`.jpeg`/`.png`/`.webp`/`.gif`) — whichever you have. If both are present, the 3D model takes priority and the photo is ignored.

```
robot-versions/
  v1-prototype/
    <anything>.stl     ← your CAD export, any filename
    info.json
  v2-competition/
    <anything>.jpg     ← a plain photo instead, if you don't have an STL for this version
    info.json
```

`info.json` (see `v1-example/info.json` next to this file):

```json
{
  "displayName": "שם הגרסה שיוצג",
  "date": "2026-01-15",
  "order": 1,
  "changelog": "מה השתנה מאז הגרסה הקודמת."
}
```

- **displayName** — Hebrew heading shown on the `/robot` page.
- **date** — `YYYY-MM-DD`, shown formatted; also used as a tie-breaker for sorting.
- **order** — a number; versions are listed lowest → highest. Just increment it for each new version.
- **changelog** — Hebrew text describing what changed since the previous version. Line breaks (`\n`) are preserved.

Rules:
- Exactly one `.stl` file per folder (if there are several, the first one alphabetically is used). Same for photos.
- If `info.json` is missing or malformed, that version is silently skipped (check the server logs).
- If neither a `.stl` nor a photo is present, the version still shows up with a "coming soon" placeholder instead of a crash.

Folder names (slugs) should be lowercase letters, numbers, and hyphens only (e.g. `v3-finals`).
