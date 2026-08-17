import { defineField, defineType, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

/**
 * Two surfaces read this document:
 *   • The Desk  — jackharvey.me  (the live homepage, and `/desk`)
 *   • Classic   — jackharvey.me/classic  (the previous design, kept as an archive)
 *
 * They overlap but are not the same, which used to make editing a guessing game.
 * So every field below is tagged with where it actually lands, and the tabs are
 * cut to match the Desk's cards. Rules:
 *
 *   1. Tabs 1–6 are all Desk. If a field is in one of them, editing it changes
 *      the live homepage. The marker tells you whether it ALSO changes Classic.
 *   2. Everything that only touches Classic lives in the last tab. You can ignore
 *      that tab entirely and never affect the live site.
 *
 * When adding a field, tag it — and remember HOMEPAGE_QUERY in
 * src/sanity/lib/homepage.ts must project it or it arrives `undefined`.
 */
const DESK = '● Desk only —'
const BOTH = '◆ Desk + Classic —'
const CLASSIC = '○ Classic only —'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'The Desk — Homepage',
  type: 'document',
  icon: HomeIcon,

  // Tabs mirror the Desk in the order a visitor meets it, then site chrome,
  // then the Classic-only quarantine last.
  groups: [
    { name: 'entry', title: 'Entry Cover', default: true },
    { name: 'app', title: '1 · App' },
    { name: 'book', title: '2 · Book' },
    { name: 'nft', title: '3 · NFTs' },
    { name: 'about', title: 'About' },
    { name: 'site', title: 'Site & Tab' },
    { name: 'classic', title: '○ Classic only' },
  ],

  // Collapsed sections keep the Classic tab tidy — it exists to be ignored.
  fieldsets: [
    {
      name: 'classicHero',
      title: 'Hero — background video & "Bored?" button',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'classicNav',
      title: 'Navigation menu',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'classicComingSoon',
      title: 'Coming Soon cards',
      options: { collapsible: true, collapsed: true },
    },
  ],

  fields: [
    // ═══ ENTRY COVER ════════════════════════════════════════════════════════
    defineField({
      name: 'entryCoverText',
      title: 'Cover Text',
      type: 'string',
      group: 'entry',
      description: `${DESK} The entry cover's line, exactly as typed — nothing is added to it. Leave blank to fall back to "<Your Name>'s Portfolio".`,
    }),
    defineField({
      name: 'entryTitle',
      title: 'Your Name',
      type: 'string',
      group: 'entry',
      description: `${DESK} Your name on its own. Used as the heading on the About card, and as the fallback for Cover Text above.`,
      initialValue: 'Jack Harvey',
    }),

    // ═══ 1 · APP CARD ═══════════════════════════════════════════════════════
    defineField({
      name: 'appTitle',
      title: 'App Name',
      type: 'string',
      group: 'app',
      description: `${BOTH} Big heading at the top of the App card. Falls back to "Bonsai" if blank.`,
    }),
    defineField({
      name: 'appTagline',
      title: 'App Tagline',
      type: 'string',
      group: 'app',
      description: `${DESK} Small line between the name and the description. Optional and has no fallback — leave blank and no line appears (useful when the App Name already says it).`,
    }),
    defineField({
      name: 'appSubtitle',
      title: 'App Description',
      type: 'text',
      group: 'app',
      rows: 4,
      description: `${BOTH} Paragraph under the title.`,
    }),
    defineField({
      name: 'appImages',
      title: 'App Screenshots (carousel)',
      type: 'array',
      group: 'app',
      description: `${DESK} 3–7 portrait screenshots that visitors flip through inside the iPhone mockup. Feed it tall 19.5:9 shots or the sides get cropped. Whenever this has at least one image it wins over the single screenshot below.`,
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'appImage',
      title: 'App Screenshot (single, fallback)',
      type: 'image',
      group: 'app',
      description: `${BOTH} Only used on the Desk when the carousel above is empty. Classic always uses this one.`,
      options: { hotspot: true },
    }),
    defineField({
      name: 'appButtonText',
      title: 'Download Button — Text',
      type: 'string',
      group: 'app',
      description: `${BOTH} Falls back to "Download Now".`,
      initialValue: 'Download / View More',
    }),
    defineField({
      name: 'appButtonUrl',
      title: 'Download Button — URL',
      type: 'url',
      group: 'app',
      description: `${BOTH} Where the download button points.`,
    }),
    defineField({
      name: 'appWebsiteButtonText',
      title: 'Website Button — Text',
      type: 'string',
      group: 'app',
      description: `${DESK} Label for the second, outlined button.`,
      initialValue: 'Visit Website',
    }),
    defineField({
      name: 'appWebsiteButtonUrl',
      title: 'Website Button — URL',
      type: 'url',
      group: 'app',
      description: `${DESK} The whole button is hidden until you fill this in — that is why you currently see only one button on the App card.`,
    }),
    defineField({
      name: 'appGongSound',
      title: 'Gong Sound',
      type: 'file',
      group: 'app',
      description: `${BOTH} Plays once when the App card is opened. Leave empty for silence. A browser may still refuse to play it if the visitor hasn't interacted with the page yet.`,
      options: { accept: 'audio/*' },
    }),

    // ═══ 2 · BOOK CARD ══════════════════════════════════════════════════════
    defineField({
      name: 'bookTitle',
      title: 'Book Title',
      type: 'string',
      group: 'book',
      description: `${BOTH} Heading on the Book card.`,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bookSubtitle',
      title: 'Book Subtitle',
      type: 'string',
      group: 'book',
      description: `${DESK} Small line under the title. No fallback — leave blank and nothing renders.`,
    }),
    defineField({
      name: 'bookDescription',
      title: 'Book Description',
      type: 'text',
      group: 'book',
      rows: 4,
      description: `${BOTH} Paragraph beside the cover.`,
    }),
    defineField({
      name: 'bookImage',
      title: 'Book Cover Image',
      type: 'image',
      group: 'book',
      description: `${BOTH} On the Desk this is deliberately cropped to a tall 3:4 so a landscape photo reads as a book. Set the hotspot to control which part survives the crop.`,
      options: { hotspot: true },
    }),
    defineField({
      name: 'bookButtonText',
      title: 'Book Button — Text',
      type: 'string',
      group: 'book',
      description: `${BOTH} Falls back to "More Details / Buy".`,
      initialValue: 'Buy / View More Details',
    }),
    defineField({
      name: 'bookButtonUrl',
      title: 'Book Button — URL',
      type: 'url',
      group: 'book',
      description: `${BOTH} Where the book button points.`,
    }),

    // ═══ 3 · NFT CARD ═══════════════════════════════════════════════════════
    defineField({
      name: 'nftSectionTitle',
      title: 'NFT Card Heading',
      type: 'string',
      group: 'nft',
      description: `${DESK} ⚠️ Heads up: the exact word "NFTs" is treated as "not set" and the card shows "The Lost Library of Alexandria" instead. Type anything else and it is used verbatim.`,
      initialValue: 'NFTs',
    }),
    defineField({
      name: 'nftSectionSubtitle',
      title: 'NFT Card Subtitle',
      type: 'string',
      group: 'nft',
      description: `${BOTH} Smaller line below the heading.`,
    }),
    defineField({
      name: 'landscapeGallery',
      title: 'Landscape Paintings',
      type: 'array',
      group: 'nft',
      description: `${BOTH} Wide images. The Desk card shows these interleaved with the portraits — portrait 1, then landscape 1, then portrait 2 — so ordering across both lists matters. Images are never cropped.`,
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
              description: 'Optional — clicking this image opens this URL. Falls back to the CTA Button URL below.',
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
      description: `${BOTH} Portrait/square images. The Desk card uses the first two, either side of the first landscape painting.`,
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
              description: 'Optional — clicking this image opens this URL. Falls back to the CTA Button URL below.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'collection', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'Gallery Button — Text',
      type: 'string',
      group: 'nft',
      description: `${BOTH} Button at the bottom of the NFT card. Falls back to "All NFT Galleries".`,
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'Gallery Button — URL',
      type: 'url',
      group: 'nft',
      description: `${BOTH} Also the default destination for any gallery image that has no Link URL of its own.`,
    }),
    defineField({
      name: 'encryptedText',
      title: 'Encrypted Text',
      type: 'string',
      group: 'nft',
      description: `${BOTH} Scrambled line on the NFT card that decodes when you hover it.`,
      initialValue: 'Welcome to the Matrix, Neo.',
    }),

    // ═══ ABOUT CARD ═════════════════════════════════════════════════════════
    defineField({
      name: 'aboutImage',
      title: 'Your Photo',
      type: 'image',
      group: 'about',
      description: `${DESK} Sits in the left column of the About card, with your social links and email button beneath it.`,
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutTagline',
      title: 'Tagline (under your name)',
      type: 'string',
      group: 'about',
      description: `${DESK} One short line, e.g. "Builder · Investor · Seeker".`,
      initialValue: 'Builder · Investor · Lifelong Meditator',
    }),
    defineField({
      name: 'aboutIntroText',
      title: 'Intro Text',
      type: 'text',
      group: 'about',
      rows: 3,
      description: `${BOTH} Short line under your name, e.g. "Email me".`,
    }),
    defineField({
      name: 'aboutAccordion',
      title: 'Accordion Sections',
      type: 'array',
      group: 'about',
      description: `${BOTH} Expandable sections in the right column. Pick a layout per section below.`,
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
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'about',
      description: `${BOTH} Icon buttons under your photo. The Desk renders LinkedIn and Instagram.`,
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
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'about',
      description: `${BOTH} Fallback used only when there is no Instagram entry in Social Links above.`,
    }),
    defineField({
      name: 'comingSoonTagline',
      title: 'Mailing List Tagline',
      type: 'string',
      group: 'about',
      description: `${BOTH} Small print under the "Join the mailing list" form at the bottom of the About card.`,
      initialValue: 'Zero spam and only a singular email when a new project has launched',
    }),

    // ═══ SITE & BROWSER TAB ═════════════════════════════════════════════════
    defineField({
      name: 'siteTitle',
      title: 'Browser Tab Title',
      type: 'string',
      group: 'site',
      description: `${BOTH} Shown in the browser tab, and used as the name if someone adds the site to their phone's home screen.`,
      initialValue: 'Jack Harvey',
    }),
    defineField({
      name: 'siteFavicon',
      title: 'Favicon / App Icon',
      type: 'image',
      group: 'site',
      description: `${BOTH} Square image, 512×512 or larger. Used for the browser tab, the iOS home-screen icon, and the Android install icon. Avoid transparency — iOS fills transparent pixels with black.`,
      options: { hotspot: false },
    }),

    // ═══ CLASSIC ONLY — ignore this tab ═════════════════════════════════════
    // Nothing below renders on jackharvey.me. Kept so /classic keeps working and
    // so the existing values (hero video, nav, coming-soon cards) aren't lost.
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'classic',
      fieldset: 'classicHero',
      description: `${CLASSIC} Used only if no video is set.`,
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      group: 'classic',
      fieldset: 'classicHero',
      description: `${CLASSIC} Looping background video. Takes priority over the image.`,
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Video URL (External)',
      type: 'url',
      group: 'classic',
      fieldset: 'classicHero',
      description: `${CLASSIC} External video URL, used if nothing is uploaded above.`,
    }),
    defineField({
      name: 'heroIntroVideo',
      title: 'Intro Video (plays once before loop)',
      type: 'file',
      group: 'classic',
      fieldset: 'classicHero',
      description: `${CLASSIC} Short clip that plays once on load, then hands over to the looping video.`,
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroBoredomVideo',
      title: '"Bored?" Video',
      type: 'file',
      group: 'classic',
      fieldset: 'classicHero',
      description: `${CLASSIC} Plays when the visitor clicks the "Bored?" button.`,
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroBoredomButtonText',
      title: '"Bored?" Button Text',
      type: 'string',
      group: 'classic',
      fieldset: 'classicHero',
      description: `${CLASSIC} Label on the button in the bottom-right of the hero.`,
      initialValue: 'Bored?',
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation Items',
      type: 'array',
      group: 'classic',
      fieldset: 'classicNav',
      description: `${CLASSIC} The Desk has no nav bar — you click objects on the desk instead.`,
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
    defineField({
      name: 'comingSoonItems',
      title: 'Coming Soon Items',
      type: 'array',
      group: 'classic',
      fieldset: 'classicComingSoon',
      description: `${CLASSIC} Project cards in the Coming Soon panel. The Desk shows no such panel — only the Mailing List Tagline on the About tab survives.`,
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
              description: 'Optional — makes the card title clickable. Leave blank for no link.',
            }),
            defineField({
              name: 'exploreMoreUrl',
              title: '"Explore More" Button URL',
              type: 'url',
              description: 'Optional — shows an "Explore More" button below the description.',
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
      return { title: 'The Desk — Homepage' }
    },
  },
})
