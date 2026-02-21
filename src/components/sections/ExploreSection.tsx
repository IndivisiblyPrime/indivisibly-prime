"use client"

import { useState, useEffect, useRef } from "react"
import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { EncryptedText } from "@/components/ui/encrypted-text"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Linkedin, Instagram } from "lucide-react"
import {
  AccordionItem as AccordionItemType,
  SocialLink,
  NFTItem,
} from "@/lib/types"

// ─── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
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
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-green-700">Message sent! I&apos;ll get back to you soon.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">Subject</label>
        <input
          type="text"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="w-full border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
          placeholder="Subject"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full resize-none border-b border-black bg-transparent px-0 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none"
          placeholder="Your message..."
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-black px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  )
}

// ─── Book Panel ────────────────────────────────────────────────────────────────

interface BookPanelProps {
  title?: string
  description?: string
  image?: SanityImageSource
  buttonText?: string
  buttonUrl?: string
  animKey: number
  isOpen: boolean
}

function BookPanel({ title, description, image, buttonText, buttonUrl, animKey, isOpen }: BookPanelProps) {
  const displayTitle = title || "Book"
  const displayButtonText = buttonText || "Buy / View More Details"
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current || !lineRef.current) return
    if (isOpen) {
      // Remove then re-add class to force animation restart
      titleRef.current.classList.remove("animate-title-draw")
      lineRef.current.classList.remove("animate-line-draw")
      void titleRef.current.offsetWidth // force reflow
      titleRef.current.classList.add("animate-title-draw")
      lineRef.current.classList.add("animate-line-draw")
    } else {
      titleRef.current.classList.remove("animate-title-draw")
      lineRef.current.classList.remove("animate-line-draw")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, animKey])

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr]">
      {/* Left column */}
      <div className="flex flex-col justify-between">
        <div>
          <h3
            ref={titleRef}
            className="text-3xl font-semibold italic leading-tight tracking-tight md:text-4xl"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            {displayTitle}
          </h3>
          <div
            ref={lineRef}
            className="mt-2 h-px bg-black"
            style={{ transform: "scaleX(0)", transformOrigin: "left" }}
          />
          {description && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
              {description}
            </p>
          )}
        </div>
        {/* Button at bottom */}
        <div className="mt-8">
          {buttonUrl ? (
            <a
              href={buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-black px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white"
            >
              {displayButtonText}
            </a>
          ) : (
            <button className="border border-black px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white">
              {displayButtonText}
            </button>
          )}
        </div>
      </div>
      {/* Right column — book cover */}
      <div>
        {image ? (
          <img
            src={urlFor(image).width(800).url()}
            alt={displayTitle}
            className="h-[85vh] w-full object-cover"
          />
        ) : (
          <div className="flex h-[85vh] w-full items-center justify-center bg-neutral-100">
            <span className="text-neutral-400">Book cover</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── NFT Panel ────────────────────────────────────────────────────────────────

interface NFTPanelProps {
  subtitle?: string
  nftGallery?: NFTItem[]
  landscapeGallery?: NFTItem[]
  ctaButtonText?: string
  ctaButtonUrl?: string
  encryptedText?: string
}

function NFTPanel({ subtitle, nftGallery, landscapeGallery, ctaButtonText, ctaButtonUrl, encryptedText }: NFTPanelProps) {
  const portrait1 = nftGallery?.[0]
  const landscape1 = landscapeGallery?.[0]
  const portrait2 = nftGallery?.[1]
  const displayCtaText = ctaButtonText || "View Collection"
  const displayEncryptedText = encryptedText || "Welcome to the Matrix, Neo."

  const renderGalleryImage = (item: NFTItem | undefined, fallback: string) => {
    if (!item?.image) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100">
          <span className="text-xs text-neutral-400">{fallback}</span>
        </div>
      )
    }
    return (
      <img
        src={urlFor(item.image).width(800).url()}
        alt={item.alt || item.title || ""}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    )
  }

  return (
    <div>
      {subtitle && (
        <p className="mb-6 text-sm italic text-neutral-500">{subtitle}</p>
      )}
      {/* 3-image grid: portrait | landscape | portrait */}
      <div className="grid h-[60vh] grid-cols-[1fr_1.5fr_1fr] gap-4">
        <div className="overflow-hidden">
          {renderGalleryImage(portrait1, "Portrait 1")}
        </div>
        <div className="overflow-hidden">
          {renderGalleryImage(landscape1, "Landscape")}
        </div>
        <div className="overflow-hidden">
          {renderGalleryImage(portrait2, "Portrait 2")}
        </div>
      </div>
      {/* CTA row */}
      <div className="mt-8">
        {ctaButtonUrl ? (
          <a
            href={ctaButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-black px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white"
          >
            {displayCtaText}
          </a>
        ) : (
          <button className="border border-black px-6 py-2 text-sm transition-colors hover:bg-black hover:text-white">
            {displayCtaText}
          </button>
        )}
        <p className="mt-4">
          <EncryptedText
            text={displayEncryptedText}
            encryptedClassName="text-neutral-400"
            revealedClassName="text-black"
            revealDelayMs={50}
            triggerOnHover
            className="text-xs"
          />
        </p>
      </div>
    </div>
  )
}

// ─── About Panel ──────────────────────────────────────────────────────────────

const defaultAccordionItems: AccordionItemType[] = [
  {
    _key: "1",
    title: "About Me",
    content: "Welcome to my personal website. Add your bio in Sanity Studio.",
    showSocialLinks: false,
  },
  {
    _key: "2",
    title: "Career Highlights",
    content: "Add your career highlights in Sanity Studio.",
    showSocialLinks: false,
  },
  {
    _key: "3",
    title: "Contact Me",
    content: "Get in touch.",
    showSocialLinks: true,
  },
]

interface AboutPanelProps {
  accordionItems?: AccordionItemType[]
  socialLinks?: SocialLink[]
  linkedinUrl?: string
  instagramUrl?: string
}

function AboutPanel({ accordionItems, socialLinks, linkedinUrl, instagramUrl }: AboutPanelProps) {
  const items = accordionItems && accordionItems.length > 0 ? accordionItems : defaultAccordionItems

  return (
    <div>
      {/* Social icons row */}
      {(linkedinUrl || instagramUrl) && (
        <div className="mb-6 flex items-center gap-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-white transition-opacity hover:opacity-70"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-md bg-black text-white transition-opacity hover:opacity-70"
            >
              <Instagram className="h-5 w-5" />
            </a>
          )}
        </div>
      )}
      {/* Minimal accordion */}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem
            key={item._key}
            value={item._key}
            className="border-b border-neutral-200 last:border-b-0"
          >
            <AccordionTrigger className="py-4 text-left text-base font-medium text-black [&:hover]:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm text-neutral-700">
              {(!item.itemType || item.itemType === "text") && (
                <>
                  <p className="whitespace-pre-wrap leading-relaxed">{item.content}</p>
                  {item.showSocialLinks && socialLinks && socialLinks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {socialLinks.map((link) => (
                        <a
                          key={link._key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs capitalize underline underline-offset-2 hover:text-black"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
              {item.itemType === "experience" && item.experienceEntries && (
                <div className="space-y-6">
                  {item.experienceEntries.map((entry) => (
                    <div key={entry._key} className="flex gap-4">
                      {entry.logo && (
                        <div className="shrink-0">
                          <img
                            src={urlFor(entry.logo).width(80).height(80).url()}
                            alt={entry.company ?? ""}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-base font-semibold text-black">{entry.jobTitle}</p>
                        {entry.company && (
                          <p className="text-sm text-neutral-600">{entry.company}</p>
                        )}
                        {entry.dateRange && (
                          <p className="text-xs text-neutral-400">{entry.dateRange}</p>
                        )}
                        {entry.bullets && entry.bullets.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {entry.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {item.itemType === "contact" && <ContactForm />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

// ─── Main ExploreSection ──────────────────────────────────────────────────────

interface ExploreSectionProps {
  bookTitle?: string
  bookDescription?: string
  bookImage?: SanityImageSource
  bookButtonText?: string
  bookButtonUrl?: string
  nftSubtitle?: string
  nftGallery?: NFTItem[]
  landscapeGallery?: NFTItem[]
  ctaButtonText?: string
  ctaButtonUrl?: string
  encryptedText?: string
  accordionItems?: AccordionItemType[]
  socialLinks?: SocialLink[]
  instagramUrl?: string
}

const PANELS = [
  { id: "book", title: "Book" },
  { id: "nfts", title: "NFTs" },
  { id: "about", title: "About Me" },
]

export function ExploreSection({
  bookTitle,
  bookDescription,
  bookImage,
  bookButtonText,
  bookButtonUrl,
  nftSubtitle,
  nftGallery,
  landscapeGallery,
  ctaButtonText,
  ctaButtonUrl,
  encryptedText,
  accordionItems,
  socialLinks,
  instagramUrl,
}: ExploreSectionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const [bookAnimKey, setBookAnimKey] = useState(0)

  const toggle = (id: string) => {
    const willOpen = !open.has(id)
    if (id === "book" && willOpen) {
      setBookAnimKey((k) => k + 1)
    }
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isOpen = (id: string) => open.has(id)

  const linkedinUrl = socialLinks?.find((l) => l.platform === "linkedin")?.url
  const instagramFromSocial = socialLinks?.find((l) => l.platform === "instagram")?.url
  const resolvedInstagramUrl = instagramFromSocial || instagramUrl

  return (
    <section id="explore" className="w-full bg-white px-8 py-16 md:px-16">
      {/* Explore heading */}
      <h2 className="mb-4 text-[80px] font-bold leading-none tracking-tight md:text-[120px]">
        Explore
      </h2>
      <hr className="border-black/20" />

      {PANELS.map((panel) => (
        <div key={panel.id}>
          <hr className="border-black" />
          <button
            onClick={() => toggle(panel.id)}
            className="flex w-full items-center gap-3 py-5 text-left"
          >
            {/* Filled triangle indicator */}
            <span
              className="shrink-0 transition-transform duration-300"
              style={{
                display: "inline-block",
                transform: isOpen(panel.id) ? "rotate(90deg)" : "rotate(0deg)",
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "10px solid black",
              }}
            />
            <span className="text-xl font-medium">{panel.title}</span>
          </button>
          {/* Collapsible content */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen(panel.id) ? "max-h-[500vh] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-10">
              {panel.id === "book" && (
                <BookPanel
                  title={bookTitle}
                  description={bookDescription}
                  image={bookImage}
                  buttonText={bookButtonText}
                  buttonUrl={bookButtonUrl}
                  animKey={bookAnimKey}
                  isOpen={isOpen("book")}
                />
              )}
              {panel.id === "nfts" && (
                <NFTPanel
                  subtitle={nftSubtitle}
                  nftGallery={nftGallery}
                  landscapeGallery={landscapeGallery}
                  ctaButtonText={ctaButtonText}
                  ctaButtonUrl={ctaButtonUrl}
                  encryptedText={encryptedText}
                />
              )}
              {panel.id === "about" && (
                <AboutPanel
                  accordionItems={accordionItems}
                  socialLinks={socialLinks}
                  linkedinUrl={linkedinUrl}
                  instagramUrl={resolvedInstagramUrl}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      <hr className="border-black" />
    </section>
  )
}
