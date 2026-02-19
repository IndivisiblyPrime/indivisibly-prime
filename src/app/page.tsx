export const revalidate = 60

import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { HomepageSettings } from "@/lib/types"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { BookSection } from "@/components/sections/BookSection"
import { NFTSection } from "@/components/sections/NFTSection"
import { CTASection } from "@/components/sections/CTASection"
import { AboutSection } from "@/components/sections/AboutSection"
import { Footer } from "@/components/sections/Footer"

const HOMEPAGE_QUERY = `*[_type == "homepageSettings"][0]{
  siteTitle,
  siteFavicon,
  navItems[]{
    _key,
    label,
    target
  },
  heroImage,
  heroVideo,
  heroVideoUrl,
  bookTitle,
  bookDescription,
  bookImage,
  bookButtonText,
  bookButtonUrl,
  nftSectionTitle,
  nftSectionSubtitle,
  landscapeGallery[]{
    _key,
    title,
    image,
    alt,
    year,
    collection
  },
  nftGallery[]{
    _key,
    title,
    image,
    alt,
    year,
    collection
  },
  ctaButtonText,
  ctaButtonUrl,
  encryptedText,
  aboutAccordion[]{
    _key,
    title,
    content,
    showSocialLinks,
    itemType,
    experienceEntries[]{
      _key,
      logo,
      jobTitle,
      dateRange,
      company,
      bullets
    }
  },
  socialLinks[]{
    _key,
    platform,
    url
  },
  footerMarqueeItems[]{
    _key,
    text,
    icon
  }
}`

async function getHomepageSettings(): Promise<HomepageSettings | null> {
  try {
    return await client.fetch(HOMEPAGE_QUERY)
  } catch {
    return null
  }
}

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

  return (
    <>
      <Navbar navItems={settings?.navItems} />
      <main>
        <HeroSection
          heroImage={settings?.heroImage}
          heroVideo={settings?.heroVideo}
          heroVideoUrl={settings?.heroVideoUrl}
        />
        <BookSection
          title={settings?.bookTitle || "Book"}
          description={settings?.bookDescription}
          bookImage={settings?.bookImage}
          buttonText={settings?.bookButtonText}
          buttonUrl={settings?.bookButtonUrl}
        />
        <NFTSection
          nfts={settings?.nftGallery || []}
          title={settings?.nftSectionTitle}
          subtitle={settings?.nftSectionSubtitle}
          landscapeItems={settings?.landscapeGallery}
        />
        <CTASection
          buttonText={settings?.ctaButtonText}
          buttonUrl={settings?.ctaButtonUrl}
          encryptedText={settings?.encryptedText}
        />
        <AboutSection
          accordionItems={settings?.aboutAccordion}
          socialLinks={settings?.socialLinks}
        />
      </main>
      <Footer marqueeItems={settings?.footerMarqueeItems} />
    </>
  )
}
