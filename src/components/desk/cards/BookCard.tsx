/* eslint-disable @next/next/no-img-element */
"use client"

import { HomepageSettings } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { Eyebrow, ActionButton } from "./shared"
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
      <img
        src={cover}
        alt={title}
        className="aspect-[3/4] max-h-[77dvh] w-full rounded-md object-cover shadow-2xl ring-1 ring-black/10"
        draggable={false}
      />
    </div>
  )

  const titleBlock = (
    <>
      <Eyebrow>02 — The Book</Eyebrow>
      <h2 className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-2 italic text-neutral-500">{subtitle}</p>}
    </>
  )

  const descriptionBlock = description && (
    <p className="max-w-md whitespace-pre-wrap leading-relaxed text-neutral-600">{description}</p>
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
        <div className="flex flex-col">
          {titleBlock}
          {descriptionBlock && <div className="mt-5">{descriptionBlock}</div>}
          <div className="mt-8">{buttonsBlock}</div>
        </div>
      </div>
    </>
  )
}
