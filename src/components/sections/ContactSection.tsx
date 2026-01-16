import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Youtube,
  Mail,
  Globe,
} from "lucide-react"
import { SocialLink } from "@/lib/types"

interface ContactSectionProps {
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

export function ContactSection({ socialLinks }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-4 py-20"
    >
      <h2 className="mb-12 text-5xl font-bold tracking-tight text-white md:text-6xl">
        Get in Touch
      </h2>

      {socialLinks && socialLinks.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.platform] || Globe
            return (
              <a
                key={link._key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 transition-all hover:scale-110 hover:bg-blue-600"
                aria-label={link.platform}
              >
                <Icon className="h-7 w-7 text-neutral-300 transition-colors group-hover:text-white" />
              </a>
            )
          })}
        </div>
      ) : (
        <p className="text-neutral-500">Add social links in Sanity Studio</p>
      )}
    </section>
  )
}
