/* eslint-disable @next/next/no-img-element */
"use client"

import { HomepageSettings } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { ActionButton } from "./shared"
import { FALLBACK } from "../data"

const DEFAULT_DESC =
  "For centuries, seekers have pursued the greatest wisdom of Zen. They've sat in silence, listened to masters speak in riddles, and searched endlessly for truth. At last, a synthesis of all the answers are here…"

export function BookCard({ settings }: { settings: HomepageSettings }) {
  const title = settings.bookTitle || "The Greatest Wisdom of Zen"
  const subtitle = settings.bookSubtitle
  const description = settings.bookDescription || DEFAULT_DESC
  const cover = settings.bookImage ? urlFor(settings.bookImage).width(800).url() : FALLBACK.bookCover
  const btnText = settings.bookButtonText || "More Details / Buy"

  // Shared pieces, each used once on mobile and once on desktop (below) in a
  // different order/arrangement — defined once so the two layouts can't drift
  // out of sync with each other.
  const media = (
    <div className="flex items-start justify-center">
      {/* Jack's upload is a 3:2 landscape photo; aspect-[3/4] + object-cover crops
          in rather than padding it out. The cover drives the card's height, so
          "make the Book card ~15% taller" (Jack, 2026-08-17) is done by growing
          the cover, not by padding: a 31.5rem column × 4/3 = 672px against the
          old 27.5rem/587px, i.e. +14.5%. The modal's own width is unchanged —
          the text column just gets proportionally narrower.
          This deliberately BREAKS the old cover-height == App-phone-height
          pairing; the two are no longer meant to match. `max-h-[77dvh]` is the
          old 67dvh scaled by the same 15% so the cap doesn't clamp away the
          extra height on short laptops. */}
      {/* `w-[74%] md:w-full` is the mobile-only size cut (Jack, 2026-09-08,
          taken 78% → 74% on a second pass): this same block renders in BOTH
          layouts below, so the phone width has to be reset at md or it would
          shrink the desktop card too. */}
      <img
        src={cover}
        alt={title}
        className="aspect-[3/4] max-h-[77dvh] w-[74%] rounded-md object-cover shadow-2xl ring-1 ring-black/10 md:w-full"
        draggable={false}
      />
    </div>
  )

  const titleBlock = (
    <>
      {/* No "02 — The Book" kicker any more (Jack, 2026-09-10).
          The title must not break after "The Greatest Wisdom of" (Jack,
          2026-09-09), and it also had to grow 15% (2026-09-10) — which the
          viewport-based clamp couldn't do without wrapping on narrower
          laptops. So it's sized off the *text column* instead: the desktop
          layout below is a container, and `7.6cqi` is comfortably under the
          ~7.9% of column width the default title needs for one line, at every
          width. `3.45rem` is the 15% cap (48 → 55.2px) and doubles as the
          safety net if the container ever goes missing. A much longer
          `bookTitle` from Studio will still wrap — lower the cqi figure then,
          never `whitespace-nowrap`, which would overflow the modal. The 2rem
          floor gives up the one-line rule below a ~1100px window rather than
          shrink the title into illegibility; one line holds everywhere above
          that. Measured: 48px/one line at a 1327px window, 53px at 1512. */}
      <h2 className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl md:text-[clamp(2rem,7.6cqi,3.45rem)]">
        {title}
      </h2>
      {subtitle && <p className="mt-2 italic text-neutral-500 md:mt-3 md:text-2xl">{subtitle}</p>}
    </>
  )

  // Same as the App card: `max-w-md` is the phone measure, and the web card
  // lets the commentary run the full text column.
  const descriptionBlock = description && (
    <p className="max-w-md whitespace-pre-wrap leading-relaxed text-neutral-600 md:max-w-none md:text-2xl">
      {description}
    </p>
  )

  const buttonsBlock = (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
      <ActionButton href={settings.bookButtonUrl}>{btnText}</ActionButton>
      {settings.bookWebsiteButtonUrl && (
        <ActionButton href={settings.bookWebsiteButtonUrl} variant="link">
          {settings.bookWebsiteButtonText || "Website"}
        </ActionButton>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile (2026-09-02): title, then the cover, then description, then
          buttons — the web order below is unrelated and untouched. */}
      <div className="flex flex-col gap-8 md:hidden">
        <div>{titleBlock}</div>
        {media}
        {descriptionBlock}
        {buttonsBlock}
      </div>

      {/* Desktop/web — unchanged from before the mobile reorder above. */}
      <div className="hidden gap-8 md:grid md:grid-cols-[minmax(0,380px)_1fr] md:items-start md:gap-14 lg:grid-cols-[minmax(0,31.5rem)_1fr]">
        {media}
        {/* The container the title's `cqi` size measures against; margins are
            web-only by construction (mt-5/mt-8 before 2026-09-10). */}
        <div className="flex flex-col" style={{ containerType: "inline-size" }}>
          {titleBlock}
          {descriptionBlock && <div className="mt-9">{descriptionBlock}</div>}
          <div className="mt-14">{buttonsBlock}</div>
        </div>
      </div>
    </>
  )
}
