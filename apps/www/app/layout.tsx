import "@/app/global.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/constants";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`,
  },
  description: PRODUCT_DESCRIPTION,
  keywords: [
    "video player",
    "video components",
    "open source",
    "limeplay",
    "shaka player",
    "React",
    "TypeScript",
    "Next.js",
    "React",
    "Tailwind CSS",
    "media",
    "ui",
  ],
  authors: [
    {
      name: "winoffrg",
      url: "https://github.com/winoffrg",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
    siteName: PRODUCT_NAME,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: PRODUCT_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
    images: ["/opengraph-image.png"],
    creator: "@winoffrg",
  },
  manifest: "/site.webmanifest",
  robots: "index, follow",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`
        ${geist.variable}
        ${mono.variable}
      `}
      lang="en"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <JsonLd />
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="limeplay-ui-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
