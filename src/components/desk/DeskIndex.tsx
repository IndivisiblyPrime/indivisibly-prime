import { HomepageSettings } from "@/lib/types"
import { DEFAULT_DESC as APP_DEFAULT_DESC } from "./cards/AppCard"
import { DEFAULT_DESC as BOOK_DEFAULT_DESC } from "./cards/BookCard"

/**
 * A visually hidden summary of what's on the desk: the App, Book and About cards'
 * headline, blurb and links, with the same Studio fields and fallbacks the cards use.
 *
 * Why it exists: the cards only mount after a click, and search engines never click,
 * so without this the page links nowhere: not to breathebonsai.com, not to
 * thegreatestwisdomofzen.com, not to LinkedIn. Screen readers get the summary too.
 *
 * The links are out of the Tab order (`tabIndex={-1}`) because they're invisible:
 * keyboard users already reach every card through the desk's own hotspots, and
 * invisible focus stops would just look like Tab doing nothing. Screen readers still
 * read and follow them.
 */
export function DeskIndex({ settings }: { settings: HomepageSettings }) {
  const name = settings.entryTitle || "Jack Harvey"
  const linkedin = settings.socialLinks?.find((l) => l.platform === "linkedin")?.url
  const instagram = settings.socialLinks?.find((l) => l.platform === "instagram")?.url || settings.instagramUrl

  const links = (items: [string | undefined, string][]) => (
    <ul>
      {items
        .filter((item): item is [string, string] => !!item[0])
        .map(([href, label]) => (
          <li key={href}>
            <a href={href} tabIndex={-1}>
              {label}
            </a>
          </li>
        ))}
    </ul>
  )

  return (
    <section className="sr-only" aria-label="On the desk">
      <h2>{settings.appTitle || "Bonsai"}</h2>
      <p>{settings.appSubtitle || APP_DEFAULT_DESC}</p>
      {links([
        [settings.appWebsiteButtonUrl, `${settings.appTitle || "Bonsai"} website`],
        [settings.appButtonUrl, settings.appButtonText || "Download Now"],
      ])}

      <h2>{settings.bookTitle || "The Greatest Wisdom of Zen"}</h2>
      <p>{settings.bookDescription || BOOK_DEFAULT_DESC}</p>
      {links([
        [settings.bookWebsiteButtonUrl, `${settings.bookTitle || "The Greatest Wisdom of Zen"} website`],
        [settings.bookButtonUrl, settings.bookButtonText || "More Details / Buy"],
      ])}

      <h2>About {name}</h2>
      <p>{settings.aboutTagline?.trim() || "Builder · Investor · Lifelong Meditator"}</p>
      {links([
        [linkedin, "LinkedIn"],
        [instagram, "Instagram"],
      ])}
    </section>
  )
}
