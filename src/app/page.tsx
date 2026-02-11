export const revalidate = 60

import { client } from "@/sanity/lib/client"
import { HomepageSettings } from "@/lib/types"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { BookSection } from "@/components/sections/BookSection"
import { NFTSection } from "@/components/sections/NFTSection"
import { CTASection } from "@/components/sections/CTASection"
import { AboutSection } from "@/components/sections/AboutSection"
import { Footer } from "@/components/sections/Footer"

async function getHomepageSettings(): Promise<HomepageSettings | null> {
  try {
    const query = `*[_type == "homepageSettings"][0]{
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
        showSocialLinks
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
    return await client.fetch(query)
  } catch {
    return null
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
        <NFTSection nfts={settings?.nftGallery || []} />
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
