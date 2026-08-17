import { notFound } from "next/navigation"
import { CalibrateTool } from "@/components/desk/CalibrateTool"

// Dev-only: the tool writes into the source tree via /api/calibrate.
export const metadata = { title: "Calibrate desk hotspots" }

export default function CalibratePage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <CalibrateTool />
}
