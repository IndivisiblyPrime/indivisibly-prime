# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Indivisibly Prime** - Jack Harvey's personal website built with Next.js + Sanity CMS.

## Homepage — "The Desk" (`/`, Sanity-driven)

**The Desk is now the live homepage.** It is fully **Sanity-driven** (was a hardcoded prototype). The previous homepage is preserved verbatim at **`/classic`**; `/desk` is a thin alias of `/`. Revert path: the git tag **`pre-desk-redesign`** and branch **`backup/classic-homepage`** (both at the pre-redesign commit), or just point `src/app/page.tsx` back at `Navbar`+`HeroSection`+`ExploreSection` (all still present, used by `/classic`).

- **Data flow**: `src/app/page.tsx` (ISR 60s) fetches via the shared `getHomepageSettings()` / `HOMEPAGE_QUERY` in **`src/sanity/lib/homepage.ts`** (a superset query reused by `/`, `/desk`, `/classic`) → passes `settings: HomepageSettings` into `<DeskExperience>`. `urlFor` builds image URLs client-side.
- **Components** live in **`src/components/desk/`**:
  - `DeskExperience.tsx` — `"use client"` orchestrator. State: `active` (open card), `coverGone`, `pulseApp`. Renders `EntryCover`, then `DeskStageWeb` (`hidden md:block`) **or** `DeskStagePhone` (`md:hidden`, scrollable), and the `Modal` card. `sessionStorage["desk-cover-seen"]` skips the cover on repeat visits.
  - `EntryCover.tsx` — Stillpoint-style warm-dark scrim (`rgba(16,11,6,…)` gradient + blur) + a scroll cue. Shows a **single line only** — no second "enter" row. The title is `coverTitle` = `` `${name}'s Portfolio` `` (e.g. **"Jack Harvey's Portfolio"**), derived in `DeskExperience` from `settings.entryTitle`; the cover's `subtitle` prop is passed `""` so the old `entrySubtitle` ("enter") no longer renders (field still in schema, just unused here). Lifts away (fade + rise + scale) on first **wheel/scroll/touch/key or click**, then never returns this session.
  - `DeskStageWeb.tsx` — desktop desk (`public/desk.png`, `width:min(100vw,177.68vh)`, `aspect-ratio 1672/941`). `HOTSPOTS` array (% coords) in `data.ts`. **Hover spotlight**: the hovered rect brightens + white ring while everything else dims via `box-shadow: 0 0 0 100vmax rgba(0,0,0,0.28)` ("singles it out"). Labels `1 App / 2 Book / 3 NFTs / About Me` stay above the dim. **App attract pulse** (`.desk-pulse`) runs on the App object and **persists through hover** — hovering only spotlights, it no longer clears the pulse; the pulse lifts **only on an actual click** (`onOpen`).
  - `DeskStagePhone.tsx` — phone version: 4 full-width **scene images stacked vertically** (`public/desk-phone-{app,book,nft,about}.png`, derived from `desk.png`), each with a label. Scenes are **frame-less** (no white ring) and there is **no "Tap to open"** text — the word label is the only cue. **Exception:** the **App** cut-out keeps its white ring + `.desk-pulse` **until the first tap**, as the initial affordance. Scroll down, tap to open the card. **Swap in real phone photos** by replacing those 4 files.
  - `Modal.tsx` — responsive card shell; ✕ / Esc / backdrop close; desk visible behind `bg-black/55`. Takes a `size?: "base" | "wide" | "xl"` prop (default `"base"`) controlling fluid width: `base` = `min(96vw, 46rem)`, `wide` = `min(96vw, 60rem)` (NFT/About), `xl` = `min(96vw, 76rem)` (**App/Book** — the two biggest cards). Set per-card in `DeskExperience.tsx`.
  - `cards/` — original black/white style (the "Editorial Monograph" ivory/oxblood restyle was explored and explicitly **reverted** per Jack — don't reintroduce it without asking): `AppCard` (carousel over `appImages`, image column `minmax(0,340px)`/max `300px` art; Download & Website buttons — Website button only renders when `appWebsiteButtonUrl` is set in Studio, **currently empty** so it's hidden — code/schema/GROQ are all already wired, this is a Studio content task, not a code task), `BookCard` (image column matches App's `minmax(0,340px)`, cover art bumped to `w-64 sm:w-72`; **no hardcoded "A Complete Guide" fallback anymore** — `bookSubtitle` only renders if set in Studio), `NftCard` (eyebrow reads **"03 — The NFTs"**, not "The Art"; portrait/landscape/portrait from `nftGallery`/`landscapeGallery`, tiles bumped to `max-h-[52vh]` (was 44vh) + hover-scale + white-on-image title/year overlay, per-item URL, "All NFT Galleries" + the cryptic `EncryptedText`), `AboutCard` (socials + ✉️ at the **top**; ✉️ toggles inline `ContactForm`; Experience with company **logos in the left slot** + date as the grey line; Interests **text-only**), plus `ContactForm.tsx` and `shared.tsx` (`Eyebrow`, `ActionButton`).
- **Fallbacks**: every card falls back to the `public/crops/*` images + sensible copy when its Sanity fields are empty, so the site looks complete before Studio is filled (see `FALLBACK` in `data.ts`). Note the book-cover fallback (`crops/book_cover.png`) is a landscape flat-lay crop, wider than tall — real `bookImage` uploads may be a different aspect ratio.
- **Hardcoded assets (NOT in Studio, per Jack)**: `public/desk.png` (desktop bg) + `public/desk-phone-*.png` (phone scenes) + `public/crops/*` (card/scene fallbacks). Regenerate crops/scenes with PIL from `desk.png`.
- **New CSS** (`globals.css`, `desk-*` namespace): `desk-pulse` (App attract), `desk-rise` (cover entrance), `desk-scroll-cue`.
- **`/api/contact`** now includes the optional `phone` field in the email body.

## Personal Operating System Route (`/os`) — experimental redesign

A second **non-destructive alternate homepage** exploring the "Personal Operating System" concept (**JH.OS / INDIVISIBLE OS**): the site is a fictional desktop OS with a dune wallpaper, a top menu bar, draggable app windows, and a magnifying dock. Lives at `/os`; does not touch `/` or `/desk`.

- **Route**: `src/app/os/page.tsx` (thin server component + metadata) → renders `src/components/os/Desktop.tsx` (`"use client"`, the window manager).
- **Not Sanity-driven** — all copy/data is hardcoded in `src/components/os/content.ts` (mirrors the live Sanity content: book, app, NFTs, career/experience, interests, socials, coming-soon). Edit content there.
- **Four apps** (`AppId = bonsai | wisdom | alexandria | jack`), each a genuinely-functional mini-app:
  - `Bonsai.app` (`apps/BonsaiApp.tsx`) — working meditation timer: warm-up → session countdown, animated SVG ring, synthesized WebAudio chime (no audio asset), Timer/History/Guides/Settings tabs (Guides shows `public/crops/phone_screen.png`).
  - `Wisdom.pdf` (`apps/WisdomPdf.tsx`) — book reader: toolbar (grid/read view, page nav "n / 128", A/A font size, bookmark), ~7 flippable pages (cover `public/crops/book_cover.png` → title → foreword → sample chapters → journal `public/crops/journal_left.png` → buy CTA → thegreatestwisdomofzen.com).
  - `Alexandria.gallery` (`apps/AlexandriaGallery.tsx`) — image browser: sidebar + featured artwork + clickable thumbnails + prev/next pager over the 3 NFTs (`public/crops/nft3_girl.png`, `nft2_wave.png`, `nft1_pillars.png`), "All NFT Galleries" → OpenSea.
  - `Jack.txt` (`apps/JackTerminal.tsx`) — **live interactive terminal** (dark window): prints the profile, then accepts typed commands (`help, about, experience, interests, projects, contact, neofetch, ls, cat, date, echo, clear, open <app>`; `open`/`bonsai`/`gallery`/`book` actually launch other windows via the `onOpenApp` callback). Up/Down arrows recall command history.
- **Window manager** (`Desktop.tsx`): per-app `{open, min, rect, z, prev}` state; focus raises z-index; close/minimize/zoom(maximize) via traffic-light buttons in `Window.tsx`; pointer-drag by the titlebar (clamped on-screen). On wide screens all four windows auto-open in a cascade echoing the mockup; at `≤1024px` windows become fullscreen + non-draggable and nothing auto-opens (tap an icon to open).
- **Chrome**: `MenuBar.tsx` (brand + System/Focus/Create/Archive/Connect dropdowns wired to open apps / external links; right-side status icons + **live clock**), `Dock.tsx` (magnifying app icons with running-dots + Search/Settings/Trash; Search opens a Spotlight overlay, also `⌘/Ctrl-K`), a short **boot splash** (ensō draw-in + "INDIVISIBLE OS", click to skip), and a toast.
- **Wallpaper**: `Wallpaper.tsx` — pure SVG/CSS desert-dune scene (no external asset). Note `public/desk.png` is the `/desk` concept's flat-lay photo and is **not** used here; swap for a real photo by editing this one component.
- **Fonts/CSS**: adds `Cormorant_Garamond` (`--font-cormorant`, surfaced via the `.os-serif` class) in `layout.tsx`; OS keyframes/utilities are appended to `globals.css` under the "INDIVISIBLE OS" banner (`os-window-in`, `os-cursor`, `os-draw`, `os-scroll`, `os-rise`, …).
- **Icons**: `icons.tsx` — `Enso` brush-circle mark (brand/boot/Bonsai icon), `TxtDoc` glyph, and `AppIcon` tiles (used by desktop icons + dock).
- **To view**: `npm run dev` → http://localhost:3000/os (this session served the prod build via `next start -p 3005` because a parallel dev server held the `.next/dev` lock).
- **To promote to homepage**: render `<Desktop/>` from `src/app/page.tsx` (or swap routes). `/`, `/desk`, and all legacy sections stay intact.

## Commands

- `npm run dev` - Dev server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - ESLint
- Sanity Studio is embedded at `/studio`

## Stack

- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS v4** + **shadcn/ui** components
- **Sanity v4** headless CMS (embedded studio)
- **Aceternity UI** effects (encrypted-text — shooting-stars/stars-background are installed but no longer used in the main page)
- **Navbar `PANEL_TARGETS`**: includes `"book"`, `"app"`, `"nfts"`, `"about"`, `"comingsoon"` — all panels that live inside ExploreSection (Contact Me is folded into the About Me panel, not a separate target)
- **Lucide React** icons
- **Radix UI** (via shadcn accordion)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage - server component with ISR (60s)
│   ├── layout.tsx                  # Root layout (Geist font)
│   ├── globals.css                 # Global styles + animations (marquee, title-draw, line-draw)
│   └── studio/[[...tool]]/page.tsx # Sanity Studio mount
├── components/
│   ├── Navbar.tsx                  # Fixed navbar: transparent at top, white/blur when scrolled
│   ├── sections/
│   │   ├── HeroSection.tsx         # Full-screen hero with video/image background + intro video + scroll hint
│   │   ├── ExploreSection.tsx      # Main content area — 5-panel accordion (1.Book, 2.App, 3.NFTs, Coming Soon, About Me — Contact Me folded into About Me)
│   │   ├── Footer.tsx              # (legacy — unused, keep in place; footer removed from page.tsx)
│   │   ├── BookSection.tsx         # (legacy — unused, keep in place)
│   │   ├── NFTSection.tsx          # (legacy — unused, keep in place)
│   │   ├── CTASection.tsx          # (legacy — unused, keep in place)
│   │   └── AboutSection.tsx        # (legacy — unused, keep in place)
│   └── ui/                         # shadcn + Aceternity components
│       ├── accordion.tsx           # Radix accordion (installed, no longer used in ExploreSection)
│       ├── button.tsx
│       ├── encrypted-text.tsx      # Character reveal animation (used in NFT panel)
│       ├── shooting-stars.tsx      # (installed, not currently used)
│       └── stars-background.tsx    # (installed, not currently used)
├── sanity/
│   ├── env.ts                      # Environment variables
│   ├── lib/
│   │   ├── client.ts               # Sanity client
│   │   ├── image.ts                # Image URL builder (urlFor)
│   │   └── live.ts                 # Live preview
│   └── schemaTypes/
│       ├── index.ts                # Schema exports
│       ├── homepageSettings.ts     # Main document schema (all sections)
│       └── heroSection.ts          # Legacy hero schema
└── lib/
    ├── types.ts                    # All TypeScript interfaces
    └── utils.ts                    # cn() utility from shadcn
```

## Page Layout — the `/classic` backup

> The homepage `/` is now **the Desk** (see "Homepage — The Desk" above). The layout below and the ExploreSection/HeroSection sections that follow now describe **`/classic`** (`src/app/classic/page.tsx`), the preserved previous homepage.

```
Navbar (fixed, transparent → white on scroll)
  └── HeroSection        (full-screen video/image + intro clip + scroll hint)
  └── ExploreSection     (white bg, accordion — the main content area)
        ├── 1. Book panel      (two-col: animated title+description+button | book cover image)
        ├── 2. App panel       (two-col: animated title+description+button | iPhone portrait image; plays gong sound on open)
        ├── 3. NFTs panel      (3-col portrait/landscape/portrait grid + CTA + encrypted text)
        ├── Coming Soon panel  (responsive grid of logo+freeform cards, editable from Studio + "Join the mailing list" signup form below the cards)
        └── About Me panel     (LinkedIn/Instagram icons in header; Career Experience + grey divider + Other Talents & Interests + grey divider + folded-in Contact Me form — always visible, no sub-accordion)
```

The "Bored?" button and boredom-video swap feature have been removed from the UI (no trigger remains). The underlying `heroBoredomVideo`/`heroBoredomButtonText` schema fields and the `hero-boredom-activate` event listener in `HeroSection.tsx` are still in place but currently unreachable — safe to revive or to strip out fully in a future pass.

Footer (marquee) has been removed.

Old section order (pre-revamp): Hero → BookSection → NFTSection → CTASection → AboutSection → Footer.
The four old sections are replaced by `ExploreSection`. Do not delete the old files — they may be referenced elsewhere or revived later.

## ExploreSection Architecture

**File**: `src/components/sections/ExploreSection.tsx`

- Top-level state: `open: Set<string>` (allows multiple panels open simultaneously), `bookAnimKey` + `appAnimKey` (increment on each open to retrigger title animation)
- Five panels defined as `PANELS = [{id, title}]`: book → app → nfts → comingsoon → about (no separate `contact` panel — folded into `about`)
- A `<div className="h-[480px]" />` spacer is rendered before the `about` panel (between Coming Soon and About Me) — approximately 5 inches of whitespace; intentional design choice that can be reverted
- Panel expand/collapse uses `max-h-0` → `max-h-[500vh]` + `opacity` CSS transition
- `sanityFileUrl()` helper derives CDN URL from a `SanityFileAsset` ref (used for gong sound)

### Book Panel
- Two-column grid (`grid-cols-[1fr_1fr]`)
- Title uses `clip-path` draw animation (`animate-title-draw`) + underline draw (`animate-line-draw`) — triggered via `useEffect` + forced reflow when `isOpen` changes
- **Description + button** also animate in using `animate-title-draw-delayed` (same clip-path, but with 1.4s animation-delay so they start after the title finishes)
- Book cover image: `max-h-[55vh] object-contain`, hover scale on the `<img>` directly

### App Panel (`AppPanel`)
- Identical layout and animation to BookPanel
- Right column image constrained to iPhone portrait: `max-h-[65vh] max-w-[280px] object-contain`
- Playing a gong sound: when the "2. App" header is clicked to open, `new Audio(gongSoundUrl).play()` fires — gong audio file uploaded in Studio → App Section → Gong Sound
- `appAnimKey` drives the same forced-reflow pattern as `bookAnimKey`

### NFT Panel
- `grid-cols-1` on mobile (stacked), `grid-cols-[1fr_1.5fr_1fr]` on `sm:` desktop with `items-end` (bottom-aligned)
- Images use natural aspect ratios (`w-auto h-auto max-h-[50vh] object-contain`) — no cropping, no fixed row height
- Each grid cell wraps its image in `<div className="flex justify-center">` to centre the image in its column — **do not remove these wrappers** or the landscape image will hug the right portrait column on wide viewports
- `nftGallery[0]` | `landscapeGallery[0]` | `nftGallery[1]`
- Images have a `bg-gradient-to-t from-black/60` overlay at the bottom showing title + year in white text
- The `hover:scale-105` transition is on the outer `div.relative.inline-block` wrapper (not the `<img>`) so the gradient overlay scales with the image on hover — do not move it back to the `<img>` or the overlay will detach and show a black box below
- CTA button (outlined) + `<EncryptedText triggerOnHover>` below
- Fields come from CTA group in schema (`ctaButtonText`, `ctaButtonUrl`, `encryptedText`)

### Coming Soon Panel
- `ComingSoonPanel` renders a responsive grid of project cards followed by a mailing list signup form (`MailingListForm`) below all the cards
- **Mailing list form**: heading "Join the mailing list" (`MailingListForm`, hardcoded), POST to `/api/subscribe` → Resend notification email to site owner. Parenthetical tagline text below the form is editable via `comingSoonTagline` (Sanity group: `comingSoon`) and rendered wrapped in `( )`
- **Cards** (typed as `ComingSoonEntry`): logo, title, subtitle, dateRange, description, optional `url`, optional `exploreMoreUrl`
  - `url`: if set, the title becomes a clickable `<a>` link (underline on hover). No cursor change if blank.
  - `exploreMoreUrl`: if set, renders a small outlined "Explore More" button below the description
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, gap-6
- Data: `comingSoonItems[]` + `comingSoonTagline` from `homepageSettings` (Sanity group: `comingSoon`)

### About Panel (includes folded-in Contact Me)
- **No sub-accordion** — content is always visible when the panel is open
- LinkedIn + Instagram icon buttons (44px black squares) are in the **"About Me" header row** with `ml-8` spacing — sourced from `socialLinks[]` (falls back to `instagramUrl` field). The about button does NOT use `flex-1` so the icons sit adjacent to the title.
- Reads `aboutAccordion[]` from Sanity but renders only `experience` and `logoFreeform` typed items (skips `text`; `contact` type option removed from Studio)
- "Career Experience" section (`itemType === 'experience'`) renders first with a `text-xl font-semibold` heading using the item's `title` field
- Grey `<hr className="my-8 border-neutral-200">` divides Career Experience from Other Talents & Interests
- "Other Talents & Interests" section (`itemType === 'logoFreeform'`) renders second with same heading style
- `aboutIntroText` still renders above both sections if set
- **Contact Me is folded in below Other Talents & Interests**, separated by another grey `<hr>`: a `text-2xl font-semibold` "Contact Me" heading followed directly by `ContactForm` (name, email, phone, subject, message → POST `/api/contact`)
- **Form field style**: `border-neutral-400 bg-white` boxes with `rounded px-3 py-2.5` — light bordered inputs, not dark boxes

## HeroSection Architecture

**File**: `src/components/sections/HeroSection.tsx` — now a `"use client"` component.

- `sanityFileUrl(asset)` helper: converts `SanityFileAsset` ref (`file-<id>-<ext>`) to Sanity CDN URL. Used for intro video, boredom video (same logic used in ExploreSection for gong sound).
- **Video phase state** (`'intro' | 'main'`): if `heroIntroVideo` is uploaded, it plays first without looping; `onEnded` switches to `'main'` which renders the standard looping background video.
- **Scroll hint**: `useEffect` sets a 20-second timeout; if `window.scrollY < 480` when it fires AND `boredomActivatedRef.current` is false, `showScrollHint = true`. A scroll listener clears it once scrolled past 480px. Renders as `absolute bottom-16 left-1/2 -translate-x-1/2` white text (`text-xl`) with `animate-flash`.
- **Boredom mode is currently unreachable**: the "Bored?" button (previously rendered at the bottom of `ExploreSection`) has been removed per user request. `boredomMode` state, the `hero-boredom-activate` event listener, and the `heroBoredomVideo`/`heroBoredomButtonText` schema fields are all still wired up in `HeroSection.tsx` but nothing dispatches the event anymore — safe to revive with a new trigger, or strip out fully in a future pass.

## Design System

- **Theme**: Minimal black & white — white backgrounds, black text/borders, no dark sections
- **Typography**: Geist Sans; "Explore" heading 80–120px; section titles 3xl–4xl italic
- **Animations**: `title-draw` (clip-path reveal LTR), `line-draw` (scaleX underline), `title-draw-delayed` (same as title-draw but 1.4s delay), `flash` (opacity pulse for scroll hint), `marquee` (25s infinite)
- **Buttons**: Outlined `border border-black px-6 py-2`, invert on hover (`hover:bg-black hover:text-white`)
- **Navbar**: Black text at all times; `bg-white/95 backdrop-blur-sm shadow-sm` when scrolled past 50px
- **Responsive**: Mobile-first, grids collapse to single column at `md:` breakpoint

## Sanity Schema (homepageSettings)

The schema is organized into groups:

| Group | Fields |
|-------|--------|
| Site | `siteTitle`, `siteFavicon` |
| Entry Cover | `entryTitle` (default "Jack Harvey") — used as the person's name (About card) **and** as the base for the cover greeting `` `${entryTitle}'s Portfolio` ``. `entrySubtitle` (default "enter") — **no longer rendered**: the cover is single-line (the Desk passes `subtitle=""`). Field kept in schema for now. |
| Navigation | `navItems[]` (label + target section ID) |
| Hero | `heroImage`, `heroVideo` (file), `heroVideoUrl` (external), `heroIntroVideo` (file — plays once before loop), `heroBoredomVideo` (file — unused, no trigger since "Bored?" button removed), `heroBoredomButtonText` (string, unused) |
| Book | `bookTitle`, `bookSubtitle` (small italic line under the title on the Desk card — **only renders if set**, no code fallback anymore; Studio's own `initialValue` is still "A Complete Guide" for brand-new docs, but Jack's live doc has it empty), `bookDescription`, `bookImage`, `bookButtonText`, `bookButtonUrl` |
| App Section | `appTitle`, `appTagline`, `appSubtitle` (description), `appButtonText`/`appButtonUrl` (Download), `appWebsiteButtonText`/`appWebsiteButtonUrl` (Website — **code already renders this button whenever the URL is set**; as of this writing `appWebsiteButtonUrl` is empty in Studio so the button is hidden — fill it in to show it), `appImages[]` (Desk-card carousel; falls back to single `appImage`), `appImage`, `appGongSound` (audio file) |
| NFT Gallery | `nftSectionTitle`, `nftSectionSubtitle`, `nftGallery[]` (portrait images), `landscapeGallery[]` (landscape images) |
| CTA | `ctaButtonText`, `ctaButtonUrl`, `encryptedText` |
| About | `aboutTagline` (under name, default "Builder · Investor · Lifelong Meditator"), `aboutAccordion[]` (itemType: text/experience/logoFreeform — `contact` type removed from Studio; Contact Me is now a hardcoded form folded into the About Me panel), `socialLinks[]` (platform + url), `instagramUrl` (fallback URL field), `aboutIntroText` (Desk About-card description) |
| Coming Soon | `comingSoonTagline` (string), `comingSoonItems[]` (logo, title, subtitle, dateRange, description, url, exploreMoreUrl) |
| Footer | (removed — `footerMarqueeItems` field deleted from schema and Studio) |

### NFT grid image slots
- `nftGallery[0]` → left portrait column
- `landscapeGallery[0]` → centre landscape column
- `nftGallery[1]` → right portrait column

Each gallery item (both `nftGallery` and `landscapeGallery`) has an optional `url` field. Clicking an image opens `item.url` if set, otherwise falls back to `ctaButtonUrl`.

## TypeScript Types (src/lib/types.ts)

Key interfaces: `HomepageSettings`, `NFTItem`, `AccordionItem`, `ExperienceEntry`, `LogoFreeformEntry`, `ComingSoonEntry`, `SocialLink`, `MarqueeItem`, `NavItem`, `SanityFileAsset`

`ExperienceEntry.description` — freeform text (replaces the old `bullets: string[]` array)
`LogoFreeformEntry` — logo/title/subtitle/dateRange/description; rendered without timeline line (used in About panel)
`ComingSoonEntry` — extends LogoFreeformEntry shape with `url` (project link) and `exploreMoreUrl` (button link); used only in Coming Soon panel

`HomepageSettings.instagramUrl` — optional standalone Instagram URL (fallback if not in `socialLinks[]`)

New fields on `HomepageSettings`:
- `appTitle`, `appSubtitle`, `appButtonText`, `appButtonUrl`, `appImage`, `appGongSound` — App Section
- `heroIntroVideo`, `heroBoredomVideo`, `heroBoredomButtonText` — Hero extras (boredom fields currently unused — see HeroSection Architecture)

## CSS Animations (globals.css)

| Class | Keyframes | Use |
|-------|-----------|-----|
| `animate-ticker` | translateX(0→-50%) 30s | (unused — was footer scrolling text; footer removed) |
| `animate-title-draw` | clip-path inset reveal 1.4s | Book/App panel title |
| `animate-line-draw` | scaleX(0→1) 1.4s | Book/App panel underline |
| `animate-title-draw-delayed` | same clip-path reveal but starts after 1.4s delay | Book/App panel description + button (fires after title finishes) |
| `animate-flash` | opacity 1→0→1 1.2s infinite | Hero scroll hint text |

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=<dataset-name>

# Required for /api/contact and /api/subscribe (Resend email service)
RESEND_API_KEY=<resend-api-key>
CONTACT_EMAIL=<destination-email>          # where contact/subscribe emails are sent
CONTACT_FROM_EMAIL=<sender-email>          # "from" address (defaults to onboarding@resend.dev)
```

## GROQ Query (page.tsx) — critical notes

The `HOMEPAGE_QUERY` in `src/app/page.tsx` must explicitly project every field used by the components. Omitting a field from the query means it will always be `undefined` in the component even if data exists in Sanity.

Known pitfalls (already fixed — do not regress):
- `aboutAccordion[].logoFreeformEntries[]` **must** be projected — it was previously missing entirely, causing the logoFreeform accordion type to render blank
- `aboutAccordion[].experienceEntries[]` must project `description` (freeform text field) — the old name `bullets` no longer exists in the schema
- Full required sub-projections: `experienceEntries[]{_key, logo, jobTitle, dateRange, company, description}` and `logoFreeformEntries[]{_key, logo, title, dateRange, subtitle, description}`
- `comingSoonItems[]` must be projected with: `{_key, logo, title, dateRange, subtitle, description, url, exploreMoreUrl}`
- `comingSoonTagline` must be projected (top-level string field)
- `footerMarqueeItems` has been **removed** from the GROQ query (Footer component removed from page)
- App Section fields must be projected: `appTitle`, `appSubtitle`, `appButtonText`, `appButtonUrl`, `appImage`, `appGongSound`
- Hero extras must be projected: `heroIntroVideo`, `heroBoredomVideo`, `heroBoredomButtonText`

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Contact form — sends email via Resend |
| `/api/subscribe` | POST | Mailing list signup — sends notification email via Resend |
| `/api/revalidate` | POST | ISR cache revalidation |

## Common Tasks

- **Edit content**: Go to `/studio` → Homepage Settings. All text, images, links are CMS-driven.
- **Add a new explore panel**: Add a new entry to `PANELS` in `ExploreSection.tsx`, add a new render block in the panel body, and add corresponding fields to `homepageSettings.ts` schema + `types.ts`.
- **Modify Sanity schema**: Edit `src/sanity/schemaTypes/homepageSettings.ts`, then deploy with `npx sanity@latest schema deploy`
- **Add UI component**: `npx shadcn@latest add <component>` or install from Aceternity
- **Deploy**: Push to main branch (auto-deploys via Vercel)
- **Re-enable dark sections**: The legacy section files (BookSection, NFTSection, CTASection, AboutSection) are untouched. To restore them, re-import and add to page.tsx.

## Git Workflow

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/indivisibly-prime.git`
- Push to main triggers Vercel deployment

## Final Task
- Always update this file "Claude.md" with any edits
