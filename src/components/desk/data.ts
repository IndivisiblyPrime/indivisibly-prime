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
  { id: "app", num: "1", word: "App", left: 9.2, top: 40.8, width: 10.8, height: 44.6, radius: "1.7rem", labelX: 14.6, labelY: 88, labelPlace: "below" },
  { id: "book", num: "2", word: "Book", left: 24.0, top: 25.6, width: 20.6, height: 61.2, radius: "0.4rem", labelX: 34.4, labelY: 89, labelPlace: "below" },
  { id: "nft", num: "3", word: "NFTs", left: 52.0, top: 10.8, width: 36.0, height: 33.0, radius: "0.5rem", labelX: 70.0, labelY: 7.2, labelPlace: "above" },
  { id: "about", num: "", word: "About Me", left: 50.5, top: 45.4, width: 39.5, height: 51.0, radius: "0.5rem", labelX: 70.3, labelY: 47, labelPlace: "center" },
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
  { id: "app", num: "1", word: "App", src: "/desk-phone-app.png", object: { left: 27, top: 8, width: 47, height: 74 } },
  { id: "book", num: "2", word: "Book", src: "/desk-phone-book.png", object: { left: 12, top: 5, width: 77, height: 87 } },
  { id: "nft", num: "3", word: "NFTs", src: "/desk-phone-nft.png", object: { left: 2, top: 7, width: 95, height: 80 } },
  { id: "about", num: "", word: "About Me", src: "/desk-phone-about.png", object: { left: 2, top: 3, width: 95, height: 93 } },
]

// Fallback imagery cropped from the desk photo — shown until the matching
// Sanity fields are populated, so the site looks complete out of the box.
export const FALLBACK = {
  appScreens: ["/crops/phone_screen.png"],
  bookCover: "/crops/book_cover.png",
  journal: "/crops/journal_left.png",
  nfts: [
    { src: "/crops/nft1_pillars.png", title: "Pillars of Dali", year: "2025" },
    { src: "/crops/nft2_wave.png", title: "The Great Wave off Saint-Rémy", year: "2025" },
    { src: "/crops/nft3_girl.png", title: "Girl with a Gold Earring", year: "2025" },
  ],
}
