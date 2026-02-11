export const revalidate = 60

import { client } from "@/sanity/lib/client"
import { HomepageSettings } from "@/lib/types"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { BookSection } from "@/components/sections/BookSection"
import { NFTSection } from "@/components/sections/NFTSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { Footer } from "@/components/sections/Footer"

async function getHomepageSettings(): Promise<HomepageSettings | null> {
  try {
    const query = `*[_type == "homepageSettings"][0]{
      heroImage,
      bookTitle,
      bookDescription,
      bookImage,
      nftGallery[]{
        _key,
        title,
        image,
        alt,
        year
      },
      aboutAccordion[]{
        _key,
        title,
        content
      },
      socialLinks[]{
        _key,
        platform,
        url
      },
      footerMarqueeItems
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
      <Navbar />
      <main>
        <HeroSection heroImage={settings?.heroImage} />
        <BookSection
          title={settings?.bookTitle || "Book"}
          description={settings?.bookDescription}
          bookImage={settings?.bookImage}
        />
        <NFTSection nfts={settings?.nftGallery || []} />
        <AboutSection
          accordionItems={settings?.aboutAccordion}
          socialLinks={settings?.socialLinks}
        />
      </main>
      <Footer marqueeItems={settings?.footerMarqueeItems} />
    </>
  )
}
