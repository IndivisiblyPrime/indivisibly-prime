import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

/**
 * Dev-only sink for the /calibrate tool: overwrites hotspots.json with the
 * corners Jack clicked. 404s in production — this writes to the source tree,
 * so it must never exist on a deployed site.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 })
  }

  const body = await req.json()
  const ids = ["app", "book", "nft", "about"] as const

  // Validate before touching the file — a bad write breaks the homepage build.
  for (const id of ids) {
    const g = body?.[id]
    if (!g || !Array.isArray(g.corners) || g.corners.length < 3) {
      return NextResponse.json({ error: `${id}: needs at least 3 corners` }, { status: 400 })
    }
    for (const c of g.corners) {
      if (!Array.isArray(c) || c.length !== 2 || c.some((n: unknown) => typeof n !== "number" || !isFinite(n))) {
        return NextResponse.json({ error: `${id}: corner must be [x, y] numbers` }, { status: 400 })
      }
    }
    if (typeof g.cornerRadius !== "number" || typeof g.labelX !== "number" || typeof g.labelY !== "number") {
      return NextResponse.json({ error: `${id}: cornerRadius / labelX / labelY must be numbers` }, { status: 400 })
    }
  }

  // Hand-rolled so each corner stays on one line — JSON.stringify would explode
  // every [x, y] pair across three, making the diffs unreadable.
  const comment =
    "Desk hotspot geometry — EDIT WITH THE TOOL, NOT BY HAND. Run `npm run dev` and open /calibrate to click each object's corners on the photo; Save writes this file. Coordinates are pixels in public/desk.png (1672x941), corners clockwise from top-left. cornerRadius is the fillet in those same pixels. label x/y are % of the stage."
  const blocks = ids.map((id) => {
    const g = body[id]
    const corners = g.corners
      .map((c: [number, number]) => `[${Math.round(c[0])}, ${Math.round(c[1])}]`)
      .join(", ")
    const place = g.labelPlace === "above" || g.labelPlace === "center" ? g.labelPlace : "below"
    return [
      `  ${JSON.stringify(id)}: {`,
      `    "corners": [${corners}],`,
      `    "cornerRadius": ${Math.round(g.cornerRadius)},`,
      `    "labelX": ${Math.round(g.labelX * 10) / 10},`,
      `    "labelY": ${Math.round(g.labelY * 10) / 10},`,
      `    "labelPlace": ${JSON.stringify(place)}`,
      `  }`,
    ].join("\n")
  })
  const text = `{\n  "_comment": ${JSON.stringify(comment)},\n${blocks.join(",\n")}\n}\n`

  const file = path.join(process.cwd(), "src/components/desk/hotspots.json")
  await writeFile(file, text, "utf8")
  return NextResponse.json({ ok: true, file: "src/components/desk/hotspots.json" })
}
