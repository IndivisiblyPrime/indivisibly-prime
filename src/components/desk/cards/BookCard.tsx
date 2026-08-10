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

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-start md:gap-14 lg:grid-cols-[minmax(0,27.5rem)_1fr]">
      <div className="flex items-start justify-center">
        {/* Jack's upload is a 3:2 landscape photo; aspect-[3/4] + object-cover crops
            in rather than padding it out. Sized to land on the SAME height as the App
            card's phone: the cover fills a 27.5rem column, and 27.5rem × 4/3 = 587px,
            against the phone's 588px. `max-h-[67dvh]` mirrors the phone's own dvh cap
            (2.1 × 32dvh) so both shrink together on short viewports instead of the
            cover overflowing the modal. */}
        <img
          src={cover}
          alt={title}
          className="aspect-[3/4] max-h-[67dvh] w-full rounded-md object-cover shadow-2xl ring-1 ring-black/10"
          draggable={false}
        />
      </div>
      <div className="flex flex-col">
        <Eyebrow>02 — The Book</Eyebrow>
        <h2 className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">{title}</h2>
        {subtitle && <p className="mt-2 italic text-neutral-500">{subtitle}</p>}
        {description && (
          <p className="mt-5 max-w-md whitespace-pre-wrap leading-relaxed text-neutral-600">{description}</p>
        )}
        <div className="mt-8">
          <ActionButton href={settings.bookButtonUrl}>{btnText}</ActionButton>
        </div>
      </div>
    </div>
  )
}
