"use client"

import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

interface BookSectionProps {
  title: string
  description?: string
}

export function BookSection({ title, description }: BookSectionProps) {
  return (
    <section
      id="book"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950"
    >
      <StarsBackground className="z-0" />
      <ShootingStars
        className="z-0"
        starColor="#ffffff"
        trailColor="#3b82f6"
      />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-8 text-5xl font-bold tracking-tight text-white md:text-6xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-300 md:text-xl">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
