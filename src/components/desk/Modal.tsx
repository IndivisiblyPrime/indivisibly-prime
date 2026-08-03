"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

/**
 * Responsive card shell. The desk stays visible behind a soft dim; the card is
 * fluid (never a fixed pixel width) so it reflows cleanly on resize and on phone.
 * Closes on ✕, Escape, or a backdrop click.
 */
export function Modal({
  onClose,
  wide = false,
  children,
}: {
  onClose: () => void
  wide?: boolean
  children: React.ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 duration-300 animate-in fade-in sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[90dvh] overflow-y-auto overscroll-contain rounded-2xl border border-black/10 bg-[#f8f5ee] shadow-2xl duration-500 ease-out animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
        style={{ width: wide ? "min(96vw, 60rem)" : "min(96vw, 46rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-neutral-500 backdrop-blur-sm transition-colors hover:bg-black hover:text-white sm:right-4 sm:top-4"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-5 sm:p-8 md:p-10">{children}</div>
      </div>
    </div>
  )
}
