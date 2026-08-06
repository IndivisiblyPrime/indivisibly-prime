/* eslint-disable @next/next/no-img-element */
"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HomepageSettings } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { Eyebrow, ActionButton } from "./shared"
import { PhoneFrame } from "../PhoneFrame"
import { FALLBACK } from "../data"

const DEFAULT_DESC =
  "An iOS advanced meditation timer. Focus, breathe, and grow — a quiet space to build a daily practice, one session at a time."

export function AppCard({ settings }: { settings: HomepageSettings }) {
  const title = settings.appTitle || "Bonsai"
  const tagline = settings.appTagline // optional — only shown when set (title often already includes it)
  const description = settings.appSubtitle || DEFAULT_DESC

  const images =
    settings.appImages && settings.appImages.length > 0
      ? settings.appImages.map((img) => urlFor(img).width(840).auto("format").url())
      : settings.appImage
      ? [urlFor(settings.appImage).width(840).auto("format").url()]
      : FALLBACK.appScreens

  const [i, setI] = useState(0)
  const count = images.length
  const go = (d: number) => setI((prev) => (prev + d + count) % count)

  // Swipe the screen on touch devices, where the arrows are a small target.
  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
  }

  const downloadText = settings.appButtonText || "Download Now"
  const websiteText = settings.appWebsiteButtonText || "Visit Website"

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-start md:gap-14">
      {/* Carousel — one fixed phone shell, the screenshots cross-fade inside it */}
      <div className="flex flex-col items-center">
        <PhoneFrame onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {images.map((src, d) => (
            <img
              key={src}
              src={src}
              alt={d === i ? `${title} screenshot ${i + 1} of ${count}` : ""}
              aria-hidden={d !== i}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                d === i ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
            />
          ))}
        </PhoneFrame>
        {count > 1 && (
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screenshot"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:bg-black hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {images.map((_, d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setI(d)}
                  aria-label={`Go to screenshot ${d + 1}`}
                  className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-neutral-800" : "w-1.5 bg-neutral-300 hover:bg-neutral-500"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screenshot"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:bg-black hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <Eyebrow>01 — The App</Eyebrow>
        <h2 className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">{title}</h2>
        {tagline && <p className="mt-2 text-lg text-neutral-600">{tagline}</p>}
        {description && (
          <p className="mt-5 max-w-md whitespace-pre-wrap leading-relaxed text-neutral-600">{description}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <ActionButton href={settings.appButtonUrl}>{downloadText}</ActionButton>
          {settings.appWebsiteButtonUrl && (
            <ActionButton href={settings.appWebsiteButtonUrl} variant="ghost">
              {websiteText}
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  )
}
