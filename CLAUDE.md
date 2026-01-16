# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Indivisibly Prime - A Next.js website with Sanity CMS integration.

## Build/Test Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Stack
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Sanity v3** for headless CMS (embedded studio at /studio)

### Project Structure
```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── studio/[[...tool]]/page.tsx  # Sanity Studio
├── sanity/
│   ├── lib/
│   │   ├── client.ts     # Sanity client
│   │   └── image.ts      # Image URL builder
│   └── schemaTypes/
│       ├── index.ts      # Schema exports
│       └── heroSection.ts # Hero section schema
└── lib/
    └── utils.ts          # shadcn utilities
```

### Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (default: production)

These are auto-populated when using Vercel's Sanity integration.

### Sanity Schemas
- **heroSection** - Homepage hero with headline and subtitle
