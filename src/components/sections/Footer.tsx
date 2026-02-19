"use client"

import { urlFor } from "@/sanity/lib/image"
import { MarqueeItem } from "@/lib/types"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

interface FooterProps {
  marqueeItems?: MarqueeItem[]
}

// Default items if none provided
const defaultMarqueeItems: MarqueeItem[] = [
  { _key: "1", text: "BB&J Real Estate LLC" },
  { _key: "2", text: "Neti Neti App" },
]

export function Footer({ marqueeItems }: FooterProps) {
  // Filter out any null/undefined items and use defaults if empty
  const rawItems = marqueeItems?.filter((item): item is MarqueeItem => item !== null && item !== undefined) || []
  const items = rawItems.length > 0 ? rawItems : defaultMarqueeItems

  const renderItem = (item: MarqueeItem, keyPrefix: string = "") => (
    <div key={`${keyPrefix}${item._key}`} className="flex items-center gap-3">
      {item.icon && item.icon.asset && (
        <img
          src={urlFor(item.icon).width(32).height(32).url()}
          alt=""
          className="h-8 w-8 rounded object-cover"
        />
      )}
      <span className="text-lg text-white">{item.text}</span>
    </div>
  )

  return (
    <footer id="coming-soon" className="relative overflow-hidden bg-neutral-900 py-12">
      <ShootingStars className="absolute inset-0 z-0" />
      <StarsBackground className="absolute inset-0 z-0" />

      <div className="relative z-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-neutral-400">
            Coming Soon
          </p>
        </div>
        <div className="relative flex overflow-hidden">
          {/* Marquee track — 2 identical copies so translateX(-50%) loops seamlessly */}
          <div className="animate-marquee flex shrink-0 items-center gap-12 whitespace-nowrap">
            {items.map((item) => renderItem(item))}
            <span className="text-neutral-500">•</span>
            {items.map((item) => renderItem(item, "dup-"))}
            <span className="text-neutral-500">•</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
