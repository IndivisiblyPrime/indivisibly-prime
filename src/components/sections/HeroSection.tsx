import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface HeroSectionProps {
  heroImage?: SanityImageSource
}

export function HeroSection({ heroImage }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blue-950"
    >
      {/* Background - either Sanity image or gradient fallback */}
      <div className="absolute inset-0">
        {heroImage ? (
          <>
            <img
              src={urlFor(heroImage).width(1920).height(1080).url()}
              alt=""
              className="h-full w-full rotate-180 object-cover"
            />
            <div className="absolute inset-0 bg-blue-950/40" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-blue-900 via-blue-950 to-blue-950" />
        )}
      </div>
      <div className="relative z-10 px-4 text-center">
        <h1 className="text-7xl font-bold uppercase tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] md:text-8xl lg:text-9xl">
          Jack Harvey
        </h1>
      </div>
    </section>
  )
}
