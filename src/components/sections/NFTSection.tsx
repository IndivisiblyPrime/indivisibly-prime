"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { urlFor } from "@/sanity/lib/image"
import { NFTItem } from "@/lib/types"

interface NFTSectionProps {
  nfts: NFTItem[]
}

export function NFTSection({ nfts }: NFTSectionProps) {
  if (!nfts || nfts.length === 0) {
    return (
      <section
        id="nfts"
        className="flex min-h-screen items-center justify-center bg-neutral-100"
      >
        <div className="text-center">
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
            NFTs
          </h2>
          <p className="text-neutral-500">Add NFT images in Sanity Studio</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="nfts"
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 px-4 py-20"
    >
      <h2 className="mb-12 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
        NFTs
      </h2>
      <div className="w-full max-w-5xl px-12">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {nfts.map((nft) => (
              <CarouselItem
                key={nft._key}
                className="basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:scale-105">
                    {nft.image ? (
                      <img
                        src={urlFor(nft.image).width(600).height(600).url()}
                        alt={nft.alt || nft.title || "NFT"}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-square w-full items-center justify-center bg-neutral-200">
                        <span className="text-neutral-400">Image missing</span>
                      </div>
                    )}
                    {nft.title && (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {nft.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  )
}
