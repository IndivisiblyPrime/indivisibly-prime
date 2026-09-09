/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HomepageSettings } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { sanityFileUrl } from "@/lib/sanityFile"
import { ActionButton } from "./shared"
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

  // Gong on open, matching /classic. This card only mounts when the App is
  // opened, so a mount effect fires exactly once per open. The open is always a
  // user click, so autoplay policy lets it through — but a browser can still
  // refuse, hence the ignored rejection.
  const gongUrl = sanityFileUrl(settings.appGongSound)
  useEffect(() => {
    if (!gongUrl) return
    const audio = new Audio(gongUrl)
    audio.play().catch(() => {
      /* autoplay blocked — the card is still perfectly usable */
    })
    // Don't leave a gong ringing over a closed card.
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [gongUrl])

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

  // Shared pieces, each used once on mobile and once on desktop (below) in a
  // different order/arrangement — defined once so the two layouts can't drift
  // out of sync with each other.
  const media = (
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
        /* 50% bigger than they were, on both viewports (Jack, 2026-09-10) —
           arrows, dots and the gaps between them together, so the control row
           scales as one thing. */
        <div className="mt-6 flex items-center gap-6 md:mt-8 md:gap-9">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous screenshot"
            className="flex h-[3.375rem] w-[3.375rem] items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:bg-black hover:text-white md:h-[5.0625rem] md:w-[5.0625rem]"
          >
            <ChevronLeft className="h-6 w-6 md:h-9 md:w-9" />
          </button>
          <div className="flex items-center gap-[0.5625rem]">
            {images.map((_, d) => (
              <button
                key={d}
                type="button"
                onClick={() => setI(d)}
                aria-label={`Go to screenshot ${d + 1}`}
                className={`h-[0.5625rem] rounded-full transition-all md:h-3 ${
                  d === i
                    ? "w-[1.875rem] bg-neutral-800 md:w-[2.625rem]"
                    : "w-[0.5625rem] bg-neutral-300 hover:bg-neutral-500 md:w-3"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next screenshot"
            className="flex h-[3.375rem] w-[3.375rem] items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:bg-black hover:text-white md:h-[5.0625rem] md:w-[5.0625rem]"
          >
            <ChevronRight className="h-6 w-6 md:h-9 md:w-9" />
          </button>
        </div>
      )}
    </div>
  )

  // No "01 — The App" kicker any more (Jack, 2026-09-10 — pulled from all
  // three cards). `min(6.9cqi, 3.45rem)` is the web title: 15% up on the old
  // 48px cap, but measured against the *text column* (the desktop layout below
  // makes it a container), so it can't outgrow the room it has and wrap. The
  // rem cap is also the safety net — with no container it degrades to 55.2px,
  // never to 6.9vw.
  const titleBlock = (
    <>
      <h2 className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl md:text-[min(6.9cqi,3.45rem)]">
        {title}
      </h2>
      {tagline && <p className="mt-2 text-lg text-neutral-600 md:mt-4 md:text-[1.6875rem]">{tagline}</p>}
    </>
  )

  // `max-w-md` is a phone measure only. On the web card it cut the commentary
  // off well short of the title's right edge (Jack, 2026-09-09), so from `md`
  // up it runs the full width of the text column — which is exactly where the
  // title ends.
  const descriptionBlock = description && (
    <p className="max-w-md whitespace-pre-wrap leading-relaxed text-neutral-600 md:max-w-none md:text-2xl">
      {description}
    </p>
  )

  const buttonsBlock = (
    <div className="flex flex-wrap gap-3">
      <ActionButton href={settings.appButtonUrl}>{downloadText}</ActionButton>
      {settings.appWebsiteButtonUrl && (
        <ActionButton href={settings.appWebsiteButtonUrl} variant="ghost">
          {websiteText}
        </ActionButton>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile (2026-09-02): title, then the phone, then description, then
          buttons — the web order below is unrelated and untouched. */}
      <div className="flex flex-col gap-8 md:hidden">
        <div>{titleBlock}</div>
        {media}
        {descriptionBlock}
        {buttonsBlock}
      </div>

      {/* Desktop/web — unchanged from before the mobile reorder above. */}
      <div className="hidden gap-8 md:grid md:grid-cols-[minmax(0,340px)_1fr] md:items-start md:gap-14">
        {media}
        {/* `containerType` is what the title's `cqi` size measures against —
            set in a style so it can't be lost to a class rename. The margins
            here are web-only by construction (this block is `hidden` below
            md); they were mt-5/mt-8 before Jack asked for more air between
            title, commentary and buttons on 2026-09-10. */}
        <div className="flex flex-col" style={{ containerType: "inline-size" }}>
          {titleBlock}
          {descriptionBlock && <div className="mt-9">{descriptionBlock}</div>}
          <div className="mt-14">{buttonsBlock}</div>
        </div>
      </div>
    </>
  )
}
