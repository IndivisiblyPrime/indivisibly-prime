# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Indivisibly Prime** - Jack Harvey's personal website built with Next.js + Sanity CMS.

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
- **Navbar `PANEL_TARGETS`**: includes `"book"`, `"app"`, `"nfts"`, `"about"`, `"comingsoon"`, `"contact"` — all panels that live inside ExploreSection
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
│   │   ├── HeroSection.tsx         # Full-screen hero with video/image background + intro video + boredom button + scroll hint
│   │   ├── ExploreSection.tsx      # Main content area — 6-panel accordion (1.Book, 2.App, 3.NFTs, Coming Soon, About Me, Contact Me)
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

## Page Layout (current)

```
Navbar (fixed, transparent → white on scroll)
  └── HeroSection        (full-screen video/image + intro clip + scroll hint + "Bored?" button)
  └── ExploreSection     (white bg, accordion — the main content area)
        ├── 1. Book panel      (two-col: animated title+description+button | book cover image)
        ├── 2. App panel       (two-col: animated title+description+button | iPhone portrait image; plays gong sound on open)
        ├── 3. NFTs panel      (3-col portrait/landscape/portrait grid + CTA + encrypted text)
        ├── Coming Soon panel  (responsive grid of logo+freeform cards, editable from Studio)
        ├── About Me panel     (Career Experience + grey divider + Other Talents & Interests — always visible, no sub-accordion)
        └── Contact Me panel   (LinkedIn/Instagram icons in header + contact form)
```

Footer (marquee) has been removed.

Old section order (pre-revamp): Hero → BookSection → NFTSection → CTASection → AboutSection → Footer.
The four old sections are replaced by `ExploreSection`. Do not delete the old files — they may be referenced elsewhere or revived later.

## ExploreSection Architecture

**File**: `src/components/sections/ExploreSection.tsx`

- Top-level state: `open: Set<string>` (allows multiple panels open simultaneously), `bookAnimKey` + `appAnimKey` (increment on each open to retrigger title animation)
- Six panels defined as `PANELS = [{id, title}]`: book → app → nfts → comingsoon → about → contact
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
- `ComingSoonPanel` renders a mailing list signup form + responsive grid of project cards
- **Email form**: POST to `/api/subscribe` → Resend notification email to site owner. Tagline text below the form is editable via `comingSoonTagline` (Sanity group: `comingSoon`)
- **Cards** (typed as `ComingSoonEntry`): logo, title, subtitle, dateRange, description, optional `url`, optional `exploreMoreUrl`
  - `url`: if set, the title becomes a clickable `<a>` link (underline on hover). No cursor change if blank.
  - `exploreMoreUrl`: if set, renders a small outlined "Explore More" button below the description
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, gap-6
- Data: `comingSoonItems[]` + `comingSoonTagline` from `homepageSettings` (Sanity group: `comingSoon`)

### About Panel
- **No sub-accordion** — content is always visible when the panel is open
- Reads `aboutAccordion[]` from Sanity but renders only `experience` and `logoFreeform` typed items (skips `text`; `contact` type option removed from Studio)
- "Career Experience" section (`itemType === 'experience'`) renders first with a `text-xl font-semibold` heading using the item's `title` field
- Grey `<hr className="my-8 border-neutral-200">` divides the two sections
- "Other Talents & Interests" section (`itemType === 'logoFreeform'`) renders second with same heading style
- `aboutIntroText` still renders above both sections if set

### Contact Me Panel
- LinkedIn + Instagram icon buttons (44px black squares) are in the **"Contact Me" header row** with `ml-8` spacing — sourced from `socialLinks[]` (falls back to `instagramUrl` field)
- The contact button does NOT use `flex-1` so the icons sit adjacent to the title
- Panel body is the `ContactForm` directly (no wrapper): name, email, phone, subject, message → POST `/api/contact`
- **Form field style**: dark boxes (`bg-neutral-900 rounded px-3 py-2.5`) with white text and `placeholder-white/40` — not transparent border-bottom style

## HeroSection Architecture

**File**: `src/components/sections/HeroSection.tsx` — now a `"use client"` component.

- `sanityFileUrl(asset)` helper: converts `SanityFileAsset` ref (`file-<id>-<ext>`) to Sanity CDN URL. Used for intro video, boredom video (same logic used in ExploreSection for gong sound).
- **Video phase state** (`'intro' | 'main'`): if `heroIntroVideo` is uploaded, it plays first without looping; `onEnded` switches to `'main'` which renders the standard looping background video.
- **Boredom mode** (`boolean`): "Bored?" button (bottom-right, `absolute bottom-6 right-8 z-20`) swaps the video to `heroBoredomVideo`. Button toggles back ("Back") to exit boredom mode. Button only renders if `heroBoredomVideo` is set.
- **Scroll hint**: `useEffect` sets a 20-second timeout; if `window.scrollY < 480` when it fires AND `boredomActivatedRef.current` is false, `showScrollHint = true`. A scroll listener clears it once scrolled past 480px. Also dismissed immediately when boredom mode is activated. Renders as `absolute bottom-16 left-1/2 -translate-x-1/2` white text (`text-xl`) with `animate-flash`.
- **Bored button**: Always rendered (not conditional on boredomVideoUrl). `z-50`. Sets `boredomActivatedRef.current = true` on click to prevent scroll hint from appearing. Only swaps the video if `boredomVideoUrl` is set.

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
| Navigation | `navItems[]` (label + target section ID) |
| Hero | `heroImage`, `heroVideo` (file), `heroVideoUrl` (external), `heroIntroVideo` (file — plays once before loop), `heroBoredomVideo` (file — "Bored?" click video), `heroBoredomButtonText` (string, default "Bored?") |
| Book | `bookTitle`, `bookDescription`, `bookImage`, `bookButtonText`, `bookButtonUrl` |
| App Section | `appTitle`, `appSubtitle`, `appButtonText`, `appButtonUrl`, `appImage` (portrait/iPhone-sized), `appGongSound` (audio file) |
| NFT Gallery | `nftSectionTitle`, `nftSectionSubtitle`, `nftGallery[]` (portrait images), `landscapeGallery[]` (landscape images) |
| CTA | `ctaButtonText`, `ctaButtonUrl`, `encryptedText` |
| About | `aboutAccordion[]` (itemType: text/experience/logoFreeform — `contact` type now rendered in Contact Me panel instead), `socialLinks[]` (platform + url), `instagramUrl` (fallback URL field) |
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
- `heroIntroVideo`, `heroBoredomVideo`, `heroBoredomButtonText` — Hero extras

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
