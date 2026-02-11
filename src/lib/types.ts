import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface NavItem {
  _key: string;
  label: string;
  target: string;
}

export interface NFTItem {
  _key: string;
  title?: string;
  image: SanityImageSource;
  alt?: string;
  year?: string;
  collection?: string;
}

export interface AccordionItem {
  _key: string;
  title: string;
  content: string;
  showSocialLinks?: boolean;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface SanityImageWithAsset {
  asset?: {
    _ref: string;
    _type: 'reference';
  };
}

export interface MarqueeItem {
  _key: string;
  text: string;
  icon?: SanityImageWithAsset;
}

export interface SanityFileAsset {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface HomepageSettings {
  // Navigation
  navItems?: NavItem[];

  // Hero
  heroImage?: SanityImageSource;
  heroVideo?: SanityFileAsset;
  heroVideoUrl?: string;

  // Book
  bookTitle?: string;
  bookDescription?: string;
  bookImage?: SanityImageSource;
  bookButtonText?: string;
  bookButtonUrl?: string;

  // NFT
  nftGallery?: NFTItem[];

  // CTA
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  encryptedText?: string;

  // About
  aboutAccordion?: AccordionItem[];
  socialLinks?: SocialLink[];

  // Footer
  footerMarqueeItems?: MarqueeItem[];
}
