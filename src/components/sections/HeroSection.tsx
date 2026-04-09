"use client"

import { useState, useEffect, useRef } from "react"
import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { SanityFileAsset } from "@/lib/types"

interface HeroSectionProps {
  heroImage?: SanityImageSource
  heroVideo?: SanityFileAsset
  heroVideoUrl?: string
  heroIntroVideo?: SanityFileAsset
  heroBoredomVideo?: SanityFileAsset
  heroBoredomButtonText?: string
}

function sanityFileUrl(asset: SanityFileAsset | undefined): string | undefined {
  if (!asset?.asset?._ref) return undefined
  const ref = asset.asset._ref
  const parts = ref.split("-")
  // format: file-<id>-<ext>
  const ext = parts[parts.length - 1]
  const id = parts.slice(1, parts.length - 1).join("-")
  return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}.${ext}`
}

export function HeroSection({
  heroImage,
  heroVideo,
  heroVideoUrl,
  heroIntroVideo,
  heroBoredomVideo,
  heroBoredomButtonText,
}: HeroSectionProps) {
  const introVideoUrl = sanityFileUrl(heroIntroVideo)
  const mainVideoUrl = sanityFileUrl(heroVideo) || heroVideoUrl
  const boredomVideoUrl = sanityFileUrl(heroBoredomVideo)

  const [videoPhase, setVideoPhase] = useState<"intro" | "main">(
    introVideoUrl ? "intro" : "main"
  )
  const [boredomMode, setBoredomMode] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const boredomActivatedRef = useRef(false)

  // Scroll hint: show after 20s if user hasn't scrolled ~480px and hasn't hit Bored
  useEffect(() => {
    let dismissed = false
    const SCROLL_THRESHOLD = 480

    const onScroll = () => {
      if (window.scrollY >= SCROLL_THRESHOLD) {
        dismissed = true
        setShowScrollHint(false)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    const timer = setTimeout(() => {
      if (!dismissed && !boredomActivatedRef.current && window.scrollY < SCROLL_THRESHOLD) {
        setShowScrollHint(true)
      }
    }, 20000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Hide scroll hint when boredom mode is activated
  useEffect(() => {
    if (boredomMode) setShowScrollHint(false)
  }, [boredomMode])

  // Determine which video src to show
  const activeVideoSrc = (() => {
    if (boredomMode && boredomVideoUrl) return boredomVideoUrl
    if (videoPhase === "intro" && introVideoUrl) return introVideoUrl
    return mainVideoUrl
  })()

  const hasVideo = !!activeVideoSrc

  const isIntroPlaying = videoPhase === "intro" && !boredomMode && !!introVideoUrl

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900"
    >
      {/* Background - Video or Image */}
      <div className="absolute inset-0">
        {hasVideo ? (
          <>
            {isIntroPlaying ? (
              // Intro video: plays once, then switches to main
              <video
                key="intro"
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
                onEnded={() => setVideoPhase("main")}
              >
                <source src={activeVideoSrc} type="video/mp4" />
              </video>
            ) : (
              // Main or boredom video
              <video
                key={boredomMode ? "boredom" : "main"}
                autoPlay
                muted
                loop={!boredomMode}
                playsInline
                className="h-full w-full object-cover"
              >
                <source src={activeVideoSrc} type="video/mp4" />
              </video>
            )}
          </>
        ) : heroImage ? (
          <>
            <img
              src={urlFor(heroImage).width(1920).height(1080).url()}
              alt=""
              className="h-full w-full rotate-180 object-cover"
            />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-900" />
        )}
      </div>

      {/* Hero title */}
      <div className="relative z-10 px-4 text-center">
        <h1 className="text-7xl font-bold uppercase tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] md:text-8xl lg:text-9xl">
          Jack Harvey
        </h1>
      </div>

      {/* Scroll hint */}
      {showScrollHint && (
        <p className="animate-flash absolute bottom-16 left-1/2 z-50 -translate-x-1/2 text-xl text-white/90 pointer-events-none select-none">
          (scroll down please)
        </p>
      )}

      {/* "Bored?" button — always shown bottom right */}
      <button
        onClick={() => {
          boredomActivatedRef.current = true
          setBoredomMode((m) => !m)
        }}
        className="absolute bottom-6 right-8 z-50 border border-white px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
      >
        {boredomMode ? "Back" : (heroBoredomButtonText || "Bored?")}
      </button>
    </section>
  )
}
