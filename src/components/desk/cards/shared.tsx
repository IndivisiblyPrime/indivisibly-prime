import { ArrowUpRight } from "lucide-react"

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
      {children}
    </p>
  )
}

/**
 * Outlined action button matching the site's black-outline / invert-on-hover style.
 * Renders a real link when `href` is set, otherwise a plain (placeholder) button.
 */
export function ActionButton({
  children,
  href,
  variant = "solid",
}: {
  children: React.ReactNode
  href?: string
  variant?: "solid" | "ghost"
}) {
  const cls =
    variant === "solid"
      ? "inline-flex items-center gap-2 border border-black px-6 py-2.5 text-sm font-medium tracking-wide text-black transition-colors hover:bg-black hover:text-white"
      : "inline-flex items-center gap-2 border border-neutral-300 px-6 py-2.5 text-sm font-medium tracking-wide text-neutral-700 transition-colors hover:border-black hover:text-black"

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    )
  }
  return (
    <button type="button" className={cls}>
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </button>
  )
}
