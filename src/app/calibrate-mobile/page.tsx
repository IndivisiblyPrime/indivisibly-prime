import { CalibrateMobileTool } from "@/components/desk/CalibrateMobileTool"

/**
 * Mobile desk hotspot calibration. Unlike `/calibrate` (still local-only), this
 * one is deployed, at Jack's request (2026-09-02) so he can calibrate against
 * the live site without running a dev server.
 *
 * It is **read-only in production**: Vercel's filesystem can't be written to,
 * so there is no Save button there — the tool exports the JSON (Copy/Download)
 * and the result reaches the site through a commit. That commit was always the
 * last step anyway, even for a local Save, so nothing is lost.
 *
 * Not linked from anywhere and not in the sitemap, but it IS publicly
 * reachable. It can only read — no writes, no secrets, no Sanity token — so
 * the exposure is a stray dev tool, not a hole. Add Basic auth via middleware
 * if that stops being acceptable.
 */
export const metadata = {
  title: "Calibrate mobile desk hotspots",
  robots: { index: false, follow: false },
}

export default function CalibrateMobilePage() {
  return <CalibrateMobileTool writable={process.env.NODE_ENV !== "production"} />
}
