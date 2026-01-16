import { defineField, defineType, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  icon: HomeIcon,
  fields: [
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

    // NFT Gallery Section
    defineField({
      name: 'nftGallery',
      title: 'NFT Gallery',
      type: 'array',
      description: 'Images for the NFT carousel gallery',
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

    // About Me Section
    defineField({
      name: 'aboutPhoto',
      title: 'About Me Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'aboutText',
      title: 'About Me Text',
      type: 'text',
      description: 'Your bio or about me text',
      rows: 6,
    }),

    // Contact Section - Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Your social media links',
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
      }
    },
  },
})
