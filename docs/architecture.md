# Architecture — Indivisibly Prime (jackharvey.me)

The living technical record for this repo: the Desk, its calibration workflow, the
viewport model, Sanity's shape, and the decisions that are locked. `CLAUDE.md` is the
short orientation; this is the detail it points at. `docs/classic.md` covers the
previous homepage, still served at `/classic`.

**Keep this file current.** When you change how the system works, update the section
that describes it in the same commit. Most of what follows is here because something
broke once — the reasoning matters more than the description, so when you supersede a
decision, say what replaced it and why rather than deleting the history.

---

## The Desk

`src/app/page.tsx` (ISR 60s) → `getHomepageSettings()` from **`src/sanity/lib/homepage.ts`** → `<DeskExperience settings>`. That one file holds `HOMEPAGE_QUERY`, a superset query shared by `/`, `/desk`, and `/classic`. `urlFor` builds image URLs client-side.

Components in `src/components/desk/`:

- **`DeskExperience.tsx`** — `"use client"` orchestrator. State: `active` (open card), `coverGone`, `pulseApp`. Renders `EntryCover`, then `DeskStageWeb` (`hidden md:block`) or `DeskStagePhone` (`md:hidden`), plus the `Modal`. `sessionStorage["desk-cover-seen"]` skips the cover on repeat visits. The shell is `fixed inset-x-0 top-0 h-[var(--app-h)]`, **not** `inset-0` — see "Viewport height" below.

### Viewport height — `--app-h`

**The phone desk no longer depends on this at all, and that is the point** (2026-09-09). It is ordinary document flow: the photo is in normal flow, the document scrolls natively, and nothing is sized to the viewport height. With no element trying to match the visible viewport, the blank-strip bug is *impossible* there rather than corrected for — the same reason breathebonsai.com never had it. The fixed, viewport-sized shell in `DeskExperience` is now `md:` only.

The desktop shell still uses `--app-h` (`100dvh`, with a `100vh` `@supports` fallback). **`dvh` is authoritative; `ViewportSync` only intervenes when the engine is measurably wrong** — it renders a hidden `100dvh` probe, and on a debounced settle it removes any override, lets `dvh` re-resolve, and re-applies a pixel value only if the probe still disagrees with `window.innerHeight`.

That conditional design is a correction of the first attempt. The original `ViewportSync` (2026-09-08) unconditionally wrote `innerHeight` into `--app-h` on every viewport event, which **made the bug more likely, not less**: `dvh` is recomputed continuously by the browser and is correct by construction, whereas a pixel snapshot is correct only until the next change. iOS fires `resize` repeatedly *through* its toolbar animation, so the last event could carry an intermediate height — and once that was written as an inline style on `<html>`, it was latched permanently and `dvh` could no longer rescue it. The strip came back on jackharvey.me (Jack, 2026-09-09). Never write an unconditional snapshot over a live CSS value.

`body`'s background is the desk's own `#171009` rather than the white `bg-background` token, so any frame that still slips through is invisible instead of a white flash. `--background` itself stays white for the shadcn components that read it.

**`Modal` freezes the page behind it** (`position: fixed` on `body` at a negative scroll offset, restored on close). This became necessary with the phone change above: before it, the page could not scroll at all, so an open card had nothing to scroll behind it. `overflow: hidden` alone does not hold on iOS.

This is separate from the `dvh` units inside cards (`PhoneFrame`'s `32dvh`, `BookCard`'s `max-h-[77dvh]`, `Modal`'s `90dvh`) — those size content within an already-correct shell and are locked decisions. Don't convert them.

**Testing note:** headless engines cannot reproduce the real iOS toolbar-animation timing, so a green Playwright run is necessary but not sufficient — it proves the steady states are right, not the animation. The structural argument for the phone (nothing is viewport-sized) is the guarantee that does not depend on timing.

Continuing the component list above:

- **`EntryCover.tsx`** — warm-dark scrim + scroll cue, single line: `entryCoverText` verbatim, or `` `${entryTitle}'s Portfolio` `` when that's blank. Lifts on first wheel/scroll/touch/key/click, never returns that session.
- **`DeskStageWeb.tsx`** — desktop desk photo (`public/desk.png`, 1672×941). Hotspots are the objects' **true photographed outlines**, calibrated by hand in `/calibrate` (below) and stored in **`hotspots.json`**. `roundedOutline()` fillets the corners in pixel space and emits %-of-stage points, so everything scales fluidly with the window. Hovering renders two stage-sized layers: an SVG even-odd mask dimming everything *outside* the outline, and a brightened clipped copy of the same photo inside it (pixels align exactly). The outline paths also **are** the hit targets — hover/click only fire over the real object, not a bounding box around it.
- **`CalibrateTool.tsx`** + **`/calibrate`** — dev-only corner editor. See "Calibrating the hotspots".
- **`DeskStagePhone.tsx`** — one continuous photo (`public/desk-mobile.png`, 724×2172) with true photographed outlines as hit targets, calibrated by hand in **`/calibrate-mobile`** and stored in **`hotspots-mobile.json`**. Labels sit at their calibrated anchors. It takes only `onOpen` and `entryTitle` — no `pulseApp`/`onInteract`, since there's no attract outline here (see locked decisions). The cover title is overlaid on the photo's own top margin — **not** a nav bar, not sticky/fixed, so it scrolls away with the desk (Jack tried a sticky bar first, then asked for the overlay). No "Jack Harvey" footer, and no separate "scroll to reveal the desk" intro screen. Replaced the old four-stacked-scene-image approach (`PHONE_SCENES` / `desk-phone-*.png` — data + files still present but unused, kept as a revert path).
- **`Modal.tsx`** — card shell; ✕ / Esc / backdrop close. `size` prop: `about` → `wide`, everything else → `xl`. Widths went `xl` 76→84rem and `wide` 60→66rem on 2026-09-09 to carry the desktop 1.5× type scale (below) — and specifically so the Book's title fits one line.
- **`PhoneFrame.tsx`** — reusable iPhone mockup in pure CSS/HTML (no image asset, no Apple artwork). One fixed shell; images cross-fade *inside* its screen, clipped by the corner radius — never bake a bezel into an asset. Every dimension derives from one custom property `--pw` (device width) so it scales as a unit. `--pw = min(maxWidth, 32dvh, 54vw)`: **32dvh** keeps the ~2.1×-tall device inside the modal on short laptops, **54vw** keeps it clear of the modal's ✕ on phones. Screen is `aspect-ratio: 1170/2532` — feed it 19.5:9 images or `object-cover` side-crops them. **The vw term is the phone-only size lever**: it can only bind below a ~520px viewport, so changing it (62→54 on 2026-09-08, when Jack wanted the device smaller on mobile) never touches desktop, where `maxWidth` wins.
- **`cards/`** — `AppCard`, `BookCard`, `NftCard`, `AboutCard`, plus `ContactForm`, `MailingListForm`, `shared.tsx` (`Eyebrow`, `ActionButton`, the button scale constants).

### The desktop type & button scale

Two passes, both **web-only** — the phone is deliberately untouched at every step ("the text is good across the board" on mobile, Jack, 2026-09-09).

**1.5× on everything supporting** (2026-09-09). Each size is its old value plus an `md:` value exactly 1.5× it, and padding scales the same way:

| base | `md:` | used for |
|---|---|---|
| `text-xs` (12px) | `md:text-lg` (18) | section labels, date ranges, form labels |
| `text-sm` (14) | `md:text-[1.3125rem]` (21) | button labels, experience/talents entries, inputs, status lines |
| `text-base` (16) | `md:text-2xl` (24) | the App/Book commentary, the About intro + tagline, the NFT subtitle |
| `text-lg` (18) | `md:text-[1.6875rem]` (27) | the App tagline |

Buttons: `px-6 py-2.5` → `md:px-9 md:py-[0.9375rem]`, icons `h-4 w-4` → `md:h-6 md:w-6`, all inside the shared `solidButton` / `ghostButton` / `linkAction` strings — so the App/Book CTAs, Send Message and Subscribe grew together, as they're meant to.

**15% on the titles** (2026-09-10) — 1.5× would have wrapped them. App/Book cap at `3.45rem` (48 → 55.2px), NFT is a flat `md:text-[2.5875rem]` (36 → 41.4px), and the About card's name went `sm:text-4xl` → `md:text-5xl` to match. How the App and Book titles are *sized* is its own locked decision (see the Book cover bullet below) — they measure against their text column, not the viewport.

**Two buttons opt out**, via `className` / `iconClassName` on `ActionButton`, merged with `cn()` (tailwind-merge, so the override beats the shared string):

| Constant | Effect | Where |
|---|---|---|
| `buttonScale75` / `buttonIconScale75` | three quarters of the desktop size | the NFT card's "All NFT Galleries" — the art should hold the attention, not the button. Its encrypted line drops to `md:text-[0.84375rem]` to match |
| `buttonScalePhone` / `buttonIconScalePhone` | no desktop step at all | the mailing list's Subscribe |

The **whole mailing-list section keeps the phone sizes on the web** — a third smaller than everything around it (Jack, 2026-09-10). That's `sectionLabelBase` (the label string without `md:text-lg`) for its heading, and **no `md:` classes at all** inside `MailingListForm`. If you add the desktop step back to that form, you've undone this.

The App carousel is the one control that scales on **both** viewports: arrows `h-[3.375rem]` → `md:h-[5.0625rem]` with 24/36px chevrons, dots and gaps grown to match (Jack, 2026-09-10 — another 50% on top of the web-only bump the day before). Keep the row scaling as a unit; it reads as one control.

Every size above is an `md:` variant, so **the phone renders exactly as it did before** — if you add one here without the `md:` prefix, you've changed mobile too.

- **`AppCard.tsx` / `BookCard.tsx`** render two *entire* layouts (`flex flex-col md:hidden` for mobile, `hidden md:grid ...` for desktop), built from shared JSX consts (`media`, `titleBlock`, `descriptionBlock`, `buttonsBlock`) defined once and referenced in both — not one responsive grid with `order-*` tricks. **Because those consts render in both layouts, any phone-only styling on them must be reset at `md`** — the Book cover's mobile size cut is `w-[78%] md:w-full`, and dropping the `md:` half would silently shrink the desktop card too. Mobile order (2026-09-02, Jack's call) is title → media → description → buttons; desktop is untouched from before that change. Both layouts are always mounted (same pattern as `DeskStageWeb`/`DeskStagePhone`), CSS just hides one — so the carousel/cover renders twice in the DOM, harmless. If you need to change desktop, edit inside the `hidden md:grid` block; for mobile order, edit the `md:hidden` block; for shared content (copy, images, button hrefs), edit the const definitions above both.

### Calibrating the hotspots

Object outlines are **not** measured in code, and must not be. Both attempts at that failed: eyeballing zoomed crops was off by 5–25px, and gradient edge-fitting locked onto the wrong edge entirely (the phone's screen instead of its bezel, the book's printed border instead of its cover). In a photo with soft shadows and interior lines stronger than the true boundary, "where the object ends" is a judgment call — so a human makes it.

```
npm run dev   →   localhost:3000/calibrate          # web desk   → hotspots.json
              →   localhost:3000/calibrate-mobile   # phone desk → hotspots-mobile.json
```

Click each object's corners on the photo (points insert on the nearest edge, so order doesn't matter); drag to adjust with a **9× loupe** for exact pixels; arrow keys nudge 1px, Shift+arrow 10px. Corner-radius slider, draggable label anchor, live spotlight preview. **Save** (or ⌘S) writes the JSON and the desk hot-reloads.

- Both JSON files are generated — **never hand-edit them**; re-run the tool.
- Corners are pixels in the *source photo*, clockwise from top-left. Four is normal; add more for a non-quad (the book's page fore-edge once needed a fifth).
- Iterate the **known ids**, never `Object.keys(GEOMETRY)` — the files also carry `_comment`, which has no `corners`.
- **Two tools, two files, two photos, deliberately.** `desk.png` is 1672×941 and `desk-mobile.png` is 724×2172 — completely different crops of a different scene, so corners can't be shared. `/calibrate-mobile` is the same interaction model laid out for a 1:3 photo: the stage scrolls in its own column beside sticky controls, with a zoom slider, and the label handle renders the *real* word at the real anchor so placement is judged on the actual thing. `roundedOutline()` / `bbox()` take optional `w`/`h` (defaulting to the web dims) so both call the same geometry code.

**`/calibrate` (web) is local-only, and that's the settled call** (Jack, 2026-08-17). It briefly ran on jackharvey.me behind Basic auth; that was reverted because saving means writing to the source tree, which a serverless filesystem can't do — the calibrated result only reaches the live site through a commit either way, so production had nothing to offer. The workflow is: calibrate locally → Save → commit `hotspots.json`.

**`/calibrate-mobile` is local-only too, and that's now settled** (2026-09-02). It was briefly deployed read-only (Copy/Download JSON instead of Save, since Vercel's filesystem can't be written to); Jack used it for one pass, then asked for it taken down — he doesn't want the tool visible to anyone else. **Both tools now 404 in production, as do both write endpoints.** This is the second time deploying a calibrate tool has been tried and reverted; the workflow is localhost → Save (or Download) → commit. Don't propose deploying it a third time.

- The tool keeps **Copy JSON / Download** beside Save locally — Jack's stated workflow is "calibrate on localhost, then download," useful when the result travels by hand instead of landing straight in the working tree.
- `serialise()` duplicates the route's formatting on purpose (the route is server-only), so exported text is byte-identical to a Save. It iterates the **known ids**, never `Object.keys(geo)` — the latter is precisely how the web version once crashed in production, mapping `.corners` on the `_comment` string.

It costs the live site nothing: the tool compiles to its own ~14KB chunk referenced only by `/calibrate`'s manifest, and appears zero times in the homepage HTML. Don't "optimise" it out on performance grounds — that was measured, not assumed. If you ever *do* want click-to-save in production, the geometry has to move somewhere persistent; Sanity is the natural home, since auth and hosting already exist there.

### Assets

- **Not in Studio, by choice**: `public/desk.png`, `public/desk-phone-*.png`, `public/crops/*`. Regenerate crops/scenes from `desk.png` with PIL.
- **Swapping either photo is never just a file copy.** For `desk.png`: `hotspots.json` (corners + label anchors — redo in `/calibrate`), `public/crops/*`, and the alt text are all calibrated to its pixels. For `desk-mobile.png`: `hotspots-mobile.json` (redo in `/calibrate-mobile`). A swap alone leaves every hotspot pointing at bare wood. `desk.png` was last swapped **2026-08-16** (same 1672×941): the brass gong is gone, the open "Alex Mori" journal is now a closed leather notebook embossed *Jack Harvey*, and the phone shows Breathwork. `desk-mobile.png` was swapped three times on **2026-09-02** while Jack tried mobile directions — if the corners look wrong, the photo probably moved again; re-run `/calibrate-mobile` rather than nudging the JSON.
- **`public/app-screens/*.webp`** — six real Bonsai screens (828×1792), wired as `FALLBACK.appScreens`. Sanity's `appImages` wins whenever it's non-empty.
- Every card falls back to `public/crops/*` plus sensible copy when its Sanity fields are empty (`FALLBACK` in `data.ts`), so the site looks complete before Studio is filled. `FALLBACK.journal` / `crops/journal_left.png` keep their names but now hold the leather notebook, cut 4:5 — the About card no longer imposes an aspect on it (see below), so it simply renders at its own. `crops/phone_screen.png` is regenerated for consistency but nothing reads it.
- CSS lives in `globals.css` under the `desk-*` namespace: `desk-pulse`, `desk-rise`, `desk-scroll-cue`.

### Locked decisions — don't undo these without asking Jack

- The cards are **black & white**. An "Editorial Monograph" ivory/oxblood restyle was built and explicitly reverted.
- The App attract pulse **persists through hover** — hovering only spotlights. It clears on an actual click.
- **No visible outline on hover, ever.** Hovering dims everything else and relights the object; there is deliberately no white ring (Jack, 2026-08-17). The single exception is the **App attract outline** on the web desk — it blinks on arrival to earn the first click and is gone permanently once any card opens. If you add a ring back to hover, you've broken this.
- **The App attract cue** is gated on `revealed` (the cover having lifted — otherwise it plays unseen behind it) and fades out over 900ms on the first click rather than snapping. It traces itself on once around the phone, then breathes. A "dim the other three objects" layer briefly ran alongside it; Jack asked for that removed on 2026-08-20 while keeping the outline, so don't re-add it without being asked.
- **Anything stroked on the desk needs the pixel viewBox** (`0 0 1672 941` + `toPathPx`), not the 0–100 one. The 0–100 viewBox needs `preserveAspectRatio="none"`, which scales x and y differently: strokes come out fatter on one axis, and dash lengths stop agreeing with `getTotalLength()`. The draw-on measures the path in JS (`useDrawOn`) because `pathLength="1"` does *not* normalise dash units — that renders as dozens of marching dashes instead of one travelling segment. Both mistakes were made and fixed on 2026-08-20; don't redo them.
- **The phone desk has no attract outline at all** (Jack, 2026-09-02). The white pulsing ring around the App was ported from the web desk, then removed on the same day — don't re-add it. In its place are the **engraved cues**: "Click for details" + an arrow, set into the bare wood beside the App and the Book, styled to look carved rather than painted on (ink darker than the wood, warm highlight offset 1px *below*). The arrow draws its highlight as a real offset path, not a `drop-shadow` — on a stroke that thin a blurred shadow washes out and the arrow vanishes into the wood. Two lines, because that strip of wood is only ~36% of the photo wide and one line overran and clipped. The cues are `pointer-events-none`, so they can't steal a press and the calibrated tap areas stay exactly as measured.
- **Phone labels carry an arrow, not a number.** The web desk keeps "1 · App"; the phone shows just the word plus a small arrow pointing back at its object. Direction is derived from `labelPlace` (`above` → down, `below` → up), so recalibrating a label to the other side flips its arrow automatically — don't hardcode it per id.
- The phone title (`entryCoverText`) is `clamp(1.25rem, 7.1vw, 2rem)` with `whitespace-nowrap`: it **must stay on one line**, so it scales with the viewport rather than wrapping. It was 3× larger briefly (`2.85rem`) before Jack asked for ~30% off to fit one line.
- **Every card carries its numbered eyebrow** — "01 — The App", "02 — The Book", "03 — The NFTs" (not "The Art"), on both viewports. They were pulled on 2026-09-10 to see how the cards felt without them and restored the next day, so the experiment is settled: they stay. The `Eyebrow` is also **deliberately outside the desktop 1.5× scale** — Jack asked for the old font size and style back with it, so it is plain `text-xs` with no `md:` step. Don't "finish" the scale by adding one. Tiles use `object-contain` — no cropping; they read wider because the modal is `xl`, not because the aspect was forced.
- Book cover is deliberately cropped `aspect-[3/4]` — Jack's upload is a 3:2 landscape photo, so this crops in rather than padding out. The cover drives the card's height, so it's the lever for "make the Book card taller": it fills a `31.5rem` column (lg+) = 672px tall, with `max-h-[77dvh]` as the short-laptop cap. It **no longer matches the App card's phone height** — that pairing was retired on 2026-08-17 when Jack asked for the Book card ~15% taller (27.5rem/587px → 31.5rem/672px). The modal's own width is unchanged; the text column just narrows. `bookSubtitle` has **no code fallback**; it renders only if set.
- **The Book title must sit on one line on the web** (Jack, 2026-09-09 — it was breaking after "The Greatest Wisdom of"), *and* it had to grow 15% (2026-09-10). A viewport-based clamp can't do both: the text column is far narrower than the window, so a `vw` figure big enough at 1512px wraps at 1280. **So the App and Book titles are sized against their own text column.** The desktop layout's text `<div>` carries `style={{ containerType: "inline-size" }}` and the `h2` uses `cqi` — Book `md:text-[clamp(2rem,7.6cqi,3.45rem)]`, App `md:text-[min(6.9cqi,3.45rem)]`. The default Book title needs ~7.9% of the column width per line, so 7.6cqi always fits with room to spare. Measured: 48px on one line at a 1327px window, 53px at 1512, 55.2px (the cap) once the column passes ~727px. The `rem` cap is also the failure mode — without a container `cqi` resolves against the viewport, and `min()`/`clamp()` pins that to 55.2px instead of something enormous. **Don't drop the `containerType` style**, and don't reach for `whitespace-nowrap` (it overflows the modal); a much longer `bookTitle` from Studio wants a lower `cqi` figure. Below a ~1100px window the `2rem` floor gives up the one-line rule rather than shrink the title into illegibility. Mobile wraps, as it always did.
- The App card plays `appGongSound` **once on open, on both the Desk and `/classic`**. The Desk uses a mount effect (the card only mounts when opened) with cleanup that stops a gong still ringing when the card closes.
- **Career Experience lists the company first, in bold, with the job title italic beneath it** (Jack, 2026-09-09 — they were the other way round, title bold on top). The company `<p>` is conditional and the job title is not, so an entry with no company still renders. This one is *not* `md:`-gated: it's the order on both viewports.
- About card has **no eyebrow above the name**. Layout is an **identity banner** — photo left, name + tagline + socials on one line beside it, intro under them — with Experience, Talents and the mailing list stacked **full-width beneath**, not alongside the photo (Jack, 2026-08-17). Social buttons went `h-9` → `h-12` (2026-08-17) → **`h-16 w-16`** (2026-09-10, another 33%, both viewports) with `1.8rem` icons; they stay on the name's line, centred against it, because the row is `md:items-center` — growing them doesn't move them. The ✉️ toggles the contact form into the full-width area below. `aboutIntroText`, when Jack writes one, sits a clear line below the name/tagline (`mt-8 md:mt-11`, was `mt-5`).
- **The About photo is never cropped** (Jack, 2026-09-11). It used to be forced into a 4:5 portrait twice over — `.width(600).height(750)` on the CDN URL *and* `aspect-[4/5] object-cover` in CSS — which threw away about half the width of Jack's actual upload, a 4032×3024 landscape. Now the URL asks for a width only and the `<img>` sets its own height, so whatever he uploads is shown whole. The photo *column* adapts too: `AboutCard` parses the pixel dimensions out of the asset ref (`image-<id>-<w>x<h>-<ext>`), and anything wider than 1.1:1 gets a 22rem column (320px on phone) instead of the portrait 15rem — otherwise a landscape shot renders as a thumbnail beside a 48px name. Don't reintroduce a `height()` or an `aspect-*` here; if a future upload needs framing, crop it in Studio, where Jack can see what he's cutting.
- **Career Experience entries are spaced `pb-8 md:pb-12`** (was `pb-6` — Jack asked for about one more line between roles, 2026-09-10). The rule connecting the logos is `w-px flex-1`, so it stretches to the new gap by itself and stays unbroken; don't give it a fixed height.
- **Other Talents & Interests entries** (`logoFreeformEntries`): `title` (bold) and `subtitle` (unbold) render **inline on one line** — `subtitle` is the field for "next to the title," despite its Studio label once implying otherwise (fixed 2026-09-02). `description` is a *separate* field that renders as its own paragraph on the line below; leave it blank unless you actually want a second line under the inline one. Don't put the same text in both — that was the bug Jack hit (title held the whole string, description repeated it).
- The name/socials row sits `mt-5` below the grid's top edge (nudged down from flush-with-the-photo on 2026-08-20 — "just a tad," not a measured value), **not** pinned to the photo's top edge — don't reintroduce `self-start` on the socials or you'll silently undo this. On desktop the socials are centred to the **name specifically** (an `order-1`/`order-2` flex-wrap trick: name + socials share the first line via `items-center`, and the tagline is forced onto its own full-width second line via `md:w-full` + `order-3`) — not to the whole name+tagline block, which is how it looked before 2026-09-02 and read as visually low. Mobile is untouched: name, tagline, socials stack in that DOM order regardless of the `order-*` classes, since mobile never wraps to a second line.
- **Primary buttons are solid black from the start** — never outline-that-fills-on-hover, and hover must not invert to white (Jack, 2026-08-17). One shared `solidButton` class in `cards/shared.tsx` covers every card CTA plus Send Message and Subscribe; hover lifts, deepens the shadow, warms to `neutral-800`, and nudges the arrow. Change it there, not per-button. `ActionButton` also has a `link` variant — underlined text + ↗, no box — used as the quieter second option beside a solid button (the Book card's Website link).
- Book card shows **two actions**: the solid CTA (`bookButton*`) and, when `bookWebsiteButtonUrl` is set, a Website button beside it (`bookWebsiteButton*`, Desk only). Blank URL hides it entirely. That second button is the **`ghost` variant in a `gap-3` row — pixel-identical to the App card's Website button** (Jack, 2026-09-11). It was the underlined `link` variant until then, which read as a different kind of control next to the App's; if you change one card's pair, change both.
- On the desk, every label now sits **outside its object** — "About Me" moved from centred-on-the-notebook to `below` it (Jack's call, 2026-08-17), and the NFTs label was pulled close above the frame once the outline stopped over-reaching. Keep label gaps in that spirit: snug, just clear of the outline.
- App/Book/NFT deliberately **share the `xl` modal size**; About is the odd one at `wide`.

### Known Studio gaps (content tasks, not code)

- `nftSectionTitle` is literally `"NFTs"`, which `NftCard` treats as *unset* — so the card shows "The Lost Library of Alexandria". Any other string is used verbatim.
- `nftSectionSubtitle` has **no code fallback** (2026-09-10). It used to default to "Select highlights from the collection", which kept reappearing on a card Jack wants without a subtitle. Blank in Studio is blank on the card — the same rule as `bookSubtitle` and `comingSoonTagline`.

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
| `● Desk only` | `entryTitle`, `entryCoverText`, `bookSubtitle`, `appTagline`, `appImages`, `appWebsiteButton*`, `nftSectionTitle`, `aboutTagline`, `aboutImage` |
| `◆ Desk + Classic` | everything else in tabs 1–6 |
| `○ Classic only` | `navItems`, all `hero*`, `comingSoonItems` — the last tab, safe to ignore |

**`entryTitle` vs `entryCoverText`** — two fields on purpose. `entryCoverText` is the cover line typed verbatim (added 2026-08-17 so Jack controls the whole greeting, not just a name slotted into `"'s Portfolio"`); `entryTitle` is the bare name, which the About card still needs as its heading. Blank cover text falls back to `` `${entryTitle}'s Portfolio` ``, so nothing broke when the field was added.

`entrySubtitle` was deleted on 2026-08-06 — it held no data, was never read from `settings`, and its render branches were unreachable. The entry cover is single-line in code now, with no subtitle prop to revive.

`comingSoonTagline` renders wrapped in `( )`, so both copies of the mailing-list form (`cards/MailingListForm.tsx` and `ExploreSection`'s private one) **trim it and render nothing when it's empty** — Studio's only way to blank an already-filled string field is a single space, which used to show up as a bare "( )" (Jack, 2026-09-09). Blank means no line at all, not empty brackets; the field's Studio description says so.

Note the near-miss pairs: `comingSoonTagline` is on the **About** tab (it's the mailing-list line on the About card) while `comingSoonItems` is classic-only; `appImages` is Desk-only but `appImage` is shared.

Gallery items carry an optional `url`; clicking falls back to `ctaButtonUrl`. Types live in `src/lib/types.ts`.

Sanity **files** (hero videos, the gong) have no URL builder — `sanityFileUrl()` in `src/lib/sanityFile.ts` assembles the CDN URL from the `file-<id>-<ext>` ref. One shared copy; don't inline a fourth.

### Studio structure

`src/sanity/structure.ts` lists items **explicitly** — a new document type will not appear until you add it there. `homepageSettings` is a singleton pinned to `2d3fb790-8d0b-442f-b91e-362a31cf9ad3` so the sidebar opens the form directly; `sanity.config.ts` strips its delete/duplicate/unpublish actions, because every query reads `[0]` and a second copy would be picked at random. The unused `heroSection` type is parked under **Archive**.

Schema changes: edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`.
