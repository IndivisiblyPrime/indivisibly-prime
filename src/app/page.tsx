export const revalidate = 60

import { getHomepageSettings } from "@/sanity/lib/homepage"
import { DeskExperience } from "@/components/desk/DeskExperience"

// Title, description and icons all come from the root layout — declaring `icons`
// here would replace the layout's full icon set (including apple-touch-icon) with
// just this one entry, which is exactly what broke the favicon on mobile.

export default async function Home() {
  const settings = await getHomepageSettings()
  return <DeskExperience settings={settings ?? {}} />
}
