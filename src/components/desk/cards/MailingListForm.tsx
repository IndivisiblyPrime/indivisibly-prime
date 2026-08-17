"use client"

import { useState } from "react"
import { solidButton } from "./shared"

/** Mailing list signup → POST /api/subscribe (same endpoint as /classic's Coming Soon panel). */
export function MailingListForm({ tagline }: { tagline?: string }) {
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
    return <p className="text-sm text-green-700">You&apos;re on the list!</p>
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-md gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded border border-neutral-400 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder-neutral-400 focus:border-black focus:outline-none"
        />
        <button type="submit" disabled={status === "sending"} className={`${solidButton} px-5`}>
          {status === "sending" ? "…" : "Subscribe"}
        </button>
      </form>
      {tagline && <p className="mt-2 text-xs text-neutral-400">({tagline})</p>}
      {status === "error" && <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>}
    </div>
  )
}
