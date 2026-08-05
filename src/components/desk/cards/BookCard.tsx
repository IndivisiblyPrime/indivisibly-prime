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
    <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-14">
      <div className="flex items-center justify-center">
        <img
          src={cover}
          alt={title}
          className="w-64 rounded-md shadow-2xl ring-1 ring-black/10 sm:w-72"
          draggable={false}
        />
      </div>
      <div className="flex flex-col justify-center">
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
