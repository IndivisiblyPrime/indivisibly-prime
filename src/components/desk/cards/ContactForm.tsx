"use client"

import { useState } from "react"
import { solidButton } from "./shared"

const inputCls =
  "w-full rounded border border-neutral-400 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder-neutral-400 focus:border-black focus:outline-none md:px-[1.125rem] md:py-[0.9375rem] md:text-[1.3125rem]"

/** Field label — same 1.5x desktop step as everything else on the card. */
const labelCls = "mb-1 block text-xs uppercase tracking-wide text-neutral-500 md:mb-1.5 md:text-lg"

/** Contact form → POST /api/contact (name, email, phone-optional, subject, message). */
export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("sent")
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-green-700 md:text-[1.3125rem]">Message sent — I&apos;ll get back to you soon.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Name</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputCls} placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label className={labelCls}>
          Phone <span className="normal-case text-neutral-400">(optional)</span>
        </label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputCls} placeholder="+1 (555) 000-0000" />
      </div>
      <div>
        <label className={labelCls}>Subject</label>
        <input type="text" name="subject" required value={form.subject} onChange={handleChange} className={inputCls} placeholder="Subject" />
      </div>
      <div>
        <label className={labelCls}>Message</label>
        <textarea name="message" required rows={4} value={form.message} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Your message..." />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600 md:text-[1.3125rem]">Something went wrong. Please try again.</p>
      )}
      <button type="submit" disabled={status === "sending"} className={`${solidButton} px-8 py-3 md:px-12 md:py-[1.125rem]`}>
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  )
}
