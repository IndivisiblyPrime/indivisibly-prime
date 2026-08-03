export const revalidate = 60

import { Metadata } from "next"
import { urlFor } from "@/sanity/lib/image"
import { getHomepageSettings } from "@/sanity/lib/homepage"
import { DeskExperience } from "@/components/desk/DeskExperience"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomepageSettings()
  const title = settings?.siteTitle || "Jack Harvey"
  return {
    title,
    description: title,
    icons: settings?.siteFavicon
      ? { icon: urlFor(settings.siteFavicon).width(64).height(64).url() }
      : undefined,
  }
}

export default async function Home() {
  const settings = await getHomepageSettings()
  return <DeskExperience settings={settings ?? {}} />
}
