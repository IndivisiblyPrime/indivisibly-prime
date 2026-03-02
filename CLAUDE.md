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
│   │   ├── HeroSection.tsx         # Full-screen hero with video/image background
│   │   ├── ExploreSection.tsx      # Main content area — 3-panel accordion (Book, NFTs, About Me)
│   │   ├── Footer.tsx              # Minimal B&W scrolling marquee
│   │   ├── BookSection.tsx         # (legacy — unused, keep in place)
│   │   ├── NFTSection.tsx          # (legacy — unused, keep in place)
│   │   ├── CTASection.tsx          # (legacy — unused, keep in place)
│   │   └── AboutSection.tsx        # (legacy — unused, keep in place)
│   └── ui/                         # shadcn + Aceternity components
│       ├── accordion.tsx           # Radix accordion (used inside ExploreSection About panel)
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
  └── HeroSection        (full-screen video/image)
  └── ExploreSection     (white bg, accordion — the main content area)
        ├── Book panel         (two-col: animated title + description + button | tall book cover image)
        ├── NFTs panel         (3-col portrait/landscape/portrait grid + CTA + encrypted text)
        ├── Coming Soon panel  (responsive grid of logo+freeform cards, editable from Studio)
        └── About Me panel     (LinkedIn/Instagram icons in header row + Radix accordion with bio/experience/contact)
```

Footer (marquee) has been removed.

Old section order (pre-revamp): Hero → BookSection → NFTSection → CTASection → AboutSection → Footer.
The four old sections are replaced by `ExploreSection`. Do not delete the old files — they may be referenced elsewhere or revived later.

## ExploreSection Architecture

**File**: `src/components/sections/ExploreSection.tsx`

- Top-level state: `open: Set<string>` (allows multiple panels open simultaneously), `bookAnimKey: number` (increments on each book panel open to retrigger title animation)
- Four panels defined as `PANELS = [{id, title}]`: book → nfts → comingsoon → about
- Panel expand/collapse uses `max-h-0` → `max-h-[500vh]` + `opacity` CSS transition

### Book Panel
- Two-column grid (`grid-cols-[1fr_1fr]`)
- Title uses `clip-path` draw animation (`animate-title-draw`) + underline draw (`animate-line-draw`) — triggered via `useEffect` + forced reflow when `isOpen` changes
- Book cover image: `max-h-[55vh] object-contain`, wrapped in `<a href={bookButtonUrl}>` when a URL is set — same hover scale animation (`transition-transform duration-500 hover:scale-105`) as NFT images

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
- `ComingSoonPanel` component renders a responsive grid of logo+freeform cards (same card structure as `logoFreeform` in AboutPanel — logo, title, subtitle, dateRange, description)
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, gap-6
- Empty state: "Add items in Sanity Studio."
- Data sourced from `comingSoonItems[]` in `homepageSettings` (Sanity group: `comingSoon`)

### About Panel
- LinkedIn + Instagram icon buttons (44px black squares) are in the **panel header row**, directly after the "About Me" title with `ml-8` spacing — sourced from `socialLinks[]` (falls back to `instagramUrl` field)
- The about panel button does NOT use `flex-1` (unlike other panels) so the icons sit adjacent to the title rather than being pushed to the far right
- The panel body starts directly with intro text (no social icons inside the body)
- Radix accordion restyled minimal (no dark bg, no numbered circles)
- Supports four accordion item types:
  - `text` — plain text (whitespace-pre-wrap)
  - `experience` — job cards with logo/title/company/dateRange/description + vertical timeline line connecting entries
  - `logoFreeform` — same card structure as experience but **no** vertical connecting line; logo is optional
  - `contact` — inline form POSTing to `/api/contact`

## Design System

- **Theme**: Minimal black & white — white backgrounds, black text/borders, no dark sections
- **Typography**: Geist Sans; "Explore" heading 80–120px; section titles 3xl–4xl italic
- **Animations**: `title-draw` (clip-path reveal LTR), `line-draw` (scaleX underline), `marquee` (25s infinite)
- **Buttons**: Outlined `border border-black px-6 py-2`, invert on hover (`hover:bg-black hover:text-white`)
- **Navbar**: Black text at all times; `bg-white/95 backdrop-blur-sm shadow-sm` when scrolled past 50px
- **Responsive**: Mobile-first, grids collapse to single column at `md:` breakpoint

## Sanity Schema (homepageSettings)

The schema is organized into groups:

| Group | Fields |
|-------|--------|
| Site | `siteTitle`, `siteFavicon` |
| Navigation | `navItems[]` (label + target section ID) |
| Hero | `heroImage`, `heroVideo` (file), `heroVideoUrl` (external) |
| Book | `bookTitle`, `bookDescription`, `bookImage`, `bookButtonText`, `bookButtonUrl` |
| NFT Gallery | `nftSectionTitle`, `nftSectionSubtitle`, `nftGallery[]` (portrait images), `landscapeGallery[]` (landscape images) |
| CTA | `ctaButtonText`, `ctaButtonUrl`, `encryptedText` |
| About | `aboutAccordion[]` (itemType: text/experience/logoFreeform/contact), `socialLinks[]` (platform + url), `instagramUrl` (fallback URL field) |
| Coming Soon | `comingSoonItems[]` (logo, title, subtitle, dateRange, description) |
| Footer | `footerMarqueeItems[]` (text, optional icon) — schema field kept but footer removed from page; data cleared |

### NFT grid image slots
- `nftGallery[0]` → left portrait column
- `landscapeGallery[0]` → centre landscape column
- `nftGallery[1]` → right portrait column

Each gallery item (both `nftGallery` and `landscapeGallery`) has an optional `url` field. Clicking an image opens `item.url` if set, otherwise falls back to `ctaButtonUrl`.

## TypeScript Types (src/lib/types.ts)

Key interfaces: `HomepageSettings`, `NFTItem`, `AccordionItem`, `ExperienceEntry`, `LogoFreeformEntry`, `SocialLink`, `MarqueeItem`, `NavItem`

`ExperienceEntry.description` — freeform text (replaces the old `bullets: string[]` array)
`LogoFreeformEntry` — logo/title/subtitle/dateRange/description; rendered without timeline line

`HomepageSettings.instagramUrl` — optional standalone Instagram URL (fallback if not in `socialLinks[]`)

## CSS Animations (globals.css)

| Class | Keyframes | Use |
|-------|-----------|-----|
| `animate-ticker` | translateX(0→-50%) 30s | Footer scrolling text (CSS animation on a 2-copy flex row — do NOT use RAF, images won't be loaded on first frame causing a blank gap) |
| `animate-title-draw` | clip-path inset reveal 1.4s | Book panel title |
| `animate-line-draw` | scaleX(0→1) 1.4s | Book panel underline |

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=<dataset-name>
```

## GROQ Query (page.tsx) — critical notes

The `HOMEPAGE_QUERY` in `src/app/page.tsx` must explicitly project every field used by the components. Omitting a field from the query means it will always be `undefined` in the component even if data exists in Sanity.

Known pitfalls (already fixed — do not regress):
- `aboutAccordion[].logoFreeformEntries[]` **must** be projected — it was previously missing entirely, causing the logoFreeform accordion type to render blank
- `aboutAccordion[].experienceEntries[]` must project `description` (freeform text field) — the old name `bullets` no longer exists in the schema
- Full required sub-projections: `experienceEntries[]{_key, logo, jobTitle, dateRange, company, description}` and `logoFreeformEntries[]{_key, logo, title, dateRange, subtitle, description}`
- `comingSoonItems[]` must be projected with: `{_key, logo, title, dateRange, subtitle, description}`
- `footerMarqueeItems` has been **removed** from the GROQ query (Footer component removed from page)

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
