import "@/app/global.css"

import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "next-themes"
import { Geist, Geist_Mono } from "next/font/google"

import { JsonLd } from "@/components/json-ld"
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/constants"

const geist = Geist({
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-sans",
})

const mono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  authors: [
    {
      name: "winoffrg",
      url: "https://github.com/winoffrg",
    },
  ],
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
  manifest: `/site.webmanifest`,
  openGraph: {
    description: PRODUCT_DESCRIPTION,
    images: [
      {
        alt: PRODUCT_NAME,
        height: 630,
        url: `/opengraph-image.png`,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: PRODUCT_NAME,
    title: PRODUCT_NAME,
    type: "website",
  },
  robots: "index, follow",
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@winoffrg",
    description: PRODUCT_DESCRIPTION,
    images: [`/opengraph-image.png`],
    title: PRODUCT_NAME,
  },
}

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
  )
}
