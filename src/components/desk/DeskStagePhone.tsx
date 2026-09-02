/* eslint-disable @next/next/no-img-element */
"use client"

import { MOBILE_TEST_SPOTS, type DeskId } from "./data"

/**
 * Mobile background test (2026-09-02): the full-desk photo (desk-mobile.png)
 * as one continuous image, with the title overlaid on the photo's own top
 * margin — no separate nav bar, no fixed/sticky positioning, so it scrolls
 * away with the rest of the desk like anything else on the page. Tap zones
 * are rough eyeballed rectangles over the photo, not calibrated outlines
 * like the web desk; good enough to click through for review, not a final
 * pass.
 */
export function DeskStagePhone({
  onOpen,
  pulseApp,
  onInteract,
  entryTitle,
}: {
  onOpen: (id: DeskId) => void
  pulseApp: boolean
  onInteract: () => void
  entryTitle: string
}) {
  return (
    <div className="min-h-dvh w-full bg-[#171009]">
      <div className="relative w-full">
        <img
          src="/desk-mobile.png"
          alt="Jack Harvey's desk"
          className="block w-full select-none"
          draggable={false}
        />

        {/* Title overlaid directly on the photo's own top margin — not a
            separate bar, and not sticky/fixed, so it scrolls away with the
            rest of the desk once you start scrolling (Jack, 2026-09-02). */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-6 pt-6">
          <span
            className="text-center text-[0.95rem] font-medium text-[#F7F1E7]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            {entryTitle}
          </span>
        </div>

        {MOBILE_TEST_SPOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              onInteract()
              onOpen(s.id)
            }}
            aria-label={`Open ${s.word || "About Me"}`}
            className="group absolute focus:outline-none"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.width}%`,
              height: `${s.height}%`,
            }}
          >
            {/* Only the App zone shows a white frame, and only before the first
                tap (pulseApp). Every other object is frame-less; the label is the cue. */}
            <span
              className={`absolute inset-0 rounded-lg transition-all group-active:bg-white/10 ${
                pulseApp && s.id === "app" ? "ring-1 ring-white/60 desk-pulse" : ""
              }`}
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <span
                className="inline-flex items-baseline gap-2 text-sm font-medium uppercase tracking-[0.22em] text-white"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.85)" }}
              >
                {s.num && <span className="opacity-60">{s.num}</span>}
                <span>{s.word}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
