import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * **The desktop 1.5× scale (Jack, 2026-09-09).** Every card's supporting text
 * and every button is 50% larger from `md` up; phone sizes are deliberately
 * untouched ("the text is good across the board" on mobile). So each size here
 * is written as a base value plus an `md:` value exactly 1.5× it —
 * 12→18px (`md:text-lg`), 14→21px (`md:text-[1.3125rem]`), 16→24px
 * (`md:text-2xl`), 18→27px (`md:text-[1.6875rem]`) — and padding scales the
 * same way. Card *titles* are the exception: they were already display-sized
 * and 1.5× would wrap them, so they stayed put.
 */

/**
 * The "01 — The App" kicker, above each card's title. Briefly pulled from all
 * three cards on 2026-09-10 and back the next day — at its **original** size,
 * deliberately outside the desktop 1.5× scale: Jack asked for the old font
 * size and style back, so there is no `md:` step here. Don't add one.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
      {children}
    </p>
  )
}

/**
 * The site's primary button: **solid black from the start**, never an
 * outline-that-fills-on-hover (Jack, 2026-08-17). Hover must stay obvious
 * without inverting to white, so it lifts, deepens its shadow and warms one
 * step off pure black. Every primary action shares this exact class — the card
 * CTAs, Send Message and Subscribe — so they can't drift apart.
 */
export const solidButton =
  "group inline-flex items-center gap-2 border border-black bg-black px-6 py-2.5 text-sm font-medium md:gap-3 md:px-9 md:py-[0.9375rem] md:text-[1.3125rem] tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"

/** The arrow nudges along with the lift — a second, quieter hover cue. */
export const solidButtonIcon =
  "h-4 w-4 transition-transform md:h-6 md:w-6 duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"

/** Secondary action (e.g. the App's Website link) — reads as the quieter sibling. */
const ghostButton =
  "group inline-flex items-center gap-2 border border-neutral-300 px-6 py-2.5 text-sm font-medium md:gap-3 md:px-9 md:py-[0.9375rem] md:text-[1.3125rem] tracking-wide text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:text-black hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"

/**
 * Underlined text link — no box, just the rule beneath it. Sits beside a solid
 * button as the lighter of two choices. Hover darkens the rule rather than
 * filling anything, keeping to the no-invert rule.
 */
const linkAction =
  "group inline-flex items-center gap-2 border-b border-neutral-300 pb-1.5 text-base font-medium md:gap-3 md:pb-[0.5625rem] md:text-2xl text-neutral-800 transition-colors duration-200 hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"

/**
 * Two opt-outs from the desktop 1.5× step, for the buttons Jack wants quieter
 * than the App/Book CTAs (2026-09-10). Pass them through `cn()` *after* the
 * base string — tailwind-merge drops the class they replace, so the arbitrary
 * values here win over `solidButton`'s own `md:` sizes.
 *
 * - `buttonScale75` — three quarters of the desktop size. The NFT card's
 *   "All NFT Galleries", so the artwork keeps the attention.
 * - `buttonScalePhone` — no desktop step at all, i.e. a third smaller on the
 *   web. The mailing list's Subscribe, part of shrinking that whole section.
 */
export const buttonScale75 = "md:gap-[0.5625rem] md:px-[1.6875rem] md:py-[0.703125rem] md:text-[0.984375rem]"
export const buttonIconScale75 = "md:h-[1.125rem] md:w-[1.125rem]"
export const buttonScalePhone = "md:gap-2 md:px-6 md:py-2.5 md:text-sm"
export const buttonIconScalePhone = "md:h-4 md:w-4"

export function ActionButton({
  children,
  href,
  variant = "solid",
  className,
  iconClassName,
}: {
  children: React.ReactNode
  href?: string
  variant?: "solid" | "ghost" | "link"
  /** Scale override, e.g. `buttonScale75`. Merged over the shared class. */
  className?: string
  iconClassName?: string
}) {
  const cls = cn(variant === "solid" ? solidButton : variant === "link" ? linkAction : ghostButton, className)
  const icon = <ArrowUpRight className={cn(solidButtonIcon, iconClassName)} />

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {icon}
      </a>
    )
  }
  return (
    <button type="button" className={cls}>
      {children}
      {icon}
    </button>
  )
}
