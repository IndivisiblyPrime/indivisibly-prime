/* eslint-disable @next/next/no-img-element */
"use client"

import { HomepageSettings, NFTItem } from "@/lib/types"
import { urlFor } from "@/sanity/lib/image"
import { EncryptedText } from "@/components/ui/encrypted-text"
import { Eyebrow, ActionButton } from "./shared"
import { FALLBACK } from "../data"

export function NftCard({ settings }: { settings: HomepageSettings }) {
  const rawTitle = settings.nftSectionTitle
  const heading = rawTitle && rawTitle !== "NFTs" ? rawTitle : "The Lost Library of Alexandria"
  const subtitle = settings.nftSectionSubtitle || "Select highlights from the collection"
  const ctaText = settings.ctaButtonText || "All NFT Galleries"
  const ctaUrl = settings.ctaButtonUrl
  const cryptic = settings.encryptedText || "rx eu Hr AF Dgibce"

  const portrait1 = settings.nftGallery?.[0]
  const landscape1 = settings.landscapeGallery?.[0]
  const portrait2 = settings.nftGallery?.[1]
  const hasSanity = !!(portrait1?.image || landscape1?.image || portrait2?.image)

  // Mirrors ExploreSection: title + year gradient overlay, hover-scale on the
  // wrapper (so the overlay scales too), per-item URL falling back to the CTA URL.
  const renderTile = (item?: NFTItem) => {
    if (!item?.image) return null
    const url = item.url || ctaUrl
    const inner = (
      <div className="group relative inline-block overflow-hidden rounded-lg shadow-md ring-1 ring-black/10 transition-transform duration-500 hover:scale-105">
        <img
          src={urlFor(item.image).width(1100).url()}
          alt={item.alt || item.title || ""}
          className="block h-auto max-h-[62vh] w-auto max-w-full object-contain"
          draggable={false}
        />
        {(item.title || item.year) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 pt-8">
            {item.title && <p className="text-sm font-medium leading-tight text-white drop-shadow">{item.title}</p>}
            {item.year && <p className="text-xs text-white/70 drop-shadow">{item.year}</p>}
          </div>
        )}
      </div>
    )
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        {inner}
      </a>
    ) : (
      inner
    )
  }

  return (
    <div>
      <Eyebrow>03 — The NFTs</Eyebrow>
      <h2 className="font-serif text-3xl text-neutral-900 sm:text-4xl">{heading}</h2>
      <p className="mt-2 italic text-neutral-500">{subtitle}</p>

      {hasSanity ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_1.5fr_1fr] sm:items-end sm:gap-5">
          <div className="flex justify-center">{renderTile(portrait1)}</div>
          <div className="flex justify-center">{renderTile(landscape1)}</div>
          <div className="flex justify-center">{renderTile(portrait2)}</div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_1.5fr_1fr] sm:items-end">
          {FALLBACK.nfts.map((n) => {
            const inner = (
              <div className="group relative w-full overflow-hidden rounded-lg shadow-md ring-1 ring-black/10 transition-transform duration-500 hover:scale-105">
                <img src={n.src} alt={n.title} className="block h-[19rem] w-full object-cover" draggable={false} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 pt-8">
                  <p className="text-sm font-medium leading-tight text-white drop-shadow">{n.title}</p>
                  <p className="text-xs text-white/70 drop-shadow">{n.year}</p>
                </div>
              </div>
            )
            return (
              <div key={n.title} className="flex justify-center">
                {ctaUrl ? (
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="block w-full cursor-pointer">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8">
        <ActionButton href={ctaUrl}>{ctaText}</ActionButton>
        <p className="mt-4">
          <EncryptedText
            text={cryptic}
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
