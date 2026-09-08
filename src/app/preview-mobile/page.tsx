import { notFound } from "next/navigation"
import { MobilePreview } from "@/components/desk/MobilePreview"

/**
 * View the phone version of the site on a desktop screen, without resizing the
 * window (Jack, 2026-09-08 — "I left my iPhone in the other room").
 *
 * The desk picks its layout purely from viewport width at the `md` (768px)
 * breakpoint, so an iframe narrower than that renders the real phone desk with
 * no special-casing — this is the actual site, not a mock of it.
 *
 * **Local only**, like the calibrate tools: it's a dev convenience with no
 * reason to exist on jackharvey.me.
 */
export const metadata = { title: "Mobile preview" }

export default function MobilePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <MobilePreview />
}
