export const revalidate = 60

import type { Metadata } from "next"
import { getHomepageSettings } from "@/sanity/lib/homepage"
import { DeskExperience } from "@/components/desk/DeskExperience"
import { JsonLd } from "@/components/JsonLd"
import { homeJsonLd } from "@/lib/site"

// Title, description and icons all come from the root layout — declaring `icons`
// here would replace the layout's full icon set (including apple-touch-icon) with
// just this one entry, which is exactly what broke the favicon on mobile.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

export default async function Home() {
  const settings = await getHomepageSettings()
  return (
    <>
      <JsonLd data={homeJsonLd(settings ?? {})} />
      <DeskExperience settings={settings ?? {}} />
    </>
  )
}
