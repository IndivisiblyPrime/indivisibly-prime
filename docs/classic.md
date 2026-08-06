# `/classic` — the previous homepage

Preserved verbatim at `src/app/classic/page.tsx`. Not the live homepage (that's the Desk, see CLAUDE.md). Read this only if you're actually working on `/classic`; otherwise ignore it.

```
Navbar (fixed, transparent → white on scroll)
  └── HeroSection      full-screen video/image + intro clip + scroll hint
  └── ExploreSection   white bg, 5-panel accordion — the main content area
        ├── 1. Book       two-col: animated title/description/button | cover image
        ├── 2. App        same layout; plays a gong sound on open
        ├── 3. NFTs       portrait/landscape/portrait grid + CTA + encrypted text
        ├── Coming Soon   grid of logo+freeform cards + mailing-list form
        └── About Me      socials in header; Experience / Interests / Contact form
```

Footer (marquee) was removed. The pre-revamp sections (`BookSection`, `NFTSection`, `CTASection`, `AboutSection`, `Footer`) are unused but **kept in place** — don't delete them.

## ExploreSection — `src/components/sections/ExploreSection.tsx`

- State: `open: Set<string>` (multiple panels open at once), `bookAnimKey` / `appAnimKey` (incremented on open to retrigger the title animation via `useEffect` + forced reflow).
- `PANELS = [{id, title}]`: book → app → nfts → comingsoon → about. Contact Me is folded into `about`, not its own panel.
- Expand/collapse is `max-h-0` → `max-h-[500vh]` + opacity transition.
- A `<div className="h-[480px]" />` spacer sits before the `about` panel — intentional, revertible.
- `sanityFileUrl()` derives a CDN URL from a `SanityFileAsset` ref (gong sound; same helper logic as HeroSection).

### Regression traps
- **NFT panel**: each grid cell wraps its image in `<div className="flex justify-center">`. Remove those and the landscape image hugs the right portrait column on wide viewports.
- **NFT panel**: `hover:scale-105` lives on the outer `div.relative.inline-block`, *not* the `<img>`, so the gradient caption overlay scales with the image. Move it back to the `<img>` and the overlay detaches, showing a black box below.
- **Slots**: `nftGallery[0]` | `landscapeGallery[0]` | `nftGallery[1]`.

### Panel notes
- **Book / App**: two-column grid; title uses `animate-title-draw` + `animate-line-draw`, description and button use `animate-title-draw-delayed` (1.4s delay so they follow the title). App's right column is clamped to iPhone portrait (`max-h-[65vh] max-w-[280px]`).
- **App gong**: `new Audio(gongSoundUrl).play()` fires when the "2. App" header opens. File lives in Studio → App Section → Gong Sound.
- **Coming Soon**: card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) then `MailingListForm` below. `url` makes the card title a link; `exploreMoreUrl` renders an "Explore More" button. `comingSoonTagline` renders wrapped in `( )`.
- **About**: no sub-accordion — everything visible when open. Renders only `experience` and `logoFreeform` items from `aboutAccordion[]` (skips `text`). Career Experience, `<hr>`, Other Talents & Interests, `<hr>`, then the hardcoded Contact Me form. Socials sit in the header row with `ml-8`; the about button must not use `flex-1` or the icons drift from the title.

## HeroSection — `src/components/sections/HeroSection.tsx`

`"use client"`.

- **Video phases** (`'intro' | 'main'`): if `heroIntroVideo` is set it plays once, then `onEnded` switches to the looping `heroVideo`.
- **Scroll hint**: 20s timeout; shows if `window.scrollY < 480`, cleared by a scroll listener past 480px. Renders `absolute bottom-16` with `animate-flash`.
- **Boredom mode is unreachable**: the "Bored?" button was removed, so nothing dispatches `hero-boredom-activate`. The listener, `boredomMode` state, and the `heroBoredomVideo` / `heroBoredomButtonText` schema fields all still exist. Revive with a new trigger or strip out entirely.

## CSS animations used here (globals.css)

| Class | What it does |
|-------|--------------|
| `animate-title-draw` | clip-path inset reveal, 1.4s — Book/App title |
| `animate-line-draw` | scaleX(0→1), 1.4s — underline |
| `animate-title-draw-delayed` | same reveal, starts at 1.4s — description + button |
| `animate-flash` | opacity pulse — hero scroll hint |
| `animate-ticker` | unused (was the removed footer marquee) |

## Design language

Minimal black & white — white backgrounds, black text and borders, no dark sections. Geist Sans. Outlined buttons (`border border-black px-6 py-2`) that invert on hover. Navbar is black text always, gaining `bg-white/95 backdrop-blur-sm shadow-sm` past 50px. Grids collapse to one column at `md:`.
