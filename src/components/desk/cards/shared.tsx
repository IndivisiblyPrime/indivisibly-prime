import { ArrowUpRight } from "lucide-react"

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

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 md:mb-4 md:text-lg">
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

export function ActionButton({
  children,
  href,
  variant = "solid",
}: {
  children: React.ReactNode
  href?: string
  variant?: "solid" | "ghost" | "link"
}) {
  const cls = variant === "solid" ? solidButton : variant === "link" ? linkAction : ghostButton

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className={solidButtonIcon} />
      </a>
    )
  }
  return (
    <button type="button" className={cls}>
      {children}
      <ArrowUpRight className={solidButtonIcon} />
    </button>
  )
}
