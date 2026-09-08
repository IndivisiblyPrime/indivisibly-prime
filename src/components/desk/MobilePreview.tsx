"use client"

import { useState } from "react"

/**
 * Phone-sized iframe of the real site, for checking the mobile desk from a
 * laptop. Every size here is under the md (768px) breakpoint, so the desk
 * renders its phone layout exactly as it would on a device.
 */
const DEVICES = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 14", w: 390, h: 844 },
  { name: "iPhone 14 Pro Max", w: 430, h: 932 },
  { name: "Pixel 7", w: 412, h: 915 },
] as const

const ROUTES = [
  { name: "Home (the Desk)", path: "/" },
  { name: "Classic", path: "/classic" },
] as const

export function MobilePreview() {
  const [device, setDevice] = useState<(typeof DEVICES)[number]>(DEVICES[1])
  const [route, setRoute] = useState<(typeof ROUTES)[number]>(ROUTES[0])
  // Bumping this remounts the iframe — cheaper than reaching into its document,
  // and it also resets sessionStorage-driven state like the entry cover.
  const [nonce, setNonce] = useState(0)

  return (
    <div className="min-h-dvh bg-neutral-950 p-6 text-neutral-200">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <h1 className="text-lg font-medium text-white">Mobile preview</h1>

          <div className="flex flex-wrap gap-1.5">
            {DEVICES.map((d) => (
              <button
                key={d.name}
                onClick={() => setDevice(d)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  device.name === d.name ? "bg-white text-black" : "bg-neutral-800 text-neutral-300"
                }`}
              >
                {d.name}
                <span className="ml-1.5 opacity-50">
                  {d.w}×{d.h}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ROUTES.map((r) => (
              <button
                key={r.path}
                onClick={() => setRoute(r)}
                className={`rounded px-3 py-1.5 text-sm transition-colors ${
                  route.path === r.path ? "bg-neutral-700 text-white" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNonce((n) => n + 1)}
            className="ml-auto rounded bg-neutral-800 px-3 py-1.5 text-sm"
            title="Reload the frame and replay the entry cover"
          >
            ↻ Reload
          </button>
        </header>

        <p className="mb-5 text-xs leading-relaxed text-neutral-400">
          This is the real site in an iframe {device.w}px wide — under the{" "}
          <code className="rounded bg-neutral-800 px-1">md</code> (768px) breakpoint, which is the only thing that
          decides phone vs. desktop layout. Scroll inside the frame as you would on a device.{" "}
          <span className="text-neutral-500">Local only; this page 404s in production.</span>
        </p>

        <div className="flex justify-center">
          {/* Chunky bezel so the frame edge is obvious against the page */}
          <div
            className="rounded-[2.5rem] bg-neutral-800 p-3 shadow-2xl ring-1 ring-white/10"
            style={{ width: device.w + 24 }}
          >
            <iframe
              key={`${device.name}-${route.path}-${nonce}`}
              src={route.path}
              title={`${route.name} at ${device.w}×${device.h}`}
              width={device.w}
              height={device.h}
              className="block rounded-[1.6rem] border-0 bg-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
