/* eslint-disable @next/next/no-img-element */
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  GEOMETRY,
  IMG_W,
  IMG_H,
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

/** Serialised exactly like the API writes it, so an export can be pasted verbatim. */
function serialise(geo: Geo) {
  const comment = (GEOMETRY as unknown as { _comment?: string })._comment ?? ""
  // Iterate the known ids, NOT Object.keys — hotspots.json also carries the
  // "_comment" string, which has no corners to map over.
  const blocks = OBJECTS.map(({ id }) => {
    const g = geo[id]
    const corners = g.corners.map((c) => `[${Math.round(c[0])}, ${Math.round(c[1])}]`).join(", ")
    return [
      `  ${JSON.stringify(id)}: {`,
      `    "corners": [${corners}],`,
      `    "cornerRadius": ${Math.round(g.cornerRadius)},`,
      `    "labelX": ${Math.round(g.labelX * 10) / 10},`,
      `    "labelY": ${Math.round(g.labelY * 10) / 10},`,
      `    "labelPlace": ${JSON.stringify(g.labelPlace)}`,
      `  }`,
    ].join("\n")
  })
  return `{\n  "_comment": ${JSON.stringify(comment)},\n${blocks.join(",\n")}\n}\n`
}

export function CalibrateTool({ writable = true }: { writable?: boolean }) {
  const [geo, setGeo] = useState<Geo>(() => clone(GEOMETRY))
  const [active, setActive] = useState<DeskId>("app")
  const [sel, setSel] = useState<number | null>(null)
  const [drag, setDrag] = useState<{ kind: "corner"; i: number } | { kind: "label" } | null>(null)
  const [cursor, setCursor] = useState<Pt | null>(null)
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "busy"; msg: string } | null>(null)
  const [history, setHistory] = useState<Geo[]>([])
  // Last state written to disk, so the header can show unsaved-changes at a glance.
  const [saved, setSaved] = useState<string>(() => JSON.stringify(GEOMETRY))
  const dirty = JSON.stringify(geo) !== saved

  const stageRef = useRef<HTMLDivElement>(null)
  const g = geo[active]

  /** mouse event -> desk.png pixel coords */
  const toImage = useCallback((e: { clientX: number; clientY: number }): Pt => {
    const r = stageRef.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * IMG_W, ((e.clientY - r.top) / r.height) * IMG_H]
  }, [])

  const push = useCallback(() => setHistory((h) => [...h.slice(-40), clone(geo)]), [geo])

  const update = useCallback((id: DeskId, patch: Partial<HotspotGeometry>) => {
    setGeo((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }, [])

  const onStageDown = (e: React.MouseEvent) => {
    const p = toImage(e)
    // Grab the nearest corner within ~12 image px, else the label, else add a point.
    let best = -1
    let bestD = 12
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
        update(active, { labelX: (p[0] / IMG_W) * 100, labelY: (p[1] / IMG_H) * 100 })
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

  const download = useCallback(() => {
    const url = URL.createObjectURL(new Blob([serialise(geo)], { type: "application/json" }))
    const a = document.createElement("a")
    a.href = url
    a.download = "hotspots.json"
    a.click()
    URL.revokeObjectURL(url)
    setSaved(JSON.stringify(geo))
  }, [geo])

  const save = useCallback(async () => {
    const body = JSON.stringify(geo)
    // Read-only filesystem in production (Vercel), so there is nothing to write
    // to — hand the JSON back instead of pretending a save happened.
    if (!writable) {
      try {
        await navigator.clipboard.writeText(serialise(geo))
        setSaved(body)
        setStatus({ kind: "ok", msg: "Copied ✓ paste into hotspots.json and commit" })
      } catch {
        // Clipboard needs a secure context and permission; fall through to a
        // download rather than leaving the work stranded in the page.
        download()
        setStatus({ kind: "ok", msg: "Clipboard blocked — downloaded hotspots.json instead" })
      }
      setTimeout(() => setStatus(null), 6000)
      return
    }
    setStatus({ kind: "busy", msg: "Saving…" })
    try {
      const res = await fetch("/api/calibrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        setSaved(body)
        setStatus({ kind: "ok", msg: "Saved ✓  hotspots.json written" })
      } else {
        setStatus({ kind: "err", msg: `Failed: ${json.error ?? res.status}` })
      }
    } catch (e) {
      setStatus({ kind: "err", msg: `Failed: ${(e as Error).message}` })
    }
    setTimeout(() => setStatus(null), 5000)
  }, [geo, writable, download])

  // ⌘S / Ctrl+S saves without reaching for the button.
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
    outline: roundedOutline(geo[o.id].corners, geo[o.id].cornerRadius),
  }))
  const activeOutline = outlines.find((o) => o.id === active)!.outline

  return (
    <div className="min-h-dvh bg-neutral-950 p-4 text-neutral-200">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-medium text-white">Desk hotspot calibration</h1>
          <div className="flex gap-1.5">
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
          <div className="ml-auto flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm">
              <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} />
              Preview spotlight
            </label>
            <button onClick={undo} disabled={!history.length} className="rounded bg-neutral-800 px-3 py-1.5 text-sm disabled:opacity-40">
              Undo
            </button>
            {/* Feedback lives HERE, beside the button — the stage is tall enough
                that anything below it is off-screen and effectively invisible. */}
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
            {!writable && (
              <button onClick={download} className="rounded bg-neutral-800 px-3 py-1.5 text-sm">
                Download
              </button>
            )}
            <button
              onClick={save}
              className={`rounded px-4 py-1.5 text-sm font-semibold ${dirty ? "bg-white text-black" : "bg-neutral-700 text-neutral-300"}`}
            >
              {writable ? "Save" : "Copy JSON"} <span className="opacity-50">⌘S</span>
            </button>
          </div>
        </header>

        <p className="mb-3 text-xs leading-relaxed text-neutral-400">
          Click the object&rsquo;s corners on the photo (any order — points insert on the nearest edge). Drag a corner to
          move it; the loupe magnifies {ZOOM}× so you can land on the exact pixel. Arrow keys nudge the selected
          corner 1px, Shift+arrow 10px. The label only moves if you grab its ◆ handle.{" "}
          {writable ? (
            <>
              <strong className="text-neutral-300">Save</strong> (or ⌘S) writes
              <code className="mx-1 rounded bg-neutral-800 px-1">hotspots.json</code>; the desk hot-reloads, but you
              still need to <strong className="text-neutral-300">commit the file</strong> for it to reach the live site.
            </>
          ) : (
            <>
              <strong className="text-amber-300">You&rsquo;re on the live site</strong>, where the filesystem is
              read-only — nothing here can save itself.{" "}
              <strong className="text-neutral-300">Copy JSON</strong> (or ⌘S) puts the finished file on your clipboard;
              paste it over <code className="mx-1 rounded bg-neutral-800 px-1">src/components/desk/hotspots.json</code>
              and commit to deploy it.
            </>
          )}
        </p>

        <div
          ref={stageRef}
          onMouseDown={onStageDown}
          onMouseMove={(e) => setCursor(toImage(e))}
          onMouseLeave={() => setCursor(null)}
          className="relative w-full cursor-crosshair select-none overflow-hidden rounded"
          style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
        >
          <img src="/desk.png" alt="" className="absolute inset-0 h-full w-full" draggable={false} />

          {preview && (
            <>
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d={`M0 0H100V100H0Z ${toPath(activeOutline)}`} fill="rgba(0,0,0,0.28)" fillRule="evenodd" />
              </svg>
              <img
                src="/desk.png"
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
                left: `${(c[0] / IMG_W) * 100}%`,
                top: `${(c[1] / IMG_H) * 100}%`,
                width: 13,
                height: 13,
                transform: "translate(-50%, -50%)",
                borderColor: COLORS[active],
                background: sel === i ? COLORS[active] : "rgba(0,0,0,0.55)",
              }}
            />
          ))}
          {/* Label handle — its own hit target, so it moves only when you grab
              the diamond itself. stopPropagation keeps the stage from also
              inserting a corner underneath it. */}
          <div
            onMouseDown={(e) => { e.stopPropagation(); push(); setDrag({ kind: "label" }) }}
            title="Drag to move this object's label"
            className="absolute flex cursor-move items-center justify-center rounded-full text-sm font-bold"
            style={{
              left: `${g.labelX}%`,
              top: `${g.labelY}%`,
              width: 22,
              height: 22,
              transform: "translate(-50%, -50%)",
              color: COLORS[active],
              background: "rgba(0,0,0,0.45)",
              border: `1px solid ${COLORS[active]}`,
              textShadow: "0 0 4px #000",
            }}
          >
            ◆
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-start gap-6">
          <div className="min-w-[300px]">
            <div className="mb-2 flex items-center gap-3 text-sm">
              <span className="w-28 text-neutral-400">Corner radius</span>
              <input
                type="range" min={0} max={60} value={g.cornerRadius}
                onChange={(e) => update(active, { cornerRadius: +e.target.value })}
                className="w-44"
              />
              <span className="w-10 tabular-nums">{g.cornerRadius}px</span>
            </div>
            <div className="mb-2 flex items-center gap-3 text-sm">
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
            <div className="flex gap-2">
              <button onClick={deletePoint} disabled={sel == null || g.corners.length <= 3}
                className="rounded bg-neutral-800 px-3 py-1.5 text-sm disabled:opacity-40">
                Delete point
              </button>
              <button onClick={() => { push(); update(active, { corners: clone(GEOMETRY)[active].corners }) }}
                className="rounded bg-neutral-800 px-3 py-1.5 text-sm">
                Reset object
              </button>
            </div>
          </div>

          <div className="text-sm">
            <div className="mb-1 text-neutral-400">
              Corners ({g.corners.length}) — bbox {bbox(g.corners).width.toFixed(1)}% ×{" "}
              {bbox(g.corners).height.toFixed(1)}%
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
          className="pointer-events-none fixed right-4 top-4 z-50 overflow-hidden rounded-lg border-2 border-neutral-700 shadow-2xl"
          style={{ width: LOUPE, height: LOUPE }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/desk.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${IMG_W * ZOOM}px ${IMG_H * ZOOM}px`,
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
