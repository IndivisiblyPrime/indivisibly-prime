import { defineField, defineType, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'navigation', title: 'Navigation' },
    { name: 'hero', title: 'Hero Section' },
    { name: 'book', title: 'Book Section' },
    { name: 'nft', title: 'NFT Gallery' },
    { name: 'cta', title: 'CTA Section' },
    { name: 'about', title: 'About Me' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // Navigation Items
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
                  { title: 'Book', value: 'book' },
                  { title: 'NFTs', value: 'nfts' },
                  { title: 'About Me', value: 'about' },
                  { title: 'Coming Soon (Footer)', value: 'coming-soon' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'target',
            },
          },
        }),
      ],
    }),

    // Hero Section
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      description: 'Background image for the hero section (used if no video is set)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      group: 'hero',
      description: 'Background video for the hero section (MP4 recommended). Takes priority over image.',
      options: {
        accept: 'video/*',
      },
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Video URL (External)',
      type: 'url',
      group: 'hero',
      description: 'External video URL (e.g., from a CDN). Used if no uploaded video.',
    }),

    // Book Section
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
      options: {
        hotspot: true,
      },
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

    // NFT Gallery Section
    defineField({
      name: 'nftGallery',
      title: 'NFT Gallery',
      type: 'array',
      group: 'nft',
      description: 'Images for the NFT grid gallery (images will preserve their aspect ratio)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nftItem',
          title: 'NFT Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'NFT name (bottom left)',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility',
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              description: 'Year of the NFT (bottom left, below title)',
              initialValue: '2025',
            }),
            defineField({
              name: 'collection',
              title: 'Collection / Portfolio Name',
              type: 'string',
              description: 'Collection name (bottom right)',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'collection',
              media: 'image',
            },
          },
        }),
      ],
    }),

    // CTA Section (below NFTs)
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
      description: 'Text that will animate with encryption effect',
      initialValue: 'Welcome to the Matrix, Neo.',
    }),

    // About Me Section - Accordion Items
    defineField({
      name: 'aboutAccordion',
      title: 'About Me Accordion Items',
      type: 'array',
      group: 'about',
      description: 'Accordion sections for the About Me page. Add "showSocialLinks: true" to show social links in that item.',
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
              name: 'content',
              title: 'Content',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'showSocialLinks',
              title: 'Show Social Links',
              type: 'boolean',
              description: 'Display social links in this accordion item',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              showLinks: 'showSocialLinks',
            },
            prepare({ title, showLinks }) {
              return {
                title,
                subtitle: showLinks ? '(includes social links)' : '',
              }
            },
          },
        }),
      ],
    }),

    // Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'about',
      description: 'Your social media links (displayed in accordion item with "Show Social Links" enabled)',
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
                rule.required().uri({
                  scheme: ['http', 'https', 'mailto'],
                }),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),

    // Footer Marquee Items
    defineField({
      name: 'footerMarqueeItems',
      title: 'Footer Marquee Items',
      type: 'array',
      group: 'footer',
      description: 'Items for the scrolling footer marquee with optional icons',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marqueeItem',
          title: 'Marquee Item',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Optional icon to display alongside the text',
              options: {
                hotspot: true,
              },
            }),
          ],
          preview: {
            select: {
              title: 'text',
              media: 'icon',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
      }
    },
  },
})
