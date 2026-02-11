"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Mail,
  Globe,
} from "lucide-react"
import { AccordionItem as AccordionItemType, SocialLink } from "@/lib/types"

interface AboutSectionProps {
  accordionItems?: AccordionItemType[]
  socialLinks?: SocialLink[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  email: Mail,
  website: Globe,
}

// Default accordion items if none provided from Sanity
const defaultAccordionItems: AccordionItemType[] = [
  {
    _key: "1",
    title: "About Me",
    content: "Welcome to my personal website. Add your bio in Sanity Studio.",
  },
  {
    _key: "2",
    title: "Career Highlights",
    content: "Add your career highlights in Sanity Studio.",
  },
  {
    _key: "3",
    title: "Meditation & Hobbies",
    content: "Add your hobbies and interests in Sanity Studio.",
  },
  {
    _key: "4",
    title: "Contact Me",
    content: "Get in touch with me through the social links below.",
  },
]

export function AboutSection({ accordionItems, socialLinks }: AboutSectionProps) {
  const items = accordionItems && accordionItems.length > 0
    ? accordionItems
    : defaultAccordionItems

  return (
    <section
      id="about"
      className="min-h-screen bg-blue-950 px-4 py-20"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-5xl font-bold tracking-tight text-white md:text-6xl">
          About Me
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {items.map((item, index) => (
            <AccordionItem
              key={item._key}
              value={item._key}
              className="rounded-lg border border-blue-800 bg-blue-900/50 px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-lg font-semibold text-white">
                    {item.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2 text-blue-200">
                <p className="whitespace-pre-wrap leading-relaxed">{item.content}</p>
                {/* Show social links in Contact Me item */}
                {item.title.toLowerCase().includes("contact") && socialLinks && socialLinks.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {socialLinks.map((link) => {
                      const Icon = iconMap[link.platform] || Globe
                      return (
                        <a
                          key={link._key}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 transition-all hover:scale-110 hover:bg-blue-600"
                          aria-label={link.platform}
                        >
                          <Icon className="h-5 w-5 text-blue-200 transition-colors group-hover:text-white" />
                        </a>
                      )
                    })}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
