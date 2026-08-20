/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"
import { HOTSPOTS, toClip, toPath, toPathPx, type DeskId } from "./data"

const DRAW_MS = 1150

/**
 * Trace the App outline once, when the desk is first revealed.
 *
 * The dash length has to be measured rather than declared: `pathLength="1"`
 * looks like it should let CSS animate a normalised dash, but the dash units
 * here still resolve in user space, so a `stroke-dasharray: 1` renders as
 * dozens of little dashes marching around the phone instead of one travelling
 * segment. `getTotalLength()` gives the real figure, and the Web Animations
 * API keeps the whole thing in one place.
 */
function useDrawOn(revealed: boolean) {
  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!revealed || !el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const len = el.getTotalLength()
    el.style.strokeDasharray = String(len)
    const anim = el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: DRAW_MS,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    })
    return () => anim.cancel()
  }, [revealed])

  return ref
}

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
  revealed,
}: {
  onOpen: (id: DeskId) => void
  pulseApp: boolean
  /** Cover has lifted. The attract cues wait for it, or they'd play unseen. */
  revealed: boolean
}) {
  const [hovered, setHovered] = useState<DeskId | null>(null)
  const [spotlightUnlocked, setSpotlightUnlocked] = useState(false)
  const drawRef = useDrawOn(revealed)

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

        {/* Attract cue — the one visible outline on the whole desk. Draws
            itself around the phone once, then breathes. Gone for good after
            the first click, fading rather than snapping out. Deliberately
            heavy (Jack wanted it ~3× thicker); `round` joins and caps keep a
            stroke this thick from showing corner facets.
            A dim-the-other-three-objects layer used to run alongside this;
            Jack asked for it removed (2026-08-20) while keeping the outline
            itself, so the App now earns the click on its own. */}
        {revealed && (
          <div
            className={`pointer-events-none absolute inset-0 z-[17] transition-opacity duration-[900ms] ${
              pulseApp ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Pixel-space viewBox so this scales uniformly: the stroke stays an
                even thickness all the way round, and the dash length agrees with
                getTotalLength(). Width is in those units (5.2 ≈ 4.5px at a
                1440-wide stage) so it stays proportional as the desk resizes. */}
            <svg
              className="desk-outline-pulse absolute inset-0 h-full w-full"
              viewBox="0 0 1672 941"
              style={{ filter: "drop-shadow(0 0 14px rgba(255,238,210,0.6))" }}
              aria-hidden
            >
              <path
                ref={drawRef}
                d={toPathPx(appSpot.outline)}
                fill="none"
                stroke="#fff"
                strokeWidth={5.2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
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
