import { notFound } from "next/navigation"
import { CalibrateMobileTool } from "@/components/desk/CalibrateMobileTool"

/**
 * Mobile desk hotspot calibration — **local only**, same as `/calibrate`.
 *
 * It was briefly deployed read-only (Copy/Download JSON) so Jack could
 * calibrate against the live site; he did one pass, then asked for it taken
 * down — he doesn't want the tool visible to anyone else, and localhost + a
 * download does the job. That's the settled call (2026-09-02).
 *
 * Both tools now 404 in production, as do both write endpoints.
 */
export const metadata = { title: "Calibrate mobile desk hotspots" }

export default function CalibrateMobilePage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <CalibrateMobileTool />
}
