"use client"

interface FooterProps {
  marqueeItems?: string[]
}

export function Footer({ marqueeItems }: FooterProps) {
  // Default items if none provided
  const items = marqueeItems && marqueeItems.length > 0
    ? marqueeItems
    : ["BB&J Real Estate LLC", "Neti Neti App"]

  // Create the marquee content with bullet separators
  const marqueeContent = items.flatMap((item, index) =>
    index < items.length - 1
      ? [item, "•"]
      : [item]
  )

  return (
    <footer className="overflow-hidden bg-blue-950 py-8">
      <div className="mb-6 text-center">
        <p className="text-sm uppercase tracking-widest text-blue-400">
          Coming Soon
        </p>
      </div>
      <div className="relative flex overflow-hidden">
        {/* First marquee track */}
        <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap">
          {marqueeContent.map((item, index) => (
            <span
              key={index}
              className={item === "•" ? "text-blue-400" : "text-lg text-white"}
            >
              {item}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {marqueeContent.map((item, index) => (
            <span
              key={`dup1-${index}`}
              className={item === "•" ? "text-blue-400" : "text-lg text-white"}
            >
              {item}
            </span>
          ))}
          {marqueeContent.map((item, index) => (
            <span
              key={`dup2-${index}`}
              className={item === "•" ? "text-blue-400" : "text-lg text-white"}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
