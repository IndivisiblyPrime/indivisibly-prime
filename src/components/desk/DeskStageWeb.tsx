/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { HOTSPOTS, toClip, toPath, type DeskId } from "./data"

/**
 * Desktop desk: the full photo with clickable object hotspots, each traced to
 * the object's real outline (see hotspots.json / the /calibrate tool).
 *
 * Hovering dims everything *outside* the object and brightens the object
 * itself — deliberately with **no visible white ring**. The only white outline
 * anywhere is the App attract pulse, which blinks on first arrival to invite
 * that first click and is gone for good once the visitor opens any card.
 *
 * Before that first click the hover spotlight is gated to "app", so nothing
 * competes with the invitation.
 */
export function DeskStageWeb({
  onOpen,
  pulseApp,
}: {
  onOpen: (id: DeskId) => void
  pulseApp: boolean
}) {
  const [hovered, setHovered] = useState<DeskId | null>(null)
  const [spotlightUnlocked, setSpotlightUnlocked] = useState(false)

  // Hovering only spotlights the object — it does NOT clear the App attract pulse.
  // The pulse persists through hover and lifts only on an actual click (onOpen).
  const enter = (id: DeskId) => setHovered(id)
  const leave = (id: DeskId) => setHovered((p) => (p === id ? null : p))

  const hoveredSpot = HOTSPOTS.find((h) => h.id === hovered)
  const showSpotlight = hoveredSpot && (spotlightUnlocked || hoveredSpot.id === "app")
  const appSpot = HOTSPOTS.find((h) => h.id === "app")!

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        className="relative select-none shadow-[0_0_140px_rgba(0,0,0,0.85)]"
        style={{ width: "min(100vw, 177.68vh)", aspectRatio: "1672 / 941" }}
        onClick={() => setSpotlightUnlocked(true)}
      >
        <img
          src="/desk.png"
          alt="Jack Harvey's desk — an iPhone running Bonsai, a Zen book, a frame of NFT art, and a leather notebook"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.5)" }} />

        {/* Spotlight — dim everything outside the outline, then relight the object
            with a clipped copy of the same photo so pixels align exactly. No ring. */}
        {showSpotlight && (
          <div className="pointer-events-none absolute inset-0 z-[16]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d={`M0 0H100V100H0Z ${toPath(hoveredSpot.outline)}`} fill="rgba(0,0,0,0.28)" fillRule="evenodd" />
            </svg>
            {/* glow lives on the wrapper: filter after clip-path on one element
                would clip the shadow away, so they must sit on separate nodes */}
            <div className="absolute inset-0" style={{ filter: "drop-shadow(0 0 28px rgba(255,238,210,0.30))" }}>
              <img
                src="/desk.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: toClip(hoveredSpot.outline), filter: "brightness(1.16) saturate(1.06)" }}
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* The one visible outline on the whole desk: the App attract pulse.
            Traces the phone itself and disappears permanently on the first click. */}
        {pulseApp && (
          <svg
            className="desk-outline-pulse pointer-events-none absolute inset-0 z-[17] h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,238,210,0.55))" }}
            aria-hidden
          >
            <path d={toPath(appSpot.outline)} fill="none" stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </svg>
        )}

        {/* Hover / click targets — the outline itself, so the cursor only reacts
            over the actual object rather than a bounding box around it. */}
        <svg className="absolute inset-0 z-[18] h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {HOTSPOTS.map((h) => (
            <path
              key={h.id}
              d={toPath(h.outline)}
              fill="transparent"
              className="cursor-pointer outline-none"
              style={{ pointerEvents: "auto" }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${h.word || "About Me"}`}
              onClick={() => onOpen(h.id)}
              onMouseEnter={() => enter(h.id)}
              onMouseLeave={() => leave(h.id)}
            />
          ))}
        </svg>

        {/* Always-visible white labels (kept above the spotlight so they stay legible) */}
        {HOTSPOTS.map((h) => {
          const isHot = hovered === h.id
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
              onClick={() => onOpen(h.id)}
              onMouseEnter={() => enter(h.id)}
              onMouseLeave={() => leave(h.id)}
              className="absolute z-20 cursor-pointer whitespace-nowrap text-center focus:outline-none"
              style={{ left: `${h.labelX}%`, top: `${h.labelY}%`, transform }}
            >
              <span
                className={`inline-flex items-baseline gap-2 font-medium uppercase tracking-[0.22em] text-white transition-transform duration-300 ${isHot ? "scale-110" : "scale-100"}`}
                style={{
                  textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.75)",
                  fontSize: "clamp(0.7rem, 1.15vw, 1.05rem)",
                }}
              >
                {h.num && <span className="opacity-60">{h.num}</span>}
                <span>{h.word}</span>
              </span>
              <span
                className={`mx-auto mt-1.5 block h-px bg-white transition-all duration-300 ${isHot ? "w-full opacity-90" : "w-0 opacity-0"}`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
