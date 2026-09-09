# CLAUDE.md

**Indivisibly Prime** — Jack Harvey's personal site. Next.js 16 (App Router, React 19, TS) + Sanity v4 + Tailwind v4 + shadcn/ui. Lucide icons. One Aceternity effect (`encrypted-text`).

```
npm run dev      # localhost:3000
npm run build
npm run lint
```

Studio is embedded at `/studio`. Push to `main` → Vercel deploys (remote: `IndivisiblyPrime/indivisibly-prime`).

**Always commit and push when the work is done** (Jack, 2026-09-09) — don't leave finished changes sitting in the working tree waiting to be asked. Lint and build first, update `docs/architecture.md` in the same commit when the change touches what it describes, then commit to `main` and push, which deploys. Ask first only for something Jack would want to see before it's live.

## Architecture

**[`docs/architecture.md`](docs/architecture.md) is the technical record** — the Desk, the hotspot calibration workflow, the viewport model, Sanity's shape, and the **locked decisions that must not be undone without asking Jack**. Read the relevant section before changing anything beyond copy, and **update it in the same commit when you change what it describes.** Nearly every gotcha in it was paid for once already.

`docs/classic.md` covers the previous homepage, still served at `/classic`.

## Routes

| Route | What |
|---|---|
| `/` | **The Desk** — the live homepage. See `docs/architecture.md`. |
| `/desk` | thin alias of `/` |
| `/classic` | the previous homepage, preserved. See `docs/classic.md`. |
| `/api/contact`, `/api/subscribe` | forms → Resend email |
| `/api/revalidate` | ISR revalidation |
| `/calibrate`, `/api/calibrate` | **local only** (404 in prod) — click the desk objects' corners, writes `hotspots.json` |
| `/calibrate-mobile`, `/api/calibrate-mobile` | **local only** (404 in prod) — same tool for the phone photo, writes `hotspots-mobile.json` |
| `/preview-mobile` | **local only** (404 in prod) — the real site in a phone-width iframe, for checking mobile from a laptop |

Revert path if the Desk ever needs undoing: git tag `pre-desk-redesign` / branch `backup/classic-homepage`, or point `src/app/page.tsx` back at `Navbar` + `HeroSection` + `ExploreSection`. Tag `v1.0-desk-live` is the Desk as it stood on 2026-08-06, before the favicon fix and the Studio reorg.

`/` preloading all five desk PNGs (~4.1 MB) on both viewports is **Jack's explicit decision**, not an oversight. Don't "optimise" it away.

## Environment

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=

RESEND_API_KEY=            # /api/contact + /api/subscribe
CONTACT_EMAIL=             # where those emails land
CONTACT_FROM_EMAIL=        # sender (defaults to onboarding@resend.dev)
```

Schema changes: edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`.
