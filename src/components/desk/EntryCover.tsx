"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Stillpoint-style intro cover: a warm-dark scrim over the desk showing only the
 * name + a short "enter" line. Lifts away (fade + rise + slight scale, desk sharpens)
 * on the first scroll / wheel / touch / key or a click — then never returns this visit.
 */
export function EntryCover({
  title,
  subtitle,
  onDismiss,
}: {
  title: string
  subtitle: string
  onDismiss: () => void
}) {
  const [leaving, setLeaving] = useState(false)
  const dismissedRef = useRef(false)

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setLeaving(true)
    window.setTimeout(onDismiss, 820)
  }, [onDismiss])

  useEffect(() => {
    const onWheel = () => dismiss()
    const onTouch = () => dismiss()
    const onScroll = () => dismiss()
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter", "Escape"].includes(e.key)) dismiss()
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchmove", onTouch, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true, capture: true })
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions)
      window.removeEventListener("keydown", onKey)
    }
  }, [dismiss])

  return (
    <div
      onClick={dismiss}
      role="button"
      aria-label="Enter"
      tabIndex={0}
      className={`fixed inset-0 z-[70] flex cursor-pointer flex-col items-center justify-center transition-all duration-[820ms] ${
        leaving ? "pointer-events-none -translate-y-10 scale-[1.03] opacity-0" : "translate-y-0 scale-100 opacity-100"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.7, 0, 0.3, 1)",
        background:
          "linear-gradient(180deg, rgba(16,11,6,0.74) 0%, rgba(16,11,6,0.52) 42%, rgba(16,11,6,0.88) 100%)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div className="desk-rise px-6 text-center">
        <h1
          className="font-medium text-[#F7F1E7]"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(3rem, 9vw, 6rem)",
            lineHeight: 1,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 44px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-6 text-xs uppercase tracking-[0.4em] text-[#E7DCC6]/85 sm:text-sm"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-9 flex flex-col items-center">
        <span className="desk-scroll-cue block h-9 w-px bg-gradient-to-b from-[#E7DCC6]/80 to-transparent" />
      </div>
    </div>
  )
}
