import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://thestay.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Browser tab title for the chat page. As Stay shifts toward public
    // distribution (SEO landing pages, /zh, brand-recognition for daily
    // users), the previous "Notes" disguise gives diminishing DV-safety
    // benefit — the URL and page chrome already reveal context to anyone
    // looking carefully. The actual DV-safety surface (panic phrase,
    // quick exit, encrypted local-only storage) is unaffected.
    default: "Stay",
    template: "%s",
  },
  description: "An AI for the moments you can't be alone.",
  applicationName: "Stay",
  authors: [{ name: "Stay" }],
  keywords: [
    "mental health support",
    "crisis support",
    "AI companion",
    "reflective conversation",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Stay",
    title: "Stay",
    description:
      "An AI for the moments you can't be alone. Free, private, and never trying to keep you here.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stay",
    description:
      "An AI for the moments you can't be alone. Free, private, and never trying to keep you here.",
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf7f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
