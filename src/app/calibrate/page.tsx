import { notFound } from "next/navigation"
import { CalibrateTool } from "@/components/desk/CalibrateTool"

/**
 * Desk hotspot calibration — **local only**, by choice.
 *
 * It saves by rewriting hotspots.json in the source tree, which a serverless
 * filesystem can't do anyway, and the calibrated result reaches the live site
 * through a commit. So there is nothing for production to serve: this 404s
 * there, and `/api/calibrate` does the same.
 */
export const metadata = { title: "Calibrate desk hotspots" }

export default function CalibratePage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <CalibrateTool />
}
