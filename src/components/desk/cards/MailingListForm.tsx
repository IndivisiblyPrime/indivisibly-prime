"use client"

import { useState } from "react"
import { solidButton } from "./shared"

/** Mailing list signup → POST /api/subscribe (same endpoint as /classic's Coming Soon panel). */
export function MailingListForm({ tagline }: { tagline?: string }) {
  // Trimmed, because the parentheses are added here: a tagline of " " is
  // Studio's only way to blank a string field that already has a value, and it
  // used to render as a bare "( )" (Jack, 2026-09-09). Blank means no line.
  const note = tagline?.trim()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("sent")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-green-700 md:text-[1.3125rem]">You&apos;re on the list!</p>
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-md gap-3 md:max-w-2xl md:gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded border border-neutral-400 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder-neutral-400 focus:border-black focus:outline-none md:px-[1.125rem] md:py-[0.9375rem] md:text-[1.3125rem]"
        />
        <button type="submit" disabled={status === "sending"} className={`${solidButton} px-5 md:px-[1.875rem]`}>
          {status === "sending" ? "…" : "Subscribe"}
        </button>
      </form>
      {note && <p className="mt-2 text-xs text-neutral-400 md:text-lg">({note})</p>}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-600 md:text-lg">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
