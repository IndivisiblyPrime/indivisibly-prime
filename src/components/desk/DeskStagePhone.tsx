/* eslint-disable @next/next/no-img-element */
"use client"

import { PHONE_SCENES, type DeskId } from "./data"

/**
 * Phone version: the first screen is the WHOLE desk (all four objects) under a
 * translucent "Jack Harvey" intro. Scroll down to the object cut-outs, one per
 * screen. The tap target + white frame sits over JUST the object in each cut-out.
 * Cut-outs derive from the desk photo (public/desk-phone-*.png) — swap for real
 * phone photos 1:1 later.
 */
export function DeskStagePhone({
  onOpen,
  pulseApp,
  onInteract,
  entryTitle,
  entrySubtitle,
}: {
  onOpen: (id: DeskId) => void
  pulseApp: boolean
  onInteract: () => void
  entryTitle: string
  entrySubtitle: string
}) {
  return (
    <div className="min-h-dvh w-full bg-[#171009]">
      {/* Intro — the whole desk with the translucent name over it */}
      <section className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        <img src="/desk.png" alt="Jack Harvey's desk" className="w-full select-none" draggable={false} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,11,6,0.72) 0%, rgba(16,11,6,0.5) 45%, rgba(16,11,6,0.86) 100%)",
          }}
        />
        <div className="desk-rise absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1
            className="font-medium text-[#F7F1E7]"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(2.6rem, 15vw, 4.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            {entryTitle}
          </h1>
          {entrySubtitle && (
            <p
              className="mt-5 text-xs uppercase tracking-[0.4em] text-[#E7DCC6]/85"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
            >
              {entrySubtitle}
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <span className="mb-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">Scroll</span>
          <span className="desk-scroll-cue block h-8 w-px bg-gradient-to-b from-[#E7DCC6]/80 to-transparent" />
        </div>
      </section>

      {/* Object cut-outs — tap only over the object itself */}
      {PHONE_SCENES.map((s) => (
        <section key={s.id} className="relative w-full">
          <img src={s.src} alt={s.word} className="block w-full select-none" draggable={false} />
          <button
            type="button"
            onClick={() => {
              onInteract()
              onOpen(s.id)
            }}
            aria-label={`Open ${s.word || "About Me"}`}
            className="group absolute focus:outline-none"
            style={{
              left: `${s.object.left}%`,
              top: `${s.object.top}%`,
              width: `${s.object.width}%`,
              height: `${s.object.height}%`,
            }}
          >
            <span
              className={`absolute inset-0 rounded-lg ring-1 ring-white/55 transition-all group-active:bg-white/5 group-active:ring-white ${
                pulseApp && s.id === "app" ? "desk-pulse" : ""
              }`}
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
              <span
                className="inline-flex items-baseline gap-2 text-base font-medium uppercase tracking-[0.22em] text-white"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.85)" }}
              >
                {s.num && <span className="opacity-60">{s.num}</span>}
                <span>{s.word}</span>
              </span>
              <span className="mt-0.5 block text-[0.55rem] uppercase tracking-[0.3em] text-white/60">
                Tap to open
              </span>
            </span>
          </button>
        </section>
      ))}

      <p className="px-6 py-10 text-center text-xs uppercase tracking-[0.35em] text-white/40">Jack Harvey</p>
    </div>
  )
}
