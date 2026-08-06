import type {StructureResolver} from 'sanity/structure'
import {ArchiveIcon, HomeIcon} from '@sanity/icons'

// The one and only homepageSettings document. Hard-coding it makes the sidebar
// open the form directly instead of a one-row list you have to click through.
const HOMEPAGE_ID = '2d3fb790-8d0b-442f-b91e-362a31cf9ad3'

// NOTE: this list is explicit, not S.documentTypeListItems(). A new document type
// will NOT show up in the Studio until it is added here.
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('homepage')
        .title('The Desk — Homepage')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepageSettings')
            .documentId(HOMEPAGE_ID)
            .title('The Desk — Homepage')
        ),

      S.divider(),

      // Out of the way, but still reachable. `heroSection` is a leftover type that
      // nothing queries — it lives here so it stops cluttering the main list.
      S.listItem()
        .id('archive')
        .title('Archive')
        .icon(ArchiveIcon)
        .child(
          S.list()
            .title('Archive')
            .items([
              S.documentTypeListItem('heroSection').title('Hero Section (unused)'),
            ])
        ),
    ])
