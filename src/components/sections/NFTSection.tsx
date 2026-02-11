"use client"

import { urlFor } from "@/sanity/lib/image"
import { NFTItem } from "@/lib/types"

interface NFTSectionProps {
  nfts: NFTItem[]
}

// Placeholder NFT items for demo
const placeholderNFTs = [
  { _key: "1", title: "NFT #1", year: "2025" },
  { _key: "2", title: "NFT #2", year: "2025" },
  { _key: "3", title: "NFT #3", year: "2025" },
  { _key: "4", title: "NFT #4", year: "2025" },
]

export function NFTSection({ nfts }: NFTSectionProps) {
  const hasRealNFTs = nfts && nfts.length > 0
  const displayItems = hasRealNFTs ? nfts : placeholderNFTs

  return (
    <section
      id="nfts"
      className="min-h-screen bg-blue-950 px-4 py-20"
    >
      <h2 className="mb-12 text-center text-5xl font-bold tracking-tight text-white md:text-6xl">
        NFTs
      </h2>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {displayItems.map((nft) => (
          <div
            key={nft._key}
            className="group relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105"
          >
            {hasRealNFTs && (nft as NFTItem).image ? (
              <img
                src={urlFor((nft as NFTItem).image).width(800).height(800).url()}
                alt={(nft as NFTItem).alt || nft.title || "NFT"}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-blue-800 to-blue-900">
                <span className="text-6xl text-blue-600/50">NFT</span>
              </div>
            )}
            {/* Overlay with title and year */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="text-left">
                {nft.title && (
                  <h3 className="text-lg font-semibold text-white">
                    {nft.title}
                  </h3>
                )}
                {nft.year && (
                  <p className="text-sm text-white/70">{nft.year}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!hasRealNFTs && (
        <p className="mt-8 text-center text-blue-400">
          Add your NFT images in Sanity Studio
        </p>
      )}
    </section>
  )
}
