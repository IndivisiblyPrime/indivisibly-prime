import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface NFTItem {
  _key: string;
  title?: string;
  image: SanityImageSource;
  alt?: string;
}

export interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

export interface HomepageSettings {
  bookTitle?: string;
  bookDescription?: string;
  nftGallery?: NFTItem[];
  aboutPhoto?: SanityImageSource & { alt?: string };
  aboutText?: string;
  socialLinks?: SocialLink[];
}
