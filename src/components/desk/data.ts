// Shared config for the Desk homepage (web hotspots + phone scenes).

export type DeskId = "app" | "book" | "nft" | "about"
export type LabelPlace = "above" | "below" | "center"

export interface Hotspot {
  id: DeskId
  num: string
  word: string
  /** rect as % of the desk stage (calibrated to public/desk.png, 1672 × 941) */
  left: number
  top: number
  width: number
  height: number
  radius: string
  /** label anchor as % of the desk stage */
  labelX: number
  labelY: number
  labelPlace: LabelPlace
}

export const HOTSPOTS: Hotspot[] = [
  { id: "app", num: "1", word: "App", left: 13.9, top: 41.3, width: 11.1, height: 40.3, radius: "1.7rem", labelX: 19.4, labelY: 84, labelPlace: "below" },
  { id: "book", num: "2", word: "Book", left: 28.2, top: 27.3, width: 20.6, height: 58.6, radius: "0.4rem", labelX: 38.5, labelY: 88, labelPlace: "below" },
  { id: "nft", num: "3", word: "NFTs", left: 53.0, top: 9.4, width: 36.8, height: 36.6, radius: "0.5rem", labelX: 71.4, labelY: 8.5, labelPlace: "above" },
  // "About Me" sits centred on the lower half of the notebook — clear of the
  // "JACK HARVEY" embossing at ~53%, above the bottom stitching at ~90%.
  { id: "about", num: "", word: "About Me", left: 61.0, top: 47.0, width: 16.7, height: 46.5, radius: "0.5rem", labelX: 69.0, labelY: 72, labelPlace: "center" },
]

export interface PhoneScene {
  id: DeskId
  num: string
  word: string
  /** static scene image derived from desk.png (see public/desk-phone-*.png) */
  src: string
  /** tap target + white frame over JUST the object, as % of the scene image */
  object: { left: number; top: number; width: number; height: number }
}

export const PHONE_SCENES: PhoneScene[] = [
  { id: "app", num: "1", word: "App", src: "/desk-phone-app.png", object: { left: 23, top: 13, width: 55, height: 73 } },
  { id: "book", num: "2", word: "Book", src: "/desk-phone-book.png", object: { left: 10, top: 6, width: 80, height: 87 } },
  { id: "nft", num: "3", word: "NFTs", src: "/desk-phone-nft.png", object: { left: 3, top: 9, width: 93, height: 82 } },
  { id: "about", num: "", word: "About Me", src: "/desk-phone-about.png", object: { left: 16, top: 4, width: 68, height: 85 } },
]

// Fallback imagery cropped from the desk photo — shown until the matching
// Sanity fields are populated, so the site looks complete out of the box.
export const FALLBACK = {
  // Real Bonsai app screenshots (1170×2532), shown inside <PhoneFrame />.
  appScreens: [
    "/app-screens/01-bell-timer.webp",
    "/app-screens/02-session-preview.webp",
    "/app-screens/03-breathwork.webp",
    "/app-screens/04-journey.webp",
    "/app-screens/05-visual.webp",
    "/app-screens/06-timers.webp",
  ],
  bookCover: "/crops/book_cover.png",
  journal: "/crops/journal_left.png",
  nfts: [
    { src: "/crops/nft1_pillars.png", title: "Pillars of Dali", year: "2025" },
    { src: "/crops/nft2_wave.png", title: "The Great Wave off Saint-Rémy", year: "2025" },
    { src: "/crops/nft3_girl.png", title: "Girl with a Gold Earring", year: "2025" },
  ],
}
