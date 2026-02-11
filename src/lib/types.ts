import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface NFTItem {
  _key: string;
  title?: string;
  image: SanityImageSource;
  alt?: string;
  year?: string;
}

export interface AccordionItem {
  _key: string;
  title: string;
  content: string;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface HomepageSettings {
  heroImage?: SanityImageSource;
  bookTitle?: string;
  bookDescription?: string;
  bookImage?: SanityImageSource;
  nftGallery?: NFTItem[];
  aboutAccordion?: AccordionItem[];
  socialLinks?: SocialLink[];
  footerMarqueeItems?: string[];
}
