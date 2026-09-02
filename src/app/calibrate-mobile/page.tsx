import { notFound } from "next/navigation"
import { CalibrateMobileTool } from "@/components/desk/CalibrateMobileTool"

/**
 * Mobile desk hotspot calibration — **local only**, same reasoning as
 * /calibrate: it saves by rewriting hotspots-mobile.json in the source tree,
 * which a serverless filesystem can't do, and the result reaches the live site
 * through a commit. This 404s in production, as does /api/calibrate-mobile.
 */
export const metadata = { title: "Calibrate mobile desk hotspots" }

export default function CalibrateMobilePage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <CalibrateMobileTool />
}
