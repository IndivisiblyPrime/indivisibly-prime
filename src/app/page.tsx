import { client } from "@/sanity/lib/client"
import { HomepageSettings } from "@/lib/types"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { BookSection } from "@/components/sections/BookSection"
import { NFTSection } from "@/components/sections/NFTSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"

async function getHomepageSettings(): Promise<HomepageSettings | null> {
  try {
    const query = `*[_type == "homepageSettings"][0]{
      bookTitle,
      bookDescription,
      nftGallery[]{
        _key,
        title,
        image,
        alt
      },
      aboutPhoto,
      aboutText,
      socialLinks[]{
        _key,
        platform,
        url
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
      <Navbar />
      <main>
        <HeroSection />
        <BookSection
          title={settings?.bookTitle || "Book"}
          description={settings?.bookDescription}
        />
        <NFTSection nfts={settings?.nftGallery || []} />
        <AboutSection
          photo={settings?.aboutPhoto}
          text={settings?.aboutText}
        />
        <ContactSection socialLinks={settings?.socialLinks} />
      </main>
      <Footer />
    </>
  )
}
