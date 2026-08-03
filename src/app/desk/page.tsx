export const revalidate = 60

import type { Metadata } from "next"
import { getHomepageSettings } from "@/sanity/lib/homepage"
import { DeskExperience } from "@/components/desk/DeskExperience"

export const metadata: Metadata = {
  title: "Jack Harvey — The Desk",
  description: "An interactive desk. Explore the app, the book, the art, and the story behind them.",
}

// Alias of the homepage — the Desk now lives at `/` too.
export default async function DeskPage() {
  const settings = await getHomepageSettings()
  return <DeskExperience settings={settings ?? {}} />
}
