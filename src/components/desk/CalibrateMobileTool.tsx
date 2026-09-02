/* eslint-disable @next/next/no-img-element */
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  MOBILE_GEOMETRY,
  MOBILE_IMG_W,
  MOBILE_IMG_H,
  bbox,
  roundedOutline,
  toClip,
  toPath,
  type DeskId,
  type HotspotGeometry,
  type LabelPlace,
  type Pt,
} from "./data"

const OBJECTS: { id: DeskId; label: string }[] = [
  { id: "app", label: "1 · App" },
  { id: "book", label: "2 · Book" },
  { id: "nft", label: "3 · NFTs" },
  { id: "about", label: "About Me" },
]

const COLORS: Record<DeskId, string> = {
  app: "#ff5a5a",
  book: "#4ade80",
  nft: "#60a5fa",
  about: "#fbbf24",
}

const LOUPE = 260 // px on screen
const ZOOM = 9 // image px -> screen px inside the loupe

type Geo = Record<DeskId, HotspotGeometry>

const clone = (g: Geo): Geo => JSON.parse(JSON.stringify(g))

const FILE_COMMENT =
  "MOBILE desk hotspot geometry — EDIT WITH THE TOOL, NOT BY HAND. Run `npm run dev` and open /calibrate-mobile to click each object's corners on the photo; Save writes this file. Coordinates are pixels in public/desk-mobile.png (724x2172), corners clockwise from top-left. cornerRadius is the fillet in those same pixels. label x/y are % of the stage."

/**
 * Render the geometry exactly as /api/calibrate-mobile writes it, so the text
 * you copy from the deployed tool is byte-identical to what a local Save
 * produces — paste it straight into hotspots-mobile.json.
 *
 * Iterates the KNOWN ids on purpose. Doing this over `Object.keys(geo)` is how
 * the web version once crashed in production: the JSON also carries `_comment`,
 * a string with no `.corners` to map over.
 */
function serialise(geo: Geo): string {
  const blocks = OBJECTS.map(({ id }) => {
    const g = geo[id]
    const corners = g.corners.map((c) => `[${Math.round(c[0])}, ${Math.round(c[1])}]`).join(", ")
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
  return `{\n  "_comment": ${JSON.stringify(FILE_COMMENT)},\n${blocks.join(",\n")}\n}\n`
}

/**
 * Mobile twin of CalibrateTool. Same interaction model (click corners, drag to
 * adjust, 9× loupe, arrow-key nudge, ⌘S to save), but laid out for a 1:3 photo:
 * the stage scrolls in its own column beside sticky controls, instead of
 * sitting full-width above them.
 *
 * `writable` is false on the deployed site: Vercel's filesystem is read-only,
 * so there is no Save to offer — the tool exports the JSON instead and the
 * result reaches the site through a commit, which is the same last step a local
 * Save needs anyway.
 */
export function CalibrateMobileTool({ writable = true }: { writable?: boolean }) {
  const [geo, setGeo] = useState<Geo>(() => clone(MOBILE_GEOMETRY))
  const [active, setActive] = useState<DeskId>("app")
  const [sel, setSel] = useState<number | null>(null)
  const [drag, setDrag] = useState<{ kind: "corner"; i: number } | { kind: "label" } | null>(null)
  const [cursor, setCursor] = useState<Pt | null>(null)
  const [preview, setPreview] = useState(false)
  const [stageW, setStageW] = useState(420)
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "busy"; msg: string } | null>(null)
  const [history, setHistory] = useState<Geo[]>([])
  // Last state written to disk, so the header can show unsaved-changes at a glance.
  const [saved, setSaved] = useState<string>(() => JSON.stringify(MOBILE_GEOMETRY))
  const dirty = JSON.stringify(geo) !== saved

  const stageRef = useRef<HTMLDivElement>(null)
  const g = geo[active]

  /** mouse event -> desk-mobile.png pixel coords */
  const toImage = useCallback((e: { clientX: number; clientY: number }): Pt => {
    const r = stageRef.current!.getBoundingClientRect()
    return [
      ((e.clientX - r.left) / r.width) * MOBILE_IMG_W,
      ((e.clientY - r.top) / r.height) * MOBILE_IMG_H,
    ]
  }, [])

  const push = useCallback(() => setHistory((h) => [...h.slice(-40), clone(geo)]), [geo])

  const update = useCallback((id: DeskId, patch: Partial<HotspotGeometry>) => {
    setGeo((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }, [])

  const onStageDown = (e: React.MouseEvent) => {
    const p = toImage(e)
    // Grab the nearest corner within a screen-constant radius, else add a point.
    // The threshold scales with the display size so it stays ~12 screen px
    // whatever zoom the stage is at.
    const grabPx = 12 * (MOBILE_IMG_W / stageW)
    let best = -1
    let bestD = grabPx
    g.corners.forEach((c, i) => {
      const d = Math.hypot(c[0] - p[0], c[1] - p[1])
      if (d < bestD) { bestD = d; best = i }
    })
    push()
    if (best >= 0) {
      setSel(best)
      setDrag({ kind: "corner", i: best })
      return
    }
    // NB: the label is deliberately NOT grabbable from here — it has its own
    // handle. Catching it by proximity meant a click meant for a corner near
    // the label silently dragged the label instead.
    // Insert the new point on the nearest edge, so clicking corners in any
    // order still builds a sane polygon.
    const corners = g.corners
    let at = corners.length
    let bestSeg = Infinity
    for (let i = 0; i < corners.length; i++) {
      const a = corners[i]
      const b = corners[(i + 1) % corners.length]
      const abx = b[0] - a[0], aby = b[1] - a[1]
      const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby) / (abx * abx + aby * aby || 1)))
      const d = Math.hypot(a[0] + abx * t - p[0], a[1] + aby * t - p[1])
      if (d < bestSeg) { bestSeg = d; at = i + 1 }
    }
    const next = [...corners]
    next.splice(at, 0, [Math.round(p[0]), Math.round(p[1])])
    update(active, { corners: next })
    setSel(at)
    setDrag({ kind: "corner", i: at })
  }

  useEffect(() => {
    if (!drag) return
    const move = (e: MouseEvent) => {
      const p = toImage(e)
      setCursor(p)
      if (drag.kind === "corner") {
        const next = [...geo[active].corners]
        next[drag.i] = [Math.round(p[0]), Math.round(p[1])]
        update(active, { corners: next })
      } else {
        update(active, { labelX: (p[0] / MOBILE_IMG_W) * 100, labelY: (p[1] / MOBILE_IMG_H) * 100 })
      }
    }
    const up = () => setDrag(null)
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up) }
  }, [drag, active, geo, toImage, update])

  // Arrow keys nudge the selected corner — 1px, or 10px with Shift.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sel == null) return
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]
      if (!d) return
      e.preventDefault()
      const step = e.shiftKey ? 10 : 1
      const next = [...geo[active].corners]
      next[sel] = [next[sel][0] + d[0] * step, next[sel][1] + d[1] * step]
      update(active, { corners: next })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sel, active, geo, update])

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h
      setGeo(h[h.length - 1])
      return h.slice(0, -1)
    })
  }

  const deletePoint = () => {
    if (sel == null || g.corners.length <= 3) return
    push()
    update(active, { corners: g.corners.filter((_, i) => i !== sel) })
    setSel(null)
  }

  const copyJson = useCallback(async () => {
    const text = serialise(geo)
    try {
      await navigator.clipboard.writeText(text)
      setSaved(JSON.stringify(geo))
      setStatus({ kind: "ok", msg: "Copied ✓  paste it into the chat" })
    } catch {
      setStatus({ kind: "err", msg: "Clipboard blocked — use Download instead" })
    }
    setTimeout(() => setStatus(null), 5000)
  }, [geo])

  const downloadJson = useCallback(() => {
    const blob = new Blob([serialise(geo)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "hotspots-mobile.json"
    a.click()
    URL.revokeObjectURL(url)
    setSaved(JSON.stringify(geo))
    setStatus({ kind: "ok", msg: "Downloaded ✓  hotspots-mobile.json" })
    setTimeout(() => setStatus(null), 5000)
  }, [geo])

  const save = useCallback(async () => {
    // On the deployed site there is nothing to POST to — export instead.
    if (!writable) return copyJson()
    const body = JSON.stringify(geo)
    setStatus({ kind: "busy", msg: "Saving…" })
    try {
      const res = await fetch("/api/calibrate-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        setSaved(body)
        setStatus({ kind: "ok", msg: "Saved ✓  hotspots-mobile.json written" })
      } else {
        setStatus({ kind: "err", msg: `Failed: ${json.error ?? res.status}` })
      }
    } catch (e) {
      setStatus({ kind: "err", msg: `Failed: ${(e as Error).message}` })
    }
    setTimeout(() => setStatus(null), 5000)
  }, [geo, writable, copyJson])

  // ⌘S / Ctrl+S saves (or copies, when read-only) without reaching for the button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        void save()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [save])

  const outlines = OBJECTS.map((o) => ({
    id: o.id,
    outline: roundedOutline(geo[o.id].corners, geo[o.id].cornerRadius, 14, MOBILE_IMG_W, MOBILE_IMG_H),
  }))
  const activeOutline = outlines.find((o) => o.id === active)!.outline
  const box = bbox(g.corners, MOBILE_IMG_W, MOBILE_IMG_H)

  return (
    <div className="min-h-dvh bg-neutral-950 p-4 text-neutral-200">
      <div className="mx-auto flex max-w-[1500px] gap-6">
        {/* Stage column — the photo is 1:3, so it scrolls rather than shrinking
            to illegibility. */}
        <div className="shrink-0">
          <div
            ref={stageRef}
            onMouseDown={onStageDown}
            onMouseMove={(e) => setCursor(toImage(e))}
            onMouseLeave={() => setCursor(null)}
            className="relative cursor-crosshair select-none overflow-hidden rounded"
            style={{ width: stageW, aspectRatio: `${MOBILE_IMG_W} / ${MOBILE_IMG_H}` }}
          >
            <img src="/desk-mobile.png" alt="" className="absolute inset-0 h-full w-full" draggable={false} />

            {preview && (
              <>
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={`M0 0H100V100H0Z ${toPath(activeOutline)}`} fill="rgba(0,0,0,0.28)" fillRule="evenodd" />
                </svg>
                <img
                  src="/desk-mobile.png"
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  style={{ clipPath: toClip(activeOutline), filter: "brightness(1.16) saturate(1.06)" }}
                  draggable={false}
                />
              </>
            )}

            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {outlines.map((o) => (
                <path
                  key={o.id}
                  d={toPath(o.outline)}
                  fill="none"
                  stroke={COLORS[o.id]}
                  strokeWidth={o.id === active ? 2 : 1}
                  strokeOpacity={o.id === active ? 1 : 0.35}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {/* corner handles */}
            {g.corners.map((c, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-full border-2"
                style={{
                  left: `${(c[0] / MOBILE_IMG_W) * 100}%`,
                  top: `${(c[1] / MOBILE_IMG_H) * 100}%`,
                  width: 13,
                  height: 13,
                  transform: "translate(-50%, -50%)",
                  borderColor: COLORS[active],
                  background: sel === i ? COLORS[active] : "rgba(0,0,0,0.55)",
                }}
              />
            ))}

            {/* Label preview + handle. Shows the real word at the real anchor so
                placement is judged on the actual thing, not an abstract dot.
                Its own hit target, so it moves only when grabbed directly. */}
            <div
              onMouseDown={(e) => { e.stopPropagation(); push(); setDrag({ kind: "label" }) }}
              title="Drag to move this object's label"
              className="absolute cursor-move whitespace-nowrap"
              style={{
                left: `${g.labelX}%`,
                top: `${g.labelY}%`,
                transform:
                  g.labelPlace === "above"
                    ? "translate(-50%, -100%)"
                    : g.labelPlace === "below"
                    ? "translate(-50%, 0)"
                    : "translate(-50%, -50%)",
              }}
            >
              <span
                className="inline-flex items-baseline gap-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.85)" }}
              >
                <span style={{ color: COLORS[active] }}>◆</span>
                {OBJECTS.find((o) => o.id === active)!.label}
              </span>
            </div>
          </div>
        </div>

        {/* Controls — sticky so they stay reachable while the tall stage scrolls. */}
        <div className="sticky top-4 h-fit min-w-[340px] flex-1">
          <h1 className="mb-3 text-lg font-medium text-white">Mobile desk hotspot calibration</h1>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {OBJECTS.map((o) => (
              <button
                key={o.id}
                onClick={() => { setActive(o.id); setSel(null) }}
                className="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  background: active === o.id ? COLORS[o.id] : "#27272a",
                  color: active === o.id ? "#000" : "#d4d4d8",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm">
              <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} />
              Preview spotlight
            </label>
            <button onClick={undo} disabled={!history.length} className="rounded bg-neutral-800 px-3 py-1.5 text-sm disabled:opacity-40">
              Undo
            </button>
            {writable ? (
              <button
                onClick={save}
                className={`rounded px-4 py-1.5 text-sm font-semibold ${dirty ? "bg-white text-black" : "bg-neutral-700 text-neutral-300"}`}
              >
                Save <span className="opacity-50">⌘S</span>
              </button>
            ) : (
              <>
                <button
                  onClick={copyJson}
                  className={`rounded px-4 py-1.5 text-sm font-semibold ${dirty ? "bg-white text-black" : "bg-neutral-700 text-neutral-300"}`}
                >
                  Copy JSON <span className="opacity-50">⌘S</span>
                </button>
                <button onClick={downloadJson} className="rounded bg-neutral-800 px-3 py-1.5 text-sm">
                  Download
                </button>
              </>
            )}
            {status ? (
              <span
                className={`rounded px-2.5 py-1.5 text-sm font-medium ${
                  status.kind === "ok"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : status.kind === "err"
                    ? "bg-red-500/15 text-red-300"
                    : "bg-neutral-700 text-neutral-200"
                }`}
              >
                {status.msg}
              </span>
            ) : (
              <span className={`text-sm ${dirty ? "text-amber-400" : "text-neutral-500"}`}>
                {dirty ? "● unsaved changes" : "all changes saved"}
              </span>
            )}
          </div>

          <p className="mb-4 text-xs leading-relaxed text-neutral-400">
            Click the object&rsquo;s corners on the photo (any order — points insert on the nearest edge). Drag a corner
            to move it; the loupe magnifies {ZOOM}× so you can land on the exact pixel. Arrow keys nudge the selected
            corner 1px, Shift+arrow 10px. Drag the <strong className="text-neutral-300">label text</strong> itself to
            reposition it.{" "}
            {writable ? (
              <>
                <strong className="text-neutral-300">Save</strong> (or ⌘S) writes
                <code className="mx-1 rounded bg-neutral-800 px-1">hotspots-mobile.json</code> and the phone desk
                hot-reloads — then the file needs a <strong className="text-neutral-300">commit</strong> to reach
                jackharvey.me.
              </>
            ) : (
              <>
                When you&rsquo;re happy, hit <strong className="text-neutral-300">Copy JSON</strong> (or ⌘S) and paste
                it into the chat — Claude commits it and the change goes live on the next deploy.{" "}
                <span className="text-neutral-500">
                  There&rsquo;s no Save here on purpose: this is the deployed site, whose filesystem is read-only, so
                  nothing can be written to the repo from this page.
                </span>
              </>
            )}
          </p>

          <div className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-28 text-neutral-400">Stage zoom</span>
            <input
              type="range" min={260} max={760} step={20} value={stageW}
              onChange={(e) => setStageW(+e.target.value)}
              className="w-44"
            />
            <span className="w-14 tabular-nums">{stageW}px</span>
          </div>

          <div className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-28 text-neutral-400">Corner radius</span>
            <input
              type="range" min={0} max={60} value={g.cornerRadius}
              onChange={(e) => update(active, { cornerRadius: +e.target.value })}
              className="w-44"
            />
            <span className="w-14 tabular-nums">{g.cornerRadius}px</span>
          </div>

          <div className="mb-3 flex items-center gap-3 text-sm">
            <span className="w-28 text-neutral-400">Label anchor</span>
            <select
              value={g.labelPlace}
              onChange={(e) => update(active, { labelPlace: e.target.value as LabelPlace })}
              className="rounded bg-neutral-800 px-2 py-1"
            >
              <option value="below">below</option>
              <option value="above">above</option>
              <option value="center">center</option>
            </select>
            <span className="tabular-nums text-neutral-400">
              {g.labelX.toFixed(1)}%, {g.labelY.toFixed(1)}%
            </span>
          </div>

          <div className="mb-4 flex gap-2">
            <button onClick={deletePoint} disabled={sel == null || g.corners.length <= 3}
              className="rounded bg-neutral-800 px-3 py-1.5 text-sm disabled:opacity-40">
              Delete point
            </button>
            <button onClick={() => { push(); update(active, { corners: clone(MOBILE_GEOMETRY)[active].corners }) }}
              className="rounded bg-neutral-800 px-3 py-1.5 text-sm">
              Reset object
            </button>
          </div>

          <div className="text-sm">
            <div className="mb-1 text-neutral-400">
              Corners ({g.corners.length}) — bbox {box.width.toFixed(1)}% × {box.height.toFixed(1)}%
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
              {g.corners.map((c, i) => (
                <button key={i} onClick={() => setSel(i)}
                  className={`tabular-nums ${sel === i ? "text-white" : "text-neutral-500"}`}>
                  {i}: {c[0]}, {c[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loupe — fixed so it never covers the point being placed */}
      {cursor && (
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-50 overflow-hidden rounded-lg border-2 border-neutral-700 shadow-2xl"
          style={{ width: LOUPE, height: LOUPE }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/desk-mobile.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${MOBILE_IMG_W * ZOOM}px ${MOBILE_IMG_H * ZOOM}px`,
              backgroundPosition: `${LOUPE / 2 - cursor[0] * ZOOM}px ${LOUPE / 2 - cursor[1] * ZOOM}px`,
              imageRendering: "pixelated",
            }}
          />
          <svg className="absolute inset-0 h-full w-full">
            <line x1={LOUPE / 2} y1={0} x2={LOUPE / 2} y2={LOUPE} stroke={COLORS[active]} strokeWidth={1} />
            <line x1={0} y1={LOUPE / 2} x2={LOUPE} y2={LOUPE / 2} stroke={COLORS[active]} strokeWidth={1} />
          </svg>
          <div className="absolute bottom-0 w-full bg-black/70 px-2 py-1 text-center font-mono text-xs tabular-nums">
            {Math.round(cursor[0])}, {Math.round(cursor[1])}
          </div>
        </div>
      )}
    </div>
  )
}
