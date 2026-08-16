/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { HOTSPOTS, type DeskId } from "./data"

/**
 * Desktop desk: the full photo with clickable object hotspots. On hover the
 * hovered object brightens + gets a white ring while the rest of the desk dims
 * (spotlight box-shadow) — "singling it out". Before the first click anywhere
 * on the desk, that spotlight only fires for "app" (to draw the eye there
 * first); any click unlocks it for every object. The "1 · App" object also
 * gently pulses to invite the first click, independent of this gating.
 */
export function DeskStageWeb({
  onOpen,
  pulseApp,
}: {
  onOpen: (id: DeskId) => void
  pulseApp: boolean
}) {
  const [hovered, setHovered] = useState<DeskId | null>(null)
  // Before the visitor's first click anywhere on the desk, the hover spotlight
  // (background shading) only fires for "app" — it invites that first click
  // without distracting toward the other objects. Any click unlocks it for all.
  const [spotlightUnlocked, setSpotlightUnlocked] = useState(false)

  // Hovering only spotlights the object — it does NOT clear the App attract pulse.
  // The pulse persists through hover and lifts only on an actual click (onOpen).
  const enter = (id: DeskId) => setHovered(id)
  const leave = (id: DeskId) => setHovered((p) => (p === id ? null : p))

  const hoveredSpot = HOTSPOTS.find((h) => h.id === hovered)
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

        {/* App attract pulse — stays until the first click, even while hovering */}
        {pulseApp && (
          <div
            className="desk-pulse pointer-events-none absolute z-[12]"
            style={{
              left: `${appSpot.left}%`,
              top: `${appSpot.top}%`,
              width: `${appSpot.width}%`,
              height: `${appSpot.height}%`,
              borderRadius: appSpot.radius,
            }}
          />
        )}

        {/* Transparent hover / click targets */}
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => onOpen(h.id)}
            onMouseEnter={() => enter(h.id)}
            onMouseLeave={() => leave(h.id)}
            aria-label={`Open ${h.word || "About Me"}`}
            className="absolute z-[13] cursor-pointer focus:outline-none"
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              width: `${h.width}%`,
              height: `${h.height}%`,
              borderRadius: h.radius,
            }}
          />
        ))}

        {/* Spotlight — brighten hovered rect + white ring + darken everything else.
            Gated to "app" only until the visitor's first click anywhere on the desk. */}
        {hoveredSpot && (spotlightUnlocked || hoveredSpot.id === "app") && (
          <div
            className="pointer-events-none absolute z-[16] ring-1 ring-white/60 backdrop-brightness-[1.16] backdrop-saturate-[1.06]"
            style={{
              left: `${hoveredSpot.left}%`,
              top: `${hoveredSpot.top}%`,
              width: `${hoveredSpot.width}%`,
              height: `${hoveredSpot.height}%`,
              borderRadius: hoveredSpot.radius,
              boxShadow: "0 0 0 100vmax rgba(0,0,0,0.28), 0 0 55px rgba(255,238,210,0.35)",
            }}
          />
        )}

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
