# Robot versions — how to add one

Real content lives in `robot-versions/` at the project root (not this folder — this one is just a checked-in example/reference). Docker mounts `robot-versions/` from the host, so you can drop files in without rebuilding or redeploying.

For each hardware version, create a folder with any mix of media files — `.stl` models, photos (`.jpg`/`.jpeg`/`.png`/`.webp`/`.gif`), and videos (`.mp4`/`.webm`/`.mov`/`.m4v`). You can drop as many as you like into one folder; visitors flip between them with arrows on the page, in alphabetical filename order (so name your files `1-...`, `2-...` etc. if you care about the order they appear in).

```
robot-versions/
  v1-prototype/
    1-model.stl        ← your CAD export
    2-testing.mp4       ← a build/testing clip
    3-closeup.jpg        ← a detail photo
    info.json
  v2-competition/
    photo.jpg           ← just one photo, if that's all you have for this version
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
- Any number of media files per folder — they all show up, in order, with arrows to switch between them.
- If `info.json` is missing or malformed, that version is silently skipped (check the server logs).
- If a folder has no recognized media files at all, it still shows up with a "coming soon" placeholder instead of a crash.

Folder names (slugs) should be lowercase letters, numbers, and hyphens only (e.g. `v3-finals`).
