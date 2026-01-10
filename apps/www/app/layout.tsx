import "@/app/global.css"

import type { Metadata } from "next"
import type { ReactNode } from "react"

import { UserJotProvider } from "@userjot/next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"

import { JsonLd } from "@/components/json-ld"
import { PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/constants"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
    "tailwind",
    "media",
    "ui",
    "shadcn",
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
    <html className={inter.className} lang="en" suppressHydrationWarning>
      <head>
        <UserJotProvider projectId="cmjs634l4043b15ldylgedgwi" />
      </head>
      <body className="antialiased">
        <JsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
