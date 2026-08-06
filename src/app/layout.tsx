import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Dancing_Script, Cormorant_Garamond } from "next/font/google";
import { urlFor } from "@/sanity/lib/image";
import { getSiteSettings } from "@/sanity/lib/homepage";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["700"],
});

// Serif used by the Desk entry cover and phone-stage labels
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Warm dark of the desk photo — tints the mobile browser chrome so the address
// bar blends into the page instead of sitting on a white strip.
const THEME_COLOR = "#171009";

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

// Site chrome lives HERE rather than in individual pages so every route gets the
// same icons. Metadata merges shallowly in the App Router: any page that declares
// its own `icons` replaces this whole block, so pages deliberately don't.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.siteTitle || "Jack Harvey";
  const favicon = settings?.siteFavicon;

  // Square PNG at an explicit size. Declaring `sizes` + `type` is the whole point:
  // mobile Safari picks an icon by its declared size, and an undeclared icon loses
  // to any competing one that does declare (which is how the stale Next.js default
  // used to win on phones).
  const iconAt = (size: number) =>
    urlFor(favicon!).width(size).height(size).format("png").url();

  return {
    metadataBase: new URL("https://jackharvey.me"),
    title,
    description: title,
    applicationName: title,
    // Gives iOS a proper name + dark status bar when added to the home screen.
    appleWebApp: { capable: true, title, statusBarStyle: "black-translucent" },
    icons: favicon
      ? {
          icon: [
            { url: iconAt(32), sizes: "32x32", type: "image/png" },
            { url: iconAt(192), sizes: "192x192", type: "image/png" },
          ],
          // iOS ignores rel="icon" for Add to Home Screen — without this it
          // screenshots the page instead. 180×180 is the size iOS asks for.
          apple: [{ url: iconAt(180), sizes: "180x180", type: "image/png" }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
