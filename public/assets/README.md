# Image assets

Most folders here are still empty on purpose — no stock or third-party
photography has been sourced for this project.

| Folder          | What goes in it                                                        |
| --------------- | ---------------------------------------------------------------------- |
| `product/`      | Official Flexolex package shots (transparent PNG preferred)            |
| `video/`        | The hero background video (`flexolex-hero.mp4`) — supplied, in use      |
| `lifestyle/`    | Editorial lifestyle photography (garden, market, family, stairs, routine) |
| `testimonials/` | Customer portraits, once real reviews are supplied                      |
| `logo/`         | The Flexolex logo mark                                                  |

`hero/` was reserved for a hero lifestyle photograph; the hero video
supersedes that, so the folder is unused now.

## How to switch a placeholder to a real image

1. Drop the file into the matching folder.
2. Open `src/data/assets.ts` and set that entry's `src` (the intended path is
   already written as a comment next to each one). Adjust `width`/`height` to
   the real pixel dimensions so nothing shifts on load.

That is the whole change. `ProductPlaceholder` and `ImagePlaceholder` switch to
`next/image` automatically — no component edits, no layout shift.

Alt text and a short shot brief for every slot already live in
`src/data/assets.ts`.
