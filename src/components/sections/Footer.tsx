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
  const rawItems =
    marqueeItems?.filter((item): item is MarqueeItem => item !== null && item !== undefined) || []
  const items = rawItems.length > 0 ? rawItems : defaultMarqueeItems

  // Render one item + separator
  const renderItem = (item: MarqueeItem, key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-3 pr-16">
      {item.icon?.asset && (
        <img
          src={urlFor(item.icon).width(32).height(32).url()}
          alt=""
          className="h-8 w-8 rounded object-cover"
        />
      )}
      <span className="text-sm text-black">{item.text}</span>
      <span className="pl-16 text-neutral-300">•</span>
    </div>
  )

  return (
    <footer id="coming-soon" className="overflow-hidden border-t border-black/20 bg-white py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-neutral-400">
        Coming Soon
      </p>
      {/* Ticker — flex w-max ensures the track is exactly content-wide;
          two identical copies + translateX(-50%) = seamless infinite loop */}
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-ticker">
          {items.map((item) => renderItem(item, `a-${item._key}`))}
          {items.map((item) => renderItem(item, `b-${item._key}`))}
        </div>
      </div>
    </footer>
  )
}
