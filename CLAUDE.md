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

Revert path if the Desk ever needs undoing: git tag `pre-desk-redesign` / branch `backup/classic-homepage`, or point `src/app/page.tsx` back at `Navbar` + `HeroSection` + `ExploreSection`.

## The Desk

`src/app/page.tsx` (ISR 60s) → `getHomepageSettings()` from **`src/sanity/lib/homepage.ts`** → `<DeskExperience settings>`. That one file holds `HOMEPAGE_QUERY`, a superset query shared by `/`, `/desk`, and `/classic`. `urlFor` builds image URLs client-side.

Components in `src/components/desk/`:

- **`DeskExperience.tsx`** — `"use client"` orchestrator. State: `active` (open card), `coverGone`, `pulseApp`. Renders `EntryCover`, then `DeskStageWeb` (`hidden md:block`) or `DeskStagePhone` (`md:hidden`), plus the `Modal`. `sessionStorage["desk-cover-seen"]` skips the cover on repeat visits.
- **`EntryCover.tsx`** — warm-dark scrim + scroll cue, single line: `` `${entryTitle}'s Portfolio` ``. Lifts on first wheel/scroll/touch/key/click, never returns that session.
- **`DeskStageWeb.tsx`** — desktop desk photo (`public/desk.png`, 1672×941). Hotspot rects live as % coords in `data.ts`. Hovering spotlights one object and dims the rest via `box-shadow: 0 0 0 100vmax`.
- **`DeskStagePhone.tsx`** — four full-width scene images (`public/desk-phone-{app,book,nft,about}.png`) stacked vertically, each with a word label. Swap in real photos by replacing those four files.
- **`Modal.tsx`** — card shell; ✕ / Esc / backdrop close. `size` prop: `about` → `wide`, everything else → `xl`.
- **`PhoneFrame.tsx`** — reusable iPhone mockup in pure CSS/HTML (no image asset, no Apple artwork). One fixed shell; images cross-fade *inside* its screen, clipped by the corner radius — never bake a bezel into an asset. Every dimension derives from one custom property `--pw` (device width) so it scales as a unit. `--pw = min(maxWidth, 32dvh, 62vw)`: **32dvh** keeps the ~2.1×-tall device inside the modal on short laptops, **62vw** keeps it clear of the modal's ✕ on phones. Screen is `aspect-ratio: 1170/2532` — feed it 19.5:9 images or `object-cover` side-crops them.
- **`cards/`** — `AppCard`, `BookCard`, `NftCard`, `AboutCard`, plus `ContactForm`, `MailingListForm`, `shared.tsx` (`Eyebrow`, `ActionButton`).

### Assets

- **Not in Studio, by choice**: `public/desk.png`, `public/desk-phone-*.png`, `public/crops/*`. Regenerate crops/scenes from `desk.png` with PIL.
- **`public/app-screens/*.webp`** — six real Bonsai screens (828×1792), wired as `FALLBACK.appScreens`. Sanity's `appImages` wins whenever it's non-empty.
- Every card falls back to `public/crops/*` plus sensible copy when its Sanity fields are empty (`FALLBACK` in `data.ts`), so the site looks complete before Studio is filled.
- CSS lives in `globals.css` under the `desk-*` namespace: `desk-pulse`, `desk-rise`, `desk-scroll-cue`.

### Locked decisions — don't undo these without asking Jack

- The cards are **black & white**. An "Editorial Monograph" ivory/oxblood restyle was built and explicitly reverted.
- The App attract pulse **persists through hover** — hovering only spotlights. It clears on an actual click.
- Phone scenes are **frame-less with no "Tap to open" text**; the word label is the only cue. The App cut-out is the one exception: it keeps its ring + pulse until first tap.
- NFT eyebrow reads **"03 — The NFTs"**, not "The Art". Tiles use `object-contain` — no cropping; they read wider because the modal is `xl`, not because the aspect was forced.
- Book cover is deliberately cropped `aspect-[3/4]` — Jack's upload is a 3:2 landscape photo and this exactly doubles its rendered height at the same width. `bookSubtitle` has **no code fallback**; it renders only if set.
- About card has **no eyebrow above the name**; socials + ✉️ sit below the photo in the left column. Mailing-list signup is at the bottom of the card.
- App/Book/NFT deliberately **share the `xl` modal size**; About is the odd one at `wide`.

### Known Studio gaps (content tasks, not code)

- `appWebsiteButtonUrl` is empty, so the Website button is hidden. Code, schema, and GROQ are all wired — just fill it in.
- `entrySubtitle` ("enter") is still in the schema but no longer rendered; the cover is single-line.

## Sanity — `homepageSettings`

**The one rule that keeps biting**: `HOMEPAGE_QUERY` must explicitly project every field a component reads. A field missing from the projection is `undefined` in the component no matter what Studio holds. Nested arrays need full sub-projections — `experienceEntries[]{_key, logo, jobTitle, dateRange, company, description}`, `logoFreeformEntries[]{_key, logo, title, dateRange, subtitle, description}`, `comingSoonItems[]{_key, logo, title, dateRange, subtitle, description, url, exploreMoreUrl}`. All three have silently rendered blank before.

Field groups (see `src/sanity/schemaTypes/homepageSettings.ts` for the authoritative list):

| Group | Fields |
|---|---|
| Site | `siteTitle`, `siteFavicon` |
| Entry Cover | `entryTitle` (doubles as the person's name on the About card), `entrySubtitle` (unused) |
| Navigation | `navItems[]` |
| Hero | `heroImage`, `heroVideo`, `heroVideoUrl`, `heroIntroVideo`, `heroBoredomVideo` + `heroBoredomButtonText` (both unreachable) |
| Book | `bookTitle`, `bookSubtitle`, `bookDescription`, `bookImage`, `bookButtonText`, `bookButtonUrl` |
| App Section | `appTitle`, `appTagline`, `appSubtitle`, `appButtonText`/`appButtonUrl`, `appWebsiteButtonText`/`appWebsiteButtonUrl`, `appImages[]` (carousel; falls back to `appImage`), `appGongSound` |
| NFT Gallery | `nftSectionTitle`, `nftSectionSubtitle`, `nftGallery[]` (portrait), `landscapeGallery[]` |
| CTA | `ctaButtonText`, `ctaButtonUrl`, `encryptedText` |
| About | `aboutTagline`, `aboutIntroText`, `aboutAccordion[]` (itemType `text` / `experience` / `logoFreeform`), `socialLinks[]`, `instagramUrl` |
| Coming Soon | `comingSoonTagline`, `comingSoonItems[]` |

Gallery items carry an optional `url`; clicking falls back to `ctaButtonUrl`. Types live in `src/lib/types.ts`.

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
