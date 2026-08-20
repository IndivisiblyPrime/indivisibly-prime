import { ArrowUpRight } from "lucide-react"

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
  "group inline-flex items-center gap-2 border border-black bg-black px-6 py-2.5 text-sm font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"

/** The arrow nudges along with the lift — a second, quieter hover cue. */
export const solidButtonIcon =
  "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"

/** Secondary action (e.g. the App's Website link) — reads as the quieter sibling. */
const ghostButton =
  "group inline-flex items-center gap-2 border border-neutral-300 px-6 py-2.5 text-sm font-medium tracking-wide text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:text-black hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"

/**
 * Underlined text link — no box, just the rule beneath it. Sits beside a solid
 * button as the lighter of two choices. Hover darkens the rule rather than
 * filling anything, keeping to the no-invert rule.
 */
const linkAction =
  "group inline-flex items-center gap-2 border-b border-neutral-300 pb-1.5 text-base font-medium text-neutral-800 transition-colors duration-200 hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"

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
