# Robot versions — how to add one

Real content lives in `robot-versions/` at the project root (not this folder — this one is just a checked-in example/reference). Docker mounts `robot-versions/` from the host, so you can drop files in without rebuilding or redeploying.

For each hardware version, create a folder:

```
robot-versions/
  v1-prototype/
    <anything>.stl     ← your CAD export, any filename
    info.json
  v2-competition/
    <anything>.stl
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
- Exactly one `.stl` file per folder (if there are several, the first one alphabetically is used).
- If `info.json` is missing or malformed, that version is silently skipped (check the server logs).
- If the `.stl` is missing, the version still shows up with a "3D model coming soon" placeholder instead of a crash.

Folder names (slugs) should be lowercase letters, numbers, and hyphens only (e.g. `v3-finals`).
