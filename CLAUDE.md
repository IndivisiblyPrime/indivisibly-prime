# CLAUDE.md

**Indivisibly Prime** — Jack Harvey's personal site. Next.js 16 (App Router, React 19, TS) + Sanity v4 + Tailwind v4 + shadcn/ui. Lucide icons. One Aceternity effect (`encrypted-text`).

```
npm run dev      # localhost:3000
npm run build
npm run lint
```

Studio is embedded at `/studio`. Push to `main` → Vercel deploys (remote: `IndivisiblyPrime/indivisibly-prime`).

## Routes

| Route | What |
|---|---|
| `/` | **The Desk** — the live homepage. Everything below is about this. |
| `/desk` | thin alias of `/` |
| `/classic` | the previous homepage, preserved. See `docs/classic.md`. |
| `/api/contact`, `/api/subscribe` | forms → Resend email |
| `/api/revalidate` | ISR revalidation |
| `/calibrate`, `/api/calibrate` | **local only** (404 in prod) — click the desk objects' corners, writes `hotspots.json` |

Revert path if the Desk ever needs undoing: git tag `pre-desk-redesign` / branch `backup/classic-homepage`, or point `src/app/page.tsx` back at `Navbar` + `HeroSection` + `ExploreSection`. Tag `v1.0-desk-live` is the Desk as it stood on 2026-08-06, before the favicon fix and the Studio reorg.

`/` preloading all five desk PNGs (~4.1 MB) on both viewports is **Jack's explicit decision**, not an oversight. Don't "optimise" it away.

## The Desk

`src/app/page.tsx` (ISR 60s) → `getHomepageSettings()` from **`src/sanity/lib/homepage.ts`** → `<DeskExperience settings>`. That one file holds `HOMEPAGE_QUERY`, a superset query shared by `/`, `/desk`, and `/classic`. `urlFor` builds image URLs client-side.

Components in `src/components/desk/`:

- **`DeskExperience.tsx`** — `"use client"` orchestrator. State: `active` (open card), `coverGone`, `pulseApp`. Renders `EntryCover`, then `DeskStageWeb` (`hidden md:block`) or `DeskStagePhone` (`md:hidden`), plus the `Modal`. `sessionStorage["desk-cover-seen"]` skips the cover on repeat visits.
- **`EntryCover.tsx`** — warm-dark scrim + scroll cue, single line: `` `${entryTitle}'s Portfolio` ``. Lifts on first wheel/scroll/touch/key/click, never returns that session.
- **`DeskStageWeb.tsx`** — desktop desk photo (`public/desk.png`, 1672×941). Hotspots are the objects' **true photographed outlines**, calibrated by hand in `/calibrate` (below) and stored in **`hotspots.json`**. `roundedOutline()` fillets the corners in pixel space and emits %-of-stage points, so everything scales fluidly with the window. Hovering renders two stage-sized layers: an SVG even-odd mask dimming everything *outside* the outline, and a brightened clipped copy of the same photo inside it (pixels align exactly). The outline paths also **are** the hit targets — hover/click only fire over the real object, not a bounding box around it.
- **`CalibrateTool.tsx`** + **`/calibrate`** — dev-only corner editor. See "Calibrating the hotspots".
- **`DeskStagePhone.tsx`** — four full-width scene images (`public/desk-phone-{app,book,nft,about}.png`) stacked vertically, each with a word label. Swap in real photos by replacing those four files.
- **`Modal.tsx`** — card shell; ✕ / Esc / backdrop close. `size` prop: `about` → `wide`, everything else → `xl`.
- **`PhoneFrame.tsx`** — reusable iPhone mockup in pure CSS/HTML (no image asset, no Apple artwork). One fixed shell; images cross-fade *inside* its screen, clipped by the corner radius — never bake a bezel into an asset. Every dimension derives from one custom property `--pw` (device width) so it scales as a unit. `--pw = min(maxWidth, 32dvh, 62vw)`: **32dvh** keeps the ~2.1×-tall device inside the modal on short laptops, **62vw** keeps it clear of the modal's ✕ on phones. Screen is `aspect-ratio: 1170/2532` — feed it 19.5:9 images or `object-cover` side-crops them.
- **`cards/`** — `AppCard`, `BookCard`, `NftCard`, `AboutCard`, plus `ContactForm`, `MailingListForm`, `shared.tsx` (`Eyebrow`, `ActionButton`).

### Calibrating the hotspots

Object outlines are **not** measured in code, and must not be. Both attempts at that failed: eyeballing zoomed crops was off by 5–25px, and gradient edge-fitting locked onto the wrong edge entirely (the phone's screen instead of its bezel, the book's printed border instead of its cover). In a photo with soft shadows and interior lines stronger than the true boundary, "where the object ends" is a judgment call — so a human makes it.

```
npm run dev   →   localhost:3000/calibrate
```

Click each object's corners on the photo (points insert on the nearest edge, so order doesn't matter); drag to adjust with a **9× loupe** for exact pixels; arrow keys nudge 1px, Shift+arrow 10px. Corner-radius slider, draggable label anchor, live spotlight preview. **Save** writes `src/components/desk/hotspots.json` and the desk hot-reloads.

- `hotspots.json` is generated — **never hand-edit it**; re-run the tool.
- Corners are pixels in `desk.png`, clockwise from top-left. Four is normal; add more for a non-quad (the book's page fore-edge once needed a fifth).
- Iterate the **known ids**, never `Object.keys(GEOMETRY)` — the file also carries `_comment`, which has no `corners`.

**The tool is local-only, and that's the settled call** (Jack, 2026-08-17). It briefly ran on jackharvey.me behind Basic auth; that was reverted because saving means writing to the source tree, which a serverless filesystem can't do — the calibrated result only reaches the live site through a commit either way, so production had nothing to offer. The workflow is: calibrate locally → Save → commit `hotspots.json`.

It costs the live site nothing: the tool compiles to its own ~14KB chunk referenced only by `/calibrate`'s manifest, and appears zero times in the homepage HTML. Don't "optimise" it out on performance grounds — that was measured, not assumed. If you ever *do* want click-to-save in production, the geometry has to move somewhere persistent; Sanity is the natural home, since auth and hosting already exist there.

### Assets

- **Not in Studio, by choice**: `public/desk.png`, `public/desk-phone-*.png`, `public/crops/*`. Regenerate crops/scenes from `desk.png` with PIL.
- **Swapping `desk.png` is never just a file copy.** Four things are calibrated to the pixels: `hotspots.json` (corners + label anchors — redo in `/calibrate`), `PHONE_SCENES` (the four scene crops *and* the `object` % inside each), `public/crops/*`, and the alt text. A swap alone leaves every hotspot pointing at bare wood. The photo was last swapped **2026-08-16** (same 1672×941): the brass gong is gone, the open "Alex Mori" journal is now a closed leather notebook embossed *Jack Harvey*, and the phone shows Breathwork.
- **`public/app-screens/*.webp`** — six real Bonsai screens (828×1792), wired as `FALLBACK.appScreens`. Sanity's `appImages` wins whenever it's non-empty.
- Every card falls back to `public/crops/*` plus sensible copy when its Sanity fields are empty (`FALLBACK` in `data.ts`), so the site looks complete before Studio is filled. `FALLBACK.journal` / `crops/journal_left.png` keep their names but now hold the leather notebook; it is cut 4:5 to match the About card's `aspect-[4/5] object-cover`. `crops/phone_screen.png` is regenerated for consistency but nothing reads it.
- CSS lives in `globals.css` under the `desk-*` namespace: `desk-pulse`, `desk-rise`, `desk-scroll-cue`.

### Locked decisions — don't undo these without asking Jack

- The cards are **black & white**. An "Editorial Monograph" ivory/oxblood restyle was built and explicitly reverted.
- The App attract pulse **persists through hover** — hovering only spotlights. It clears on an actual click.
- **No visible outline on hover, ever.** Hovering dims everything else and relights the object; there is deliberately no white ring (Jack, 2026-08-17). The single exception is the **App attract outline** on the web desk — it blinks on arrival to earn the first click and is gone permanently once any card opens. If you add a ring back to hover, you've broken this.
- Phone scenes are **frame-less with no "Tap to open" text**; the word label is the only cue. The App cut-out is the one exception: it keeps its ring + pulse until first tap.
- NFT eyebrow reads **"03 — The NFTs"**, not "The Art". Tiles use `object-contain` — no cropping; they read wider because the modal is `xl`, not because the aspect was forced.
- Book cover is deliberately cropped `aspect-[3/4]` — Jack's upload is a 3:2 landscape photo, so this crops in rather than padding out. It is sized to land on the **same height as the App card's phone**: it fills a `27.5rem` column (lg+), and 27.5rem × 4/3 = 587px vs the phone's 588px. `max-h-[67dvh]` mirrors the phone's own dvh cap so both shrink together on short laptops instead of the cover overflowing the modal — verified 470/469 at 1440×700 with no scroll. Change one and you must change the other. `bookSubtitle` has **no code fallback**; it renders only if set.
- The App card plays `appGongSound` **once on open, on both the Desk and `/classic`**. The Desk uses a mount effect (the card only mounts when opened) with cleanup that stops a gong still ringing when the card closes.
- About card has **no eyebrow above the name**; socials + ✉️ sit below the photo in the left column. Mailing-list signup is at the bottom of the card.
- On the desk, every label now sits **outside its object** — "About Me" moved from centred-on-the-notebook to `below` it (Jack's call, 2026-08-17), and the NFTs label was pulled close above the frame once the outline stopped over-reaching. Keep label gaps in that spirit: snug, just clear of the outline.
- App/Book/NFT deliberately **share the `xl` modal size**; About is the odd one at `wide`.

### Known Studio gaps (content tasks, not code)

- `appWebsiteButtonUrl` is empty, so the Website button is hidden. Code, schema, and GROQ are all wired — just fill it in.
- `nftSectionTitle` is literally `"NFTs"`, which `NftCard` treats as *unset* — so the card shows "The Lost Library of Alexandria". Any other string is used verbatim.

## Site chrome — title, favicon, app icons

All of it lives in **`src/app/layout.tsx`**, so every route including `/studio` inherits it. Driven by `getSiteSettings()` (a small `cache()`-wrapped query in `homepage.ts`, separate from `HOMEPAGE_QUERY`).

**Pages must not declare `icons`.** App Router metadata merges shallowly — a page-level `icons` replaces the layout's entire set, including `apple-touch-icon`. That is exactly what broke the favicon on mobile: `/` declared a single unsized icon, which lost to the scaffold `favicon.ico`'s declared `sizes="256x256"`. Pages may still override `title` (`/classic` does).

- `src/app/favicon.ico` — Jack's icon at 16/32/48/64/128/256. **Must be RGBA**; Turbopack refuses to decode an RGB-encoded ICO.
- `src/app/manifest.ts` → `/manifest.webmanifest`, 192 + 512 icons for Android install.
- `apple-touch-icon` at 180×180 is what iOS Add-to-Home-Screen uses; without it iOS screenshots the page. Keep `siteFavicon` opaque — iOS fills transparency with black.
- Regenerate the `.ico` from the Sanity asset with PIL after changing `siteFavicon`.

## Sanity — `homepageSettings`

**The one rule that keeps biting**: `HOMEPAGE_QUERY` must explicitly project every field a component reads. A field missing from the projection is `undefined` in the component no matter what Studio holds. Nested arrays need full sub-projections — `experienceEntries[]{_key, logo, jobTitle, dateRange, company, description}`, `logoFreeformEntries[]{_key, logo, title, dateRange, subtitle, description}`, `comingSoonItems[]{_key, logo, title, dateRange, subtitle, description, url, exploreMoreUrl}`. All three have silently rendered blank before.

### Studio tabs mirror the Desk's cards

Tabs are cut by **what a visitor sees**, not by legacy section names, and every classic-only field is quarantined in the last tab. Ordering: `Entry Cover` · `1 · App` · `2 · Book` · `3 · NFTs` · `About` · `Site & Tab` · `○ Classic only`.

Every field description opens with a scope marker. **Keep tagging new fields** — the whole point is that Jack never has to guess which page an edit lands on:

| Marker | Means |
|---|---|
| `● Desk only` | `entryTitle`, `bookSubtitle`, `appTagline`, `appImages`, `appWebsiteButton*`, `nftSectionTitle`, `aboutTagline`, `aboutImage` |
| `◆ Desk + Classic` | everything else in tabs 1–6 |
| `○ Classic only` | `navItems`, all `hero*`, `comingSoonItems` — the last tab, safe to ignore |

`entrySubtitle` was deleted on 2026-08-06 — it held no data, was never read from `settings`, and its render branches were unreachable. The entry cover is single-line in code now, with no subtitle prop to revive.

Note the near-miss pairs: `comingSoonTagline` is on the **About** tab (it's the mailing-list line on the About card) while `comingSoonItems` is classic-only; `appImages` is Desk-only but `appImage` is shared.

Gallery items carry an optional `url`; clicking falls back to `ctaButtonUrl`. Types live in `src/lib/types.ts`.

Sanity **files** (hero videos, the gong) have no URL builder — `sanityFileUrl()` in `src/lib/sanityFile.ts` assembles the CDN URL from the `file-<id>-<ext>` ref. One shared copy; don't inline a fourth.

### Studio structure

`src/sanity/structure.ts` lists items **explicitly** — a new document type will not appear until you add it there. `homepageSettings` is a singleton pinned to `2d3fb790-8d0b-442f-b91e-362a31cf9ad3` so the sidebar opens the form directly; `sanity.config.ts` strips its delete/duplicate/unpublish actions, because every query reads `[0]` and a second copy would be picked at random. The unused `heroSection` type is parked under **Archive**.

Schema changes: edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`.

## Environment

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=

RESEND_API_KEY=            # /api/contact + /api/subscribe
CONTACT_EMAIL=             # where those emails land
CONTACT_FROM_EMAIL=        # sender (defaults to onboarding@resend.dev)
```

## Final task

Always update this file with any edits. Keep it short — deep detail belongs in `docs/`.
