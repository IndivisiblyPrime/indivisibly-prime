import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

// One page: /desk is an alias of / and /classic is a preserved old version, so
// neither is listed (both point search engines back at / — see their metadata).
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL }]
}
