import { defineField, defineType, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  icon: HomeIcon,
  fields: [
    // Hero Section
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Background image for the hero section (will be flipped upside down)',
      options: {
        hotspot: true,
      },
    }),

    // Book Section
    defineField({
      name: 'bookTitle',
      title: 'Book Section Title',
      type: 'string',
      description: 'Title for the Book section (e.g., "My Book")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bookDescription',
      title: 'Book Section Description',
      type: 'text',
      description: 'Description text for the Book section',
      rows: 4,
    }),
    defineField({
      name: 'bookImage',
      title: 'Book Cover Image',
      type: 'image',
      description: 'Book cover image',
      options: {
        hotspot: true,
      },
    }),

    // NFT Gallery Section
    defineField({
      name: 'nftGallery',
      title: 'NFT Gallery',
      type: 'array',
      description: 'Images for the NFT grid gallery',
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
              description: 'Year of the NFT (e.g., "2025")',
              initialValue: '2025',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
          },
        }),
      ],
    }),

    // About Me Section - Accordion Items
    defineField({
      name: 'aboutAccordion',
      title: 'About Me Accordion Items',
      type: 'array',
      description: 'Accordion sections for the About Me page',
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
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        }),
      ],
    }),

    // Social Links (moved from Contact, now in About accordion)
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Your social media links (displayed in About section)',
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
      description: 'Text items for the scrolling footer marquee',
      of: [{ type: 'string' }],
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
