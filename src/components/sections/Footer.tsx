"use client"

import { urlFor } from "@/sanity/lib/image"
import { MarqueeItem } from "@/lib/types"

interface FooterProps {
  marqueeItems?: MarqueeItem[]
}

const defaultMarqueeItems: MarqueeItem[] = [
  { _key: "1", text: "BB&J Real Estate LLC" },
  { _key: "2", text: "Neti Neti App" },
]

export function Footer({ marqueeItems }: FooterProps) {
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
      <span className="text-sm text-black">{item.text}</span>
    </div>
  )

  return (
    <footer id="coming-soon" className="overflow-hidden border-t border-black/20 bg-white py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-neutral-400">
        Coming Soon
      </p>
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-flex gap-16">
          {items.map((item) => renderItem(item))}
          <span className="text-neutral-400">•</span>
          {items.map((item) => renderItem(item, "dup-"))}
          <span className="text-neutral-400">•</span>
        </div>
      </div>
    </footer>
  )
}
