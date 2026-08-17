// Shared config for the Desk homepage (web hotspots + phone scenes).

export type DeskId = "app" | "book" | "nft" | "about"
export type LabelPlace = "above" | "below" | "center"

import geometry from "./hotspots.json"

/** Native size of public/desk.png — all corner coords are pixels in it. */
export const IMG_W = 1672
export const IMG_H = 941

export type Pt = [number, number]

/** One object's calibrated geometry, as stored in hotspots.json. */
export interface HotspotGeometry {
  /** outline corners in desk.png pixels, clockwise from top-left */
  corners: Pt[]
  /** corner fillet in those same pixels (bezel curve, frame moulding, …) */
  cornerRadius: number
  /** label anchor as % of the desk stage */
  labelX: number
  labelY: number
  labelPlace: LabelPlace
}

export interface Hotspot extends HotspotGeometry {
  id: DeskId
  num: string
  word: string
  /** bounding box of `corners` as % of the stage */
  left: number
  top: number
  width: number
  height: number
  /** rounded outline as %-of-stage points — spotlight clip, dim mask, hit area */
  outline: Pt[]
}

// Content lives here; geometry lives in hotspots.json, written by /calibrate.
const CONTENT: { id: DeskId; num: string; word: string }[] = [
  { id: "app", num: "1", word: "App" },
  { id: "book", num: "2", word: "Book" },
  { id: "nft", num: "3", word: "NFTs" },
  { id: "about", num: "", word: "About Me" },
]

export const GEOMETRY = geometry as unknown as Record<DeskId, HotspotGeometry>

/**
 * Round the polygon's corners: replace each corner with a small Bézier fillet
 * (computed in pixel space, where arcs stay circular despite the non-square
 * image), then convert to % of the stage. Rendered via clip-path/SVG in
 * DeskStageWeb, so the highlight scales fluidly with the stage.
 */
export function roundedOutline(corners: Pt[], r: number, segs = 4): Pt[] {
  const n = corners.length
  const out: Pt[] = []
  for (let i = 0; i < n; i++) {
    const [px, py] = corners[i]
    const [ax, ay] = corners[(i + n - 1) % n]
    const [bx, by] = corners[(i + 1) % n]
    const la = Math.hypot(ax - px, ay - py)
    const lb = Math.hypot(bx - px, by - py)
    const rr = Math.min(r, la / 2, lb / 2)
    const t1: Pt = [px + ((ax - px) / la) * rr, py + ((ay - py) / la) * rr]
    const t2: Pt = [px + ((bx - px) / lb) * rr, py + ((by - py) / lb) * rr]
    for (let s = 0; s <= segs; s++) {
      const t = s / segs
      const u = 1 - t
      out.push([u * u * t1[0] + 2 * u * t * px + t * t * t2[0], u * u * t1[1] + 2 * u * t * py + t * t * t2[1]])
    }
  }
  return out.map(([x, y]) => [(x / IMG_W) * 100, (y / IMG_H) * 100])
}

export function bbox(corners: Pt[]) {
  const xs = corners.map((c) => c[0])
  const ys = corners.map((c) => c[1])
  const x0 = Math.min(...xs)
  const y0 = Math.min(...ys)
  return {
    left: (x0 / IMG_W) * 100,
    top: (y0 / IMG_H) * 100,
    width: ((Math.max(...xs) - x0) / IMG_W) * 100,
    height: ((Math.max(...ys) - y0) / IMG_H) * 100,
  }
}

/**
 * Outlines are %-of-stage points, so both renderings scale fluidly with the
 * stage: clip-path takes % directly, and an SVG stretches its 0–100 viewBox
 * over the stage via preserveAspectRatio="none".
 */
export const toClip = (o: Pt[]) =>
  `polygon(${o.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})`
export const toPath = (o: Pt[]) =>
  `M${o.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`

export const HOTSPOTS: Hotspot[] = CONTENT.map((c) => {
  const g = GEOMETRY[c.id]
  return {
    ...c,
    ...g,
    ...bbox(g.corners),
    outline: roundedOutline(g.corners, g.cornerRadius),
  }
})

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
