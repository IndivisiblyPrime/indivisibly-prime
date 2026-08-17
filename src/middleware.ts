import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Gate for the desk calibration tool.
 *
 * /calibrate is an editing surface for the homepage — it should never be
 * browsable by visitors, so it sits behind HTTP Basic auth. This **fails
 * closed**: with no credentials configured the route 404s, so a deploy that
 * forgets the env vars hides the tool rather than exposing it.
 *
 * Set in Vercel → Settings → Environment Variables:
 *   CALIBRATE_USER, CALIBRATE_PASSWORD
 */

/** Constant-time compare so a wrong password can't be found byte-by-byte. */
function safeEqual(a: string, b: string) {
  const enc = new TextEncoder()
  const x = enc.encode(a)
  const y = enc.encode(b)
  // Always walk the longer of the two, folding the length difference into the
  // result, so timing doesn't leak the secret's length either.
  let diff = x.length ^ y.length
  const n = Math.max(x.length, y.length)
  for (let i = 0; i < n; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

export function middleware(req: NextRequest) {
  // Local dev is already private, and requiring credentials there would just
  // put a password prompt between Jack and his own localhost.
  if (process.env.NODE_ENV !== "production") return NextResponse.next()

  const user = process.env.CALIBRATE_USER
  const pass = process.env.CALIBRATE_PASSWORD
  if (!user || !pass) {
    return new NextResponse("Not found", { status: 404 })
  }

  const header = req.headers.get("authorization") ?? ""
  const [scheme, encoded] = header.split(" ")
  if (scheme === "Basic" && encoded) {
    let decoded = ""
    try {
      decoded = atob(encoded)
    } catch {
      decoded = ""
    }
    const i = decoded.indexOf(":")
    if (i >= 0) {
      const okUser = safeEqual(decoded.slice(0, i), user)
      const okPass = safeEqual(decoded.slice(i + 1), pass)
      if (okUser && okPass) return NextResponse.next()
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Desk calibration", charset="UTF-8"',
      // Never let a proxy or the browser cache the tool or the challenge.
      "Cache-Control": "no-store",
    },
  })
}

export const config = { matcher: ["/calibrate", "/calibrate/:path*", "/api/calibrate/:path*"] }
