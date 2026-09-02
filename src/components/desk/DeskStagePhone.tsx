/* eslint-disable @next/next/no-img-element */
"use client"

import { MOBILE_HOTSPOTS, toPath, type DeskId } from "./data"

/**
 * Engraved-in-the-wood nudges, sitting in the bare desk beside an object and
 * pointing at it (Jack, 2026-09-02). These replaced the App's white attract
 * outline on mobile, which he asked to remove entirely — the cue is meant to
 * read as part of the photograph rather than as UI painted on top of it.
 *
 * x/y are % of the photo and mark the cue's RIGHT edge (it's right-aligned so
 * the arrowhead lands a consistent gap from the object, whatever the text
 * length). Placed in the empty wood left of each object: for the App that's
 * between the bonsai above and the coffee cup below; for the Book it's under
 * the coffee cup and above the brush.
 *
 * Set on TWO lines deliberately. That strip of bare wood is only ~36% of the
 * photo's width, and "Click for details" on one line overran the left edge and
 * got clipped; the gap is tall but narrow, so the text wraps to suit it rather
 * than shrinking to an unreadable size.
 */
const CUES: { id: DeskId; lines: string[]; x: number; y: number }[] = [
  { id: "app", lines: ["Click for", "details"], x: 34.5, y: 22.5 },
  { id: "book", lines: ["Click for", "details"], x: 32.5, y: 45.5 },
]

/**
 * Phone desk: one continuous photo (desk-mobile.png) with the title overlaid on
 * its own top margin — no nav bar, nothing sticky, so it scrolls away with the
 * rest of the page.
 *
 * Hit targets are the objects' true photographed outlines, calibrated by hand
 * in /calibrate-mobile and stored in hotspots-mobile.json — the same workflow
 * and data shape as the web desk, just its own photo and its own file. Labels
 * sit at the calibrated anchors too, and carry no leading number here (the web
 * desk keeps its "1 · App" numbering; Jack wanted the phone clean).
 *
 * No attract outline on this viewport by design — see CUES above.
 */
export function DeskStagePhone({
  onOpen,
  entryTitle,
}: {
  onOpen: (id: DeskId) => void
  entryTitle: string
}) {
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
            rest of the desk (Jack, 2026-09-02). Sized in vw and held to one
            line: it must not wrap, so the type shrinks with the viewport
            instead. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-5 pt-6">
          <span
            className="whitespace-nowrap text-center font-medium leading-tight text-[#F7F1E7]"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(1.25rem, 7.1vw, 2rem)",
              textShadow: "0 2px 20px rgba(0,0,0,0.65)",
            }}
          >
            {entryTitle}
          </span>
        </div>

        {/* Engraved cues. Decorative only — pointer-events-none keeps the tap
            areas exactly as calibrated, so these can't steal a press meant for
            the wood. The carved look is two-part: ink darker than the wood,
            plus a warm highlight one pixel BELOW it, which is what reads as a
            lit lower edge of a cut groove. */}
        {CUES.map((cue) => (
          <div
            key={cue.id}
            aria-hidden
            className="pointer-events-none absolute flex items-center gap-2"
            style={{ left: `${cue.x}%`, top: `${cue.y}%`, transform: "translate(-100%, -50%)" }}
          >
            <span
              className="flex flex-col items-end text-right font-medium uppercase leading-[1.5]"
              style={{
                fontSize: "clamp(0.52rem, 2.45vw, 0.72rem)",
                letterSpacing: "0.18em",
                color: "rgba(24,15,8,0.66)",
                textShadow: "0 1px 0.5px rgba(233,208,169,0.2)",
              }}
            >
              {cue.lines.map((line) => (
                <span key={line} className="whitespace-nowrap">
                  {line}
                </span>
              ))}
            </span>
            {/* Arrow drawn rather than a glyph, so the shaft length and the
                carved treatment are under our control. The highlight is a real
                offset copy of the path rather than a drop-shadow: on a stroke
                this thin a blurred shadow washes out to nothing, and the whole
                arrow then disappears into the dark wood. */}
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" className="shrink-0">
              <g strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M0 6H25M21.5 3L25 6L21.5 9" stroke="rgba(233,208,169,0.2)" />
                <path d="M0 5H25M21.5 2L25 5L21.5 8" stroke="rgba(24,15,8,0.66)" />
              </g>
            </svg>
          </div>
        ))}

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
              onClick={() => onOpen(h.id)}
            />
          ))}
        </svg>

        {/* Labels at their calibrated anchors, above the outline so they stay
            legible. Each carries a small arrow pointing back at its object,
            which replaced the leading "1 / 2 / 3" numbers (Jack, 2026-09-02).
            Direction is derived from labelPlace rather than hardcoded per
            object: a label sitting ABOVE its object points down at it, one
            sitting BELOW (About Me) points up. Recalibrating a label to the
            other side therefore flips its arrow automatically. */}
        {MOBILE_HOTSPOTS.map((h) => {
          const transform =
            h.labelPlace === "above"
              ? "translate(-50%, -100%)"
              : h.labelPlace === "below"
              ? "translate(-50%, 0)"
              : "translate(-50%, -50%)"
          const pointsDown = h.labelPlace !== "below"
          return (
            <button
              key={`label-${h.id}`}
              type="button"
              onClick={() => onOpen(h.id)}
              className="absolute z-20 cursor-pointer whitespace-nowrap text-center focus:outline-none"
              style={{ left: `${h.labelX}%`, top: `${h.labelY}%`, transform }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.22em] text-white"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.85)" }}
              >
                <span>{h.word}</span>
                {/* currentColor + the same drop-shadow keeps the arrow reading
                    as part of the word rather than a separate icon. */}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                  className="shrink-0 opacity-70"
                  style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.95))" }}
                >
                  <path
                    d={pointsDown ? "M6 1.5V10.5M2.6 7.1L6 10.5L9.4 7.1" : "M6 10.5V1.5M2.6 4.9L6 1.5L9.4 4.9"}
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
