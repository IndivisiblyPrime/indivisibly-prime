import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

type AboutPhoto = SanityImageSource & { alt?: string }

interface AboutSectionProps {
  photo?: AboutPhoto
  text?: string
}

export function AboutSection({ photo, text }: AboutSectionProps) {
  const hasContent = photo || text

  if (!hasContent) {
    return (
      <section
        id="about"
        className="flex min-h-screen items-center justify-center bg-white"
      >
        <div className="text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            About Me
          </h2>
          <p className="text-neutral-500">Add your photo and bio in Sanity Studio</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="about"
      className="flex min-h-screen items-center justify-center bg-white px-4 py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        {/* Photo */}
        <div className="flex justify-center">
          {photo ? (
            <img
              src={urlFor(photo).width(500).height(500).url()}
              alt={photo.alt || "Profile photo"}
              className="h-auto w-full max-w-md rounded-2xl object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-80 w-80 items-center justify-center rounded-2xl bg-neutral-200">
              <span className="text-neutral-400">Photo placeholder</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            About Me
          </h2>
          {text ? (
            <p className="text-lg leading-relaxed text-neutral-600 md:text-xl">
              {text}
            </p>
          ) : (
            <p className="text-neutral-400">Add your bio in Sanity Studio</p>
          )}
        </div>
      </div>
    </section>
  )
}
