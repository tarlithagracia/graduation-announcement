# Assets

The prototype looks for these five files. Any that are missing degrade to a
labelled gradient block, so the page always runs — drop the real photos in and
they appear with no code change.

| File | What it is | Size in the design |
| --- | --- | --- |
| `hero-ash.jpg` | `ASH_5643.jpg` — the full-bleed hero portrait | 404 × 874 (cropped to 165% / 115%) |
| `grad-photo.jpg` | `IMG_3862.jpg` — used twice: the "then" card and, dimmed, the "today" collage | 362 × 241 |
| `dark-bg.jpg` | the backdrop behind the three dark panels (flipped vertically, 14% magenta tint) | 404 × 2742 |
| `job-badge.png` | the background-removed coffee cup, rotated 15° on the collage | 104 × 78 |
| `gracia-resume.pdf` | linked from the Resume pill on the card | — |

Export them from Figma at 2x and save them under these exact names.

## Fonts

`fonts/` holds Gotu and Passions Conflict (Google Fonts, SIL Open Font
License 1.1) as woff2, self-hosted so the page makes no third-party request
and works offline.
