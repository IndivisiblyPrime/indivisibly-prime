"use client"

import { useCallback, useEffect, useState } from "react"
import { HomepageSettings } from "@/lib/types"
import { type DeskId } from "./data"
import { EntryCover } from "./EntryCover"
import { DeskStageWeb } from "./DeskStageWeb"
import { DeskStagePhone } from "./DeskStagePhone"
import { Modal } from "./Modal"
import { AppCard } from "./cards/AppCard"
import { BookCard } from "./cards/BookCard"
import { NftCard } from "./cards/NftCard"
import { AboutCard } from "./cards/AboutCard"

const COVER_KEY = "desk-cover-seen"

export function DeskExperience({ settings }: { settings: HomepageSettings }) {
  const [active, setActive] = useState<DeskId | null>(null)
  const [coverGone, setCoverGone] = useState(false)
  // App object pulses from the start (visible on the desk behind the desktop cover,
  // and on the first phone cut-out) until the visitor first interacts.
  const [pulseApp, setPulseApp] = useState(true)

  // If the visitor already dismissed the cover this session, skip it (client-only read).
  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(COVER_KEY) === "1"
    } catch {}
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only sessionStorage read on mount
      setCoverGone(true)
    }
  }, [])

  const dismissCover = useCallback(() => {
    try {
      sessionStorage.setItem(COVER_KEY, "1")
    } catch {}
    setCoverGone(true)
  }, [])

  const open = useCallback((id: DeskId) => {
    setActive(id)
    setPulseApp(false)
  }, [])
  const close = useCallback(() => setActive(null), [])

  // Single line by design — there is no second row. `entryCoverText` is used
  // verbatim when set, so the whole greeting is editable in Studio; with it
  // blank we fall back to deriving it from the name.
  const name = settings.entryTitle || "Jack Harvey"
  const coverTitle = settings.entryCoverText || `${name}'s Portfolio`

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#171009]">
      {/* Desktop desk (all objects at once) */}
      <div className="hidden h-full w-full md:block">
        <DeskStageWeb onOpen={open} pulseApp={pulseApp} revealed={coverGone} />
      </div>

      {/* Phone desk — one continuous photo, title overlaid on it. No attract
          outline here: the phone uses the engraved "Click for details" cues
          instead, so it needs neither pulseApp nor onInteract. */}
      <div className="h-full w-full overflow-y-auto overscroll-none md:hidden">
        <DeskStagePhone onOpen={open} entryTitle={coverTitle} />
      </div>

      {/* Intro cover — DESKTOP only (phone has its own scrolling intro above).
          Greets on first visit, lifts on scroll/click, never returns. */}
      <div className="hidden md:block">
        {!coverGone && (
          <EntryCover title={coverTitle} onDismiss={dismissCover} />
        )}
      </div>

      {/* Detail card. App/Book/NFT share the biggest (xl) shell; About is the one
          intentionally different size ("wide"), per Jack. */}
      {active && (
        <Modal onClose={close} size={active === "about" ? "wide" : "xl"}>
          {active === "app" && <AppCard settings={settings} />}
          {active === "book" && <BookCard settings={settings} />}
          {active === "nft" && <NftCard settings={settings} />}
          {active === "about" && <AboutCard settings={settings} />}
        </Modal>
      )}
    </div>
  )
}
