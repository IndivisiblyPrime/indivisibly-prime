import type { MetadataRoute } from "next"
import { urlFor } from "@/sanity/lib/image"
import { getSiteSettings } from "@/sanity/lib/homepage"

// Next emits this as /manifest.webmanifest and links it automatically.
// Android Chrome reads icons from HERE (not from <link rel="icon">) when the
// visitor installs the site or adds it to their home screen.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings()
  const name = settings?.siteTitle || "Jack Harvey"
  const favicon = settings?.siteFavicon

  const iconAt = (size: number) =>
    urlFor(favicon!).width(size).height(size).format("png").url()

  return {
    name,
    short_name: name,
    description: name,
    start_url: "/",
    display: "standalone",
    background_color: "#171009",
    theme_color: "#171009",
    icons: favicon
      ? [
          { src: iconAt(192), sizes: "192x192", type: "image/png" },
          { src: iconAt(512), sizes: "512x512", type: "image/png" },
        ]
      : // Fallback to the baked-in .ico so the manifest is never icon-less.
        [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  }
}
