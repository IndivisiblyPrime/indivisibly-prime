import { client } from "@/sanity/lib/client"
import { HomepageSettings } from "@/lib/types"

// Shared homepage projection used by the Desk homepage (`/`), the `/desk` alias,
// and the `/classic` backup. It is a superset — projects every field any of the
// three surfaces reads. Omitting a field here makes it `undefined` in components.
export const HOMEPAGE_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  entryTitle,
  entrySubtitle,
  navItems[]{ _key, label, target },
  heroImage,
  heroVideo,
  heroVideoUrl,
  heroIntroVideo,
  heroBoredomVideo,
  heroBoredomButtonText,
  bookTitle,
  bookSubtitle,
  bookDescription,
  bookImage,
  bookButtonText,
  bookButtonUrl,
  appTitle,
  appTagline,
  appSubtitle,
  appButtonText,
  appButtonUrl,
  appWebsiteButtonText,
  appWebsiteButtonUrl,
  appImage,
  appImages,
  appGongSound,
  nftSectionTitle,
  nftSectionSubtitle,
  landscapeGallery[]{ _key, title, image, alt, year, collection, url },
  nftGallery[]{ _key, title, image, alt, year, collection, url },
  ctaButtonText,
  ctaButtonUrl,
  encryptedText,
  aboutAccordion[]{
    _key,
    title,
    content,
    showSocialLinks,
    itemType,
    experienceEntries[]{ _key, logo, jobTitle, dateRange, company, description },
    logoFreeformEntries[]{ _key, logo, title, dateRange, subtitle, description }
  },
  aboutTagline,
  aboutImage,
  socialLinks[]{ _key, platform, url },
  instagramUrl,
  aboutIntroText,
  comingSoonTagline,
  comingSoonItems[]{ _key, logo, title, dateRange, subtitle, description, url, exploreMoreUrl }
}`

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  try {
    return await client.fetch(HOMEPAGE_QUERY)
  } catch {
    return null
  }
}
