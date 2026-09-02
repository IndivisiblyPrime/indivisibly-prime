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
 *
 * `segs` is the fillet's point count. It's generous because the App attract
 * outline is drawn as a thick stroke, and a coarse fillet shows up there as
 * visible facets — the corners read as pointy rather than round.
 *
 * `w`/`h` are the source image's pixel dimensions — they default to desk.png
 * so every existing web caller is unaffected, and the mobile photo (a very
 * different aspect) passes its own.
 */
export function roundedOutline(corners: Pt[], r: number, segs = 14, w = IMG_W, h = IMG_H): Pt[] {
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
  return out.map(([x, y]) => [(x / w) * 100, (y / h) * 100])
}

export function bbox(corners: Pt[], w = IMG_W, h = IMG_H) {
  const xs = corners.map((c) => c[0])
  const ys = corners.map((c) => c[1])
  const x0 = Math.min(...xs)
  const y0 = Math.min(...ys)
  return {
    left: (x0 / w) * 100,
    top: (y0 / h) * 100,
    width: ((Math.max(...xs) - x0) / w) * 100,
    height: ((Math.max(...ys) - y0) / h) * 100,
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

/**
 * Same outline in desk.png pixel space, for an SVG using `viewBox="0 0 1672
 * 941"`. That viewBox matches the stage's aspect exactly, so it scales
 * *uniformly* — unlike the 0–100 viewBox, which needs
 * `preserveAspectRatio="none"` and therefore stretches x and y differently.
 * Anything stroked has to live here: under non-uniform scaling a stroke gets
 * fatter on one axis, and dash lengths stop agreeing with `getTotalLength()`.
 */
export const toPathPx = (o: Pt[]) =>
  `M${o.map(([x, y]) => `${((x / 100) * IMG_W).toFixed(1)} ${((y / 100) * IMG_H).toFixed(1)}`).join("L")}Z`

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

/* ── Mobile desk ──────────────────────────────────────────────────────────
 * public/desk-mobile.png is its own photo at its own aspect (724×2172), so it
 * gets its own calibrated geometry rather than reusing the web corners. Same
 * shape of data, same tool workflow — see /calibrate-mobile.
 */

import mobileGeometry from "./hotspots-mobile.json"

/** Native size of public/desk-mobile.png — all mobile corner coords are px in it. */
export const MOBILE_IMG_W = 724
export const MOBILE_IMG_H = 2172

export const MOBILE_GEOMETRY = mobileGeometry as unknown as Record<DeskId, HotspotGeometry>

export const MOBILE_HOTSPOTS: Hotspot[] = CONTENT.map((c) => {
  const g = MOBILE_GEOMETRY[c.id]
  return {
    ...c,
    ...g,
    ...bbox(g.corners, MOBILE_IMG_W, MOBILE_IMG_H),
    outline: roundedOutline(g.corners, g.cornerRadius, 14, MOBILE_IMG_W, MOBILE_IMG_H),
  }
})

/**
 * Mobile outline in desk-mobile.png pixel space, for an SVG using
 * `viewBox="0 0 724 2172"`. Same reasoning as `toPathPx` on the web desk:
 * anything *stroked* needs the pixel viewBox so it scales uniformly, or the
 * stroke fattens on one axis and dash lengths stop agreeing with
 * getTotalLength().
 */
export const toPathPxMobile = (o: Pt[]) =>
  `M${o
    .map(([x, y]) => `${((x / 100) * MOBILE_IMG_W).toFixed(1)} ${((y / 100) * MOBILE_IMG_H).toFixed(1)}`)
    .join("L")}Z`

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
