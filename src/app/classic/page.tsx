export const revalidate = 60

import { Metadata } from "next"
import { urlFor } from "@/sanity/lib/image"
import { getHomepageSettings } from "@/sanity/lib/homepage"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { ExploreSection } from "@/components/sections/ExploreSection"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getHomepageSettings()
  const title = settings?.siteTitle || "Jack Harvey"
  return {
    title: `${title} — Classic`,
    description: title,
    icons: settings?.siteFavicon
      ? { icon: urlFor(settings.siteFavicon).width(64).height(64).url() }
      : undefined,
  }
}

// The previous homepage, preserved for reference / revert while the Desk design
// is live at `/`. Uses the same components and data as before.
export default async function Classic() {
  const settings = await getHomepageSettings()

  return (
    <>
      <Navbar navItems={settings?.navItems} />
      <main>
        <HeroSection
          heroImage={settings?.heroImage}
          heroVideo={settings?.heroVideo}
          heroVideoUrl={settings?.heroVideoUrl}
          heroIntroVideo={settings?.heroIntroVideo}
          heroBoredomVideo={settings?.heroBoredomVideo}
          heroBoredomButtonText={settings?.heroBoredomButtonText}
        />
        <ExploreSection
          bookTitle={settings?.bookTitle}
          bookDescription={settings?.bookDescription}
          bookImage={settings?.bookImage}
          bookButtonText={settings?.bookButtonText}
          bookButtonUrl={settings?.bookButtonUrl}
          appTitle={settings?.appTitle}
          appSubtitle={settings?.appSubtitle}
          appButtonText={settings?.appButtonText}
          appButtonUrl={settings?.appButtonUrl}
          appImage={settings?.appImage}
          appGongSound={settings?.appGongSound}
          nftSubtitle={settings?.nftSectionSubtitle}
          nftGallery={settings?.nftGallery}
          landscapeGallery={settings?.landscapeGallery}
          ctaButtonText={settings?.ctaButtonText}
          ctaButtonUrl={settings?.ctaButtonUrl}
          encryptedText={settings?.encryptedText}
          accordionItems={settings?.aboutAccordion}
          socialLinks={settings?.socialLinks}
          instagramUrl={settings?.instagramUrl}
          aboutIntroText={settings?.aboutIntroText}
          comingSoonItems={settings?.comingSoonItems}
          comingSoonTagline={settings?.comingSoonTagline}
        />
      </main>
    </>
  )
}
