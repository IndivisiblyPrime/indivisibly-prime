import { CalibrateTool } from "@/components/desk/CalibrateTool"

/**
 * Desk hotspot calibration. Reachable in production too, but only behind the
 * Basic-auth gate in `src/middleware.ts` (which 404s when the credentials
 * aren't configured).
 *
 * `writable` is the honest capability signal: on Vercel the filesystem is
 * read-only, so Save cannot rewrite hotspots.json there. The tool switches to
 * exporting the JSON instead — see CalibrateTool.
 */
export const metadata = { title: "Calibrate desk hotspots", robots: { index: false, follow: false } }
export const dynamic = "force-dynamic"

export default function CalibratePage() {
  return <CalibrateTool writable={process.env.NODE_ENV !== "production"} />
}
