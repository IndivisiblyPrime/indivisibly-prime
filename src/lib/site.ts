/**
 * Search & sharing — what Google, Bing and link previews (iMessage, Slack, LinkedIn)
 * read about the site. Nothing here renders visibly except the browser-tab title.
 *
 * The title and description live in code rather than in the Studio's `siteTitle` on
 * purpose: "Jack Harvey" alone named nothing Google could tell apart from every other
 * Jack Harvey, and was the description too. See "Search & sharing" in
 * docs/architecture.md.
 */
import type { HomepageSettings } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"

export const SITE_URL = "https://jackharvey.me"
export const SITE_NAME = "Jack Harvey"
export const SITE_TITLE = "Jack Harvey — Bonsai & The Greatest Wisdom of Zen"
export const SITE_DESCRIPTION =
  "Jack Harvey — builder, investor, seeker. Maker of Bonsai, a free meditation app, and The Greatest Wisdom of Zen, a book of 170 blank pages."

/** Homepage only — the site's name, and who it's about. `sameAs` is what ties this
 *  page to Jack's LinkedIn and Instagram as one person. */
export function homeJsonLd(settings: HomepageSettings) {
  const sameAs = [
    ...(settings.socialLinks ?? []).map((l) => l.url),
    settings.instagramUrl,
  ].filter((url, i, all): url is string => !!url && all.indexOf(url) === i)

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: SITE_URL,
      mainEntity: {
        "@type": "Person",
        name: SITE_NAME,
        url: SITE_URL,
        description: settings.aboutTagline?.trim() || undefined,
        image: settings.aboutImage ? urlFor(settings.aboutImage).width(800).url() : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
      },
    },
  ]
}
