// Shared config for the Desk homepage (web hotspots + phone scenes).

export type DeskId = "app" | "book" | "nft" | "about"
export type LabelPlace = "above" | "below" | "center"

/** Native size of public/desk.png — all corner coords below are pixels in it. */
const IMG_W = 1672
const IMG_H = 941

type Pt = [number, number]

interface HotspotDef {
  id: DeskId
  num: string
  word: string
  /**
   * The object's photographed outline as corners in desk.png pixels, clockwise
   * from top-left. Usually 4 points; the book carries a 5th (an elbow where the
   * pages' fore-edge steps out past the cover's top-right corner). Re-measure
   * these whenever the photo changes — see CLAUDE.md.
   */
  corners: Pt[]
  /** corner rounding in desk.png pixels (bezel curve, frame moulding, …) */
  cornerRadius: number
  /** border-radius for the attract pulse + click target (drawn on the bbox) */
  radius: string
  /** label anchor as % of the desk stage */
  labelX: number
  labelY: number
  labelPlace: LabelPlace
}

export interface Hotspot extends HotspotDef {
  /** bounding box of `corners` as % of the stage — click/hover target + pulse */
  left: number
  top: number
  width: number
  height: number
  /** rounded outline as %-of-stage points — spotlight clip, dim mask, ring */
  outline: Pt[]
}

// Corners traced to the physical objects (bezel edge, spine-to-pages hull,
// frame moulding, notebook leather + the pen leaning on its right edge), so
// the spotlight hugs each object's true, slightly perspective-skewed shape.
const DEFS: HotspotDef[] = [
  { id: "app", num: "1", word: "App", corners: [[242, 399], [410, 399], [409, 753], [241, 753]], cornerRadius: 33, radius: "1.7rem", labelX: 19.5, labelY: 82.5, labelPlace: "below" },
  { id: "book", num: "2", word: "Book", corners: [[468, 266], [799, 265], [812, 330], [811, 809], [468, 810]], cornerRadius: 10, radius: "0.4rem", labelX: 38.3, labelY: 88, labelPlace: "below" },
  { id: "nft", num: "3", word: "NFTs", corners: [[891, 122], [1500, 112], [1500, 398], [893, 404]], cornerRadius: 8, radius: "0.5rem", labelX: 71.5, labelY: 11, labelPlace: "above" },
  { id: "about", num: "", word: "About Me", corners: [[1020, 443], [1314, 441], [1314, 877], [1020, 879]], cornerRadius: 20, radius: "0.5rem", labelX: 69.8, labelY: 95.2, labelPlace: "below" },
]

/**
 * Round the polygon's corners: replace each corner with a small Bézier fillet
 * (computed in pixel space, where arcs stay circular despite the non-square
 * image), then convert to % of the stage. Rendered via clip-path/SVG in
 * DeskStageWeb, so the highlight scales fluidly with the stage.
 */
function roundedOutline(corners: Pt[], r: number, segs = 4): Pt[] {
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

function bbox(corners: Pt[]) {
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

export const HOTSPOTS: Hotspot[] = DEFS.map((d) => ({
  ...d,
  ...bbox(d.corners),
  outline: roundedOutline(d.corners, d.cornerRadius),
}))

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
