# Local fonts

## Gilroy (body / UI) — NOT YET IN THE PROJECT

Gilroy is a commercial typeface. No files have been downloaded — the licensed
`.woff2` files must be supplied by the brand owner.

Drop them here with these exact names:

```
src/app/fonts/Gilroy-Regular.woff2    (400)
src/app/fonts/Gilroy-Medium.woff2     (500)
src/app/fonts/Gilroy-SemiBold.woff2   (600)
src/app/fonts/Gilroy-Bold.woff2       (700)
```

Then follow the TODO in `src/lib/fonts.ts` (swap the temporary Manrope import
for the commented-out `localFont` block). Nothing else in the codebase needs to
change — every component reads the `--font-body` CSS variable.

Only load the four weights above. Extra weights cost bytes and hurt LCP.

## Unbounded (display / headings)

Loaded from Google Fonts via `next/font/google` — self-hosted automatically by
Next.js at build time, no runtime request to Google. No action needed.
