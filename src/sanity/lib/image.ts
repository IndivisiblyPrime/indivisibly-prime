import createImageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'
import { client } from './client'

const imageBuilder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}
