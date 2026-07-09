import { defineField, defineType, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'site', title: 'Site Settings' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'hero', title: 'Hero Section' },
    { name: 'book', title: 'Book Section' },
    { name: 'app', title: 'App Section' },
    { name: 'nft', title: 'NFT Gallery' },
    { name: 'cta', title: 'CTA Section' },
    { name: 'about', title: 'About Me' },
    { name: 'comingSoon', title: 'Coming Soon' },
  ],
  fields: [
    // ─── Site Settings ───────────────────────────────────────────────────────
    defineField({
      name: 'siteTitle',
      title: 'Browser Tab Title',
      type: 'string',
      group: 'site',
      description: 'Text shown in the browser tab (e.g. "Jack Harvey")',
      initialValue: 'Jack Harvey',
    }),
    defineField({
      name: 'siteFavicon',
      title: 'Favicon',
      type: 'image',
      group: 'site',
      description: 'Icon shown in the browser tab. Use a square image (e.g. 32×32 or 64×64 px).',
      options: { hotspot: false },
    }),

    // ─── Navigation Items ────────────────────────────────────────────────────
    defineField({
      name: 'navItems',
      title: 'Navigation Items',
      type: 'array',
      group: 'navigation',
      description: 'Customize the navigation menu items',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          title: 'Nav Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'target',
              title: 'Target Section',
              type: 'string',
              options: {
                list: [
                  { title: 'Home (Hero)', value: 'hero' },
                  { title: '1. Book', value: 'book' },
                  { title: '2. App', value: 'app' },
                  { title: '3. NFTs', value: 'nfts' },
                  { title: 'About Me', value: 'about' },
                  { title: 'Contact Me', value: 'contact' },
                  { title: 'Coming Soon (Panel)', value: 'comingsoon' },
                  { title: 'Coming Soon (Footer, legacy)', value: 'coming-soon' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'target' },
          },
        }),
      ],
    }),

    // ─── Hero Section ────────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      description: 'Background image for the hero section (used if no video is set)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      group: 'hero',
      description: 'Background video for the hero section (MP4 recommended). Takes priority over image.',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Video URL (External)',
      type: 'url',
      group: 'hero',
      description: 'External video URL (e.g., from a CDN). Used if no uploaded video.',
    }),
    defineField({
      name: 'heroIntroVideo',
      title: 'Intro Video (plays once before loop)',
      type: 'file',
      group: 'hero',
      description: 'Short clip (e.g. 10s) that plays once when the page loads, then switches to the looping background video.',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroBoredomVideo',
      title: '"Bored?" Video',
      type: 'file',
      group: 'hero',
      description: 'Video that plays when the visitor clicks the "Bored?" button (~45–60s clip).',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroBoredomButtonText',
      title: '"Bored?" Button Text',
      type: 'string',
      group: 'hero',
      description: 'Label on the button shown in the bottom-right of the hero.',
      initialValue: 'Bored?',
    }),

    // ─── Book Section ────────────────────────────────────────────────────────
    defineField({
      name: 'bookTitle',
      title: 'Book Section Title',
      type: 'string',
      group: 'book',
      description: 'Title displayed above the book (e.g., "The Greatest Wisdom of Zen")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bookDescription',
      title: 'Book Section Description',
      type: 'text',
      group: 'book',
      description: 'Description text for the Book section',
      rows: 4,
    }),
    defineField({
      name: 'bookImage',
      title: 'Book Cover Image',
      type: 'image',
      group: 'book',
      description: 'Book cover image (will preserve aspect ratio)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bookButtonText',
      title: 'Book Button Text',
      type: 'string',
      group: 'book',
      description: 'Text for the button below the book image',
      initialValue: 'Buy / View More Details',
    }),
    defineField({
      name: 'bookButtonUrl',
      title: 'Book Button URL',
      type: 'url',
      group: 'book',
      description: 'Link for the book button (optional)',
    }),

    // ─── App Section ─────────────────────────────────────────────────────────
    defineField({
      name: 'appTitle',
      title: 'App Section Title',
      type: 'string',
      group: 'app',
      description: 'Title shown in the "2. App" panel (e.g. "My App Name")',
    }),
    defineField({
      name: 'appSubtitle',
      title: 'App Section Description',
      type: 'text',
      group: 'app',
      description: 'Description / subtitle shown below the title',
      rows: 4,
    }),
    defineField({
      name: 'appButtonText',
      title: 'App Button Text',
      type: 'string',
      group: 'app',
      description: 'Text for the app download/details button',
      initialValue: 'Download / View More',
    }),
    defineField({
      name: 'appButtonUrl',
      title: 'App Button URL',
      type: 'url',
      group: 'app',
      description: 'Link for the app button (optional)',
    }),
    defineField({
      name: 'appImage',
      title: 'App Screenshot / Icon',
      type: 'image',
      group: 'app',
      description: 'Portrait-orientation screenshot (iPhone-sized) or app icon.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'appGongSound',
      title: 'Gong Sound',
      type: 'file',
      group: 'app',
      description: 'Audio file (MP3/WAV) that plays when the "2. App" panel is opened.',
      options: { accept: 'audio/*' },
    }),

    // ─── NFT Gallery Section ─────────────────────────────────────────────────
    defineField({
      name: 'nftSectionTitle',
      title: 'Section Heading',
      type: 'string',
      group: 'nft',
      description: 'Large heading at the top of this section (e.g. "NFTs" or "Art")',
      initialValue: 'NFTs',
    }),
    defineField({
      name: 'nftSectionSubtitle',
      title: 'Section Subtitle',
      type: 'string',
      group: 'nft',
      description: 'Smaller line below the heading (e.g. "Highlights from XYZ collection")',
    }),
    defineField({
      name: 'landscapeGallery',
      title: 'Landscape Paintings',
      type: 'array',
      group: 'nft',
      description: 'Wide/landscape images shown above the portrait grid. Use for paintings wider than they are tall.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'landscapeItem',
          title: 'Landscape Item',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'year', title: 'Year', type: 'string', initialValue: '2025' }),
            defineField({ name: 'collection', title: 'Collection / Portfolio Name', type: 'string' }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'url',
              description: 'Optional — clicking this image opens this URL. Falls back to the CTA Button URL if left blank.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'collection', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'nftGallery',
      title: 'Portrait Gallery',
      type: 'array',
      group: 'nft',
      description: 'Portrait/square images shown in the 2-column grid.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nftItem',
          title: 'NFT Item',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'NFT name (bottom left)' }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'alt', title: 'Alt Text', type: 'string', description: 'Alternative text for accessibility' }),
            defineField({ name: 'year', title: 'Year', type: 'string', description: 'Year of the NFT (bottom left, below title)', initialValue: '2025' }),
            defineField({ name: 'collection', title: 'Collection / Portfolio Name', type: 'string', description: 'Collection name (bottom right)' }),
            defineField({
              name: 'url',
              title: 'Link URL',
              type: 'url',
              description: 'Optional — clicking this image opens this URL. Falls back to the CTA Button URL if left blank.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'collection', media: 'image' },
          },
        }),
      ],
    }),

    // ─── CTA Section ─────────────────────────────────────────────────────────
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'cta',
      description: 'Text for the gradient button',
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA Button URL',
      type: 'url',
      group: 'cta',
      description: 'External link for the CTA button',
    }),
    defineField({
      name: 'encryptedText',
      title: 'Encrypted Text',
      type: 'string',
      group: 'cta',
      description: 'Text that decrypts when you hover over it',
      initialValue: 'Welcome to the Matrix, Neo.',
    }),

    // ─── About Me Section ────────────────────────────────────────────────────
    defineField({
      name: 'aboutAccordion',
      title: 'About Me Accordion Items',
      type: 'array',
      group: 'about',
      description: 'Accordion sections for the About Me page.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'accordionItem',
          title: 'Accordion Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'itemType',
              title: 'Item Type',
              type: 'string',
              initialValue: 'text',
              options: {
                list: [
                  { title: 'Text (plain content)', value: 'text' },
                  { title: 'Experience (job cards with timeline)', value: 'experience' },
                  { title: 'Logo + Freeform (cards without timeline)', value: 'logoFreeform' },
                ],
                layout: 'radio',
              },
              description: 'Choose how this accordion item renders when expanded.',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'text',
              rows: 4,
              hidden: ({ parent }) =>
                parent?.itemType === 'experience' ||
                parent?.itemType === 'logoFreeform',
              description: 'Text content shown when expanded (for "Text" type only).',
            }),
            defineField({
              name: 'showSocialLinks',
              title: 'Show Social Links',
              type: 'boolean',
              description: 'Display social links below the content',
              initialValue: false,
              hidden: true,
            }),
            defineField({
              name: 'experienceEntries',
              title: 'Experience Entries',
              type: 'array',
              hidden: ({ parent }) => parent?.itemType !== 'experience',
              description: 'Add one entry per job role.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'experienceEntry',
                  title: 'Experience Entry',
                  fields: [
                    defineField({
                      name: 'logo',
                      title: 'Company Logo',
                      type: 'image',
                      description: 'Square company logo/icon',
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: 'jobTitle',
                      title: 'Job Title',
                      type: 'string',
                      validation: (rule) => rule.required(),
                      description: 'e.g. "Full Stack Software Engineer – (Machine Learning)"',
                    }),
                    defineField({
                      name: 'dateRange',
                      title: 'Date Range',
                      type: 'string',
                      description: 'e.g. "Mar 2023 – now"',
                    }),
                    defineField({
                      name: 'company',
                      title: 'Company Name',
                      type: 'string',
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 4,
                      description: 'Freeform text shown below the job title. Use newlines however you like.',
                    }),
                  ],
                  preview: {
                    select: { title: 'jobTitle', subtitle: 'company' },
                  },
                }),
              ],
            }),
            defineField({
              name: 'logoFreeformEntries',
              title: 'Logo + Freeform Entries',
              type: 'array',
              hidden: ({ parent }) => parent?.itemType !== 'logoFreeform',
              description: 'Each entry shows an optional logo next to freeform text. No timeline line.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'logoFreeformEntry',
                  title: 'Entry',
                  fields: [
                    defineField({
                      name: 'logo',
                      title: 'Logo (optional)',
                      type: 'image',
                      description: 'Optional square logo/icon',
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'dateRange',
                      title: 'Date Range',
                      type: 'string',
                      description: 'e.g. "2020 – present"',
                    }),
                    defineField({
                      name: 'subtitle',
                      title: 'Subtitle',
                      type: 'string',
                      description: 'Optional subtitle line below the title',
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 4,
                      description: 'Freeform text — write however you like.',
                    }),
                  ],
                  preview: {
                    select: { title: 'title', subtitle: 'subtitle' },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title', itemType: 'itemType' },
            prepare({ title, itemType }) {
              const labels: Record<string, string> = {
                experience: 'Experience cards (timeline)',
                logoFreeform: 'Logo + Freeform cards',
                text: '',
              }
              return {
                title,
                subtitle: labels[itemType] || '',
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'about',
      description: 'Direct Instagram profile URL (used as a fallback if not set in Social Links)',
    }),
    defineField({
      name: 'aboutIntroText',
      title: 'About Me Introduction Text',
      type: 'text',
      group: 'about',
      rows: 3,
      description: 'Short text shown below the social media icons in the About panel',
    }),

    // Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'about',
      description: 'Social media links (shown in accordion items with "Show Social Links" enabled)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Email', value: 'email' },
                  { title: 'Website', value: 'website' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        }),
      ],
    }),

    // ─── Coming Soon Section ──────────────────────────────────────────────────
    defineField({
      name: 'comingSoonTagline',
      title: 'Mailing List Tagline',
      type: 'string',
      group: 'comingSoon',
      description: 'Small parenthetical text shown below the "Join the mailing list" signup form (e.g. "Zero spam, updates only")',
      initialValue: 'Zero spam and only a singular email when a new project has launched',
    }),
    defineField({
      name: 'comingSoonItems',
      title: 'Coming Soon Items',
      type: 'array',
      group: 'comingSoon',
      description: 'Logo + freeform cards shown in the Coming Soon accordion panel',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'comingSoonEntry',
          title: 'Entry',
          fields: [
            defineField({
              name: 'logo',
              title: 'Logo (optional)',
              type: 'image',
              description: 'Optional square logo/icon',
              options: { hotspot: true },
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'dateRange',
              title: 'Date Range',
              type: 'string',
              description: 'e.g. "2020 – present"',
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
              description: 'Optional subtitle line below the title',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              description: 'Freeform text — write however you like.',
            }),
            defineField({
              name: 'url',
              title: 'Project URL',
              type: 'url',
              description: 'Optional — makes the card title clickable (cursor changes to pointer). Leave blank for no link.',
            }),
            defineField({
              name: 'exploreMoreUrl',
              title: '"Explore More" Button URL',
              type: 'url',
              description: 'Optional — shows an "Explore More" button below the description that links here.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'subtitle' },
          },
        }),
      ],
    }),

  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    },
  },
})
