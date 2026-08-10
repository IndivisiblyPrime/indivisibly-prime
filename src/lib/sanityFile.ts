import { SanityFileAsset } from "@/lib/types"

/**
 * Sanity file asset → CDN URL.
 *
 * Asset refs look like `file-<id>-<ext>`, and unlike images there is no builder
 * for files, so the URL is assembled by hand. Used for the hero videos on
 * /classic and the App card's gong on both surfaces.
 */
export function sanityFileUrl(asset: SanityFileAsset | undefined): string | undefined {
  if (!asset?.asset?._ref) return undefined
  const parts = asset.asset._ref.split("-")
  const ext = parts[parts.length - 1]
  const id = parts.slice(1, parts.length - 1).join("-")
  return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}.${ext}`
}
