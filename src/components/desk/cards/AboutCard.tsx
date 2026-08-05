/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { Linkedin, Instagram, Mail, ArrowLeft } from "lucide-react"
import { HomepageSettings } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { ContactForm } from "./ContactForm"
import { MailingListForm } from "./MailingListForm"
import { FALLBACK } from "../data"

const iconBtn =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/15 text-neutral-700 transition-colors hover:bg-black hover:text-white"

const sectionLabel = "text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400"

export function AboutCard({ settings }: { settings: HomepageSettings }) {
  const [showContact, setShowContact] = useState(false)

  const name = settings.entryTitle || "Jack Harvey"
  const tagline = settings.aboutTagline || "Builder · Investor · Lifelong Meditator"
  const intro = settings.aboutIntroText || "email me your thoughts"
  const photo = settings.aboutImage ? urlFor(settings.aboutImage).width(600).height(750).url() : FALLBACK.journal

  const linkedin = settings.socialLinks?.find((l) => l.platform === "linkedin")?.url
  const instagram = settings.socialLinks?.find((l) => l.platform === "instagram")?.url || settings.instagramUrl

  const experienceItem = settings.aboutAccordion?.find((i) => i.itemType === "experience")
  const talentsItem = settings.aboutAccordion?.find((i) => i.itemType === "logoFreeform")
  const experienceEntries = experienceItem?.experienceEntries ?? []
  const talentEntries = talentsItem?.logoFreeformEntries ?? []

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,240px)_1fr] md:gap-10">
      {/* Photo + socials — left */}
      <div className="mx-auto w-full max-w-[220px] md:mx-0 md:max-w-none">
        <img
          src={photo}
          alt={name}
          className="aspect-[4/5] w-full rounded-lg object-cover shadow-lg ring-1 ring-black/10"
          draggable={false}
        />
        <div className="mt-4 flex justify-center gap-2.5 md:justify-start">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconBtn}>
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={iconBtn}>
              <Instagram className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setShowContact((v) => !v)}
            aria-label="Email me"
            aria-pressed={showContact}
            className={`${iconBtn} ${showContact ? "bg-black text-white" : ""}`}
          >
            <Mail className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Everything else — right */}
      <div>
        <h2 className="font-serif text-3xl text-neutral-900 sm:text-4xl">{name}</h2>
        {tagline && <p className="mt-2 tracking-wide text-neutral-500">{tagline}</p>}

        {showContact ? (
          <div className="mt-6 duration-300 animate-in fade-in slide-in-from-top-2">
            <button
              type="button"
              onClick={() => setShowContact(false)}
              className="mb-5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h3 className="mb-5 font-serif text-2xl text-neutral-900">Contact Me</h3>
            <ContactForm />
          </div>
        ) : (
          <>
            {intro && <p className="mt-5 leading-relaxed text-neutral-600">{intro}</p>}

            {/* Experience — logo in the left slot, year as the small grey line */}
            {experienceEntries.length > 0 && (
              <div className="mt-8">
                <h3 className={`mb-5 ${sectionLabel}`}>{experienceItem?.title || "Experience"}</h3>
                <div>
                  {experienceEntries.map((entry, idx) => {
                    const isLast = idx === experienceEntries.length - 1
                    return (
                      <div key={entry._key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {entry.logo ? (
                            <img
                              src={urlFor(entry.logo).width(96).height(96).url()}
                              alt={entry.company ?? ""}
                              className="h-12 w-12 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 shrink-0 rounded-md bg-neutral-200" />
                          )}
                          {!isLast && <div className="mb-1 mt-1 w-px flex-1 bg-black/15" />}
                        </div>
                        <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                          <p className="text-sm font-semibold text-neutral-800">{entry.jobTitle}</p>
                          {entry.company && <p className="text-sm text-neutral-600">{entry.company}</p>}
                          {entry.dateRange && <p className="text-xs text-neutral-400">{entry.dateRange}</p>}
                          {entry.description && (
                            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {experienceEntries.length > 0 && talentEntries.length > 0 && (
              <hr className="my-8 border-neutral-200" />
            )}

            {/* Other Talents & Interests — text only, no logos */}
            {talentEntries.length > 0 && (
              <div className={experienceEntries.length > 0 ? "" : "mt-8"}>
                <h3 className={`mb-4 ${sectionLabel}`}>{talentsItem?.title || "Other Talents & Interests"}</h3>
                <div className="space-y-3">
                  {talentEntries.map((entry) => (
                    <div key={entry._key} className="text-sm leading-relaxed text-neutral-600">
                      <span className="font-medium text-neutral-800">{entry.title}</span>
                      {entry.subtitle && <span className="text-neutral-500"> — {entry.subtitle}</span>}
                      {entry.description && (
                        <p className="mt-0.5 whitespace-pre-wrap text-neutral-600">{entry.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mailing list — bottom of card, same copy/endpoint as /classic's Coming Soon panel */}
            <hr className="my-8 border-neutral-200" />
            <div>
              <h3 className={`mb-4 ${sectionLabel}`}>Join the Mailing List</h3>
              <MailingListForm tagline={settings.comingSoonTagline} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
