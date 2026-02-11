"use client"

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface BookSectionProps {
  title: string
  description?: string
  bookImage?: SanityImageSource
}

export function BookSection({ title, description, bookImage }: BookSectionProps) {
  return (
    <section
      id="book"
      className="flex min-h-screen items-center justify-center bg-blue-950 px-4 py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        {/* Book Image */}
        <div className="flex justify-center">
          {bookImage ? (
            <img
              src={urlFor(bookImage).width(400).height(600).url()}
              alt={title}
              className="h-auto w-full max-w-sm rounded-lg shadow-2xl"
            />
          ) : (
            <div className="flex h-96 w-64 items-center justify-center rounded-lg bg-blue-900">
              <span className="text-blue-400">Book cover</span>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="text-center md:text-left">
          <h2 className="mb-8 text-5xl font-bold tracking-tight text-white md:text-6xl">
            {title}
          </h2>
          {description && (
            <p className="mb-8 text-lg leading-relaxed text-blue-200 md:text-xl">
              {description}
            </p>
          )}
          <button
            className="rounded-md bg-white px-8 py-2 font-light text-[#696969] shadow-[0_4px_14px_0_rgb(0,0,0,10%)] transition duration-200 hover:shadow-[0_6px_20px_rgba(93,93,93,23%)]"
          >
            View More Details
          </button>
        </div>
      </div>
    </section>
  )
}
