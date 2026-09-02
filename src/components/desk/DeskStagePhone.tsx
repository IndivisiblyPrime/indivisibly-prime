/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef } from "react"
import { MOBILE_HOTSPOTS, toPath, toPathPxMobile, type DeskId } from "./data"

const DRAW_MS = 1150

/**
 * Trace the App outline once, when the phone desk first mounts. Same technique
 * (and same reasoning) as the web desk's useDrawOn: `pathLength="1"` does not
 * normalise dash units, so the length has to be measured with getTotalLength()
 * and driven through the Web Animations API, or the "one travelling segment"
 * renders as dozens of marching dashes.
 */
function useDrawOn(enabled: boolean) {
  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const len = el.getTotalLength()
    el.style.strokeDasharray = String(len)
    const anim = el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: DRAW_MS,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    })
    return () => anim.cancel()
  }, [enabled])

  return ref
}

/**
 * Phone desk: one continuous photo (desk-mobile.png) with the title overlaid on
 * its own top margin — no nav bar, nothing sticky, so it scrolls away with the
 * rest of the page.
 *
 * Hit targets are the objects' true photographed outlines, calibrated by hand
 * in /calibrate-mobile and stored in hotspots-mobile.json — the same workflow
 * and data shape as the web desk, just its own photo and its own file. Labels
 * sit at the calibrated anchors too.
 *
 * The App gets the attract outline (draw-on, then breathing) to earn the first
 * tap, exactly like the web desk; it fades for good once any card is opened.
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
  const drawRef = useDrawOn(pulseApp)
  const appSpot = MOBILE_HOTSPOTS.find((h) => h.id === "app")!

  const open = (id: DeskId) => {
    onInteract()
    onOpen(id)
  }

  return (
    <div className="min-h-dvh w-full bg-[#171009]">
      <div className="relative w-full">
        <img
          src="/desk-mobile.png"
          alt="Jack Harvey's desk — an iPhone running Bonsai, a Zen book, a frame of NFT art, and a leather notebook"
          className="block w-full select-none"
          draggable={false}
        />

        {/* Title overlaid directly on the photo's own top margin — not a
            separate bar, and not sticky/fixed, so it scrolls away with the
            rest of the desk (Jack, 2026-09-02). */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-6 pt-6">
          <span
            className="text-center text-[2.85rem] font-medium leading-tight text-[#F7F1E7]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", textShadow: "0 2px 20px rgba(0,0,0,0.65)" }}
          >
            {entryTitle}
          </span>
        </div>

        {/* Attract cue — the one visible outline on the phone desk. Draws itself
            around the App once, then breathes, and is gone for good after the
            first tap on anything (fading rather than snapping out).
            Pixel-space viewBox so the stroke scales uniformly and the dash
            length agrees with getTotalLength() — see toPathPxMobile. */}
        <div
          className={`pointer-events-none absolute inset-0 z-[17] transition-opacity duration-[900ms] ${
            pulseApp ? "opacity-100" : "opacity-0"
          }`}
        >
          <svg
            className="desk-outline-pulse absolute inset-0 h-full w-full"
            viewBox="0 0 724 2172"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,238,210,0.6))" }}
            aria-hidden
          >
            <path
              ref={drawRef}
              d={toPathPxMobile(appSpot.outline)}
              fill="none"
              stroke="#fff"
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tap targets — the outline itself, so a tap only registers over the
            real object rather than a bounding box around it. */}
        <svg className="absolute inset-0 z-[18] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {MOBILE_HOTSPOTS.map((h) => (
            <path
              key={h.id}
              d={toPath(h.outline)}
              fill="transparent"
              className="cursor-pointer outline-none"
              style={{ pointerEvents: "auto" }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${h.word || "About Me"}`}
              onClick={() => open(h.id)}
            />
          ))}
        </svg>

        {/* Labels at their calibrated anchors, above the outline so they stay legible. */}
        {MOBILE_HOTSPOTS.map((h) => {
          const transform =
            h.labelPlace === "above"
              ? "translate(-50%, -100%)"
              : h.labelPlace === "below"
              ? "translate(-50%, 0)"
              : "translate(-50%, -50%)"
          return (
            <button
              key={`label-${h.id}`}
              type="button"
              onClick={() => open(h.id)}
              className="absolute z-20 cursor-pointer whitespace-nowrap text-center focus:outline-none"
              style={{ left: `${h.labelX}%`, top: `${h.labelY}%`, transform }}
            >
              <span
                className="inline-flex items-baseline gap-2 text-sm font-medium uppercase tracking-[0.22em] text-white"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.85)" }}
              >
                {h.num && <span className="opacity-60">{h.num}</span>}
                <span>{h.word}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
