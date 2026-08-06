import { cache } from "react"
import { client } from "@/sanity/lib/client"
import { HomepageSettings } from "@/lib/types"

// Shared homepage projection used by the Desk homepage (`/`), the `/desk` alias,
// and the `/classic` backup. It is a superset — projects every field any of the
// three surfaces reads. Omitting a field here makes it `undefined` in components.
export const HOMEPAGE_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  entryTitle,
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

// ─────────────────────────────────────────────────────────────────────────────
// Site chrome (browser tab title + favicon). Kept separate from HOMEPAGE_QUERY
// because the root layout needs it on EVERY route — including /studio — and has
// no use for the rest of the homepage payload. `cache()` dedupes it so a single
// render pass hits Sanity once, not once per consumer (layout + manifest).
export type SiteSettings = Pick<HomepageSettings, "siteTitle" | "siteFavicon">

export const SITE_QUERY = `*[_type == "homepageSettings"][0]{ siteTitle, siteFavicon }`

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    return await client.fetch(SITE_QUERY)
  } catch {
    return null
  }
})
