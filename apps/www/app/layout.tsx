import "@/app/global.css"

import type { Metadata } from "next"
import type { ReactNode } from "react"

import { UserJotProvider } from "@userjot/next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from "next/font/google"

import { JsonLd } from "@/components/json-ld"
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_TITLE,
  SITE_URL,
} from "@/lib/constants"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
const bingSiteVerification = process.env.BING_SITE_VERIFICATION

export const metadata: Metadata = {
  authors: [
    {
      name: "winoffrg",
      url: "https://github.com/winoffrg",
    },
  ],
  description: PRODUCT_DESCRIPTION,
  manifest: `/site.webmanifest`,
  metadataBase: new URL(SITE_URL),
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
    title: `${PRODUCT_TITLE} | ${PRODUCT_NAME}`,
    type: "website",
    url: SITE_URL,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: `${PRODUCT_TITLE} | ${PRODUCT_NAME}`,
    template: `%s | Limeplay`,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@winoffrg",
    description: PRODUCT_DESCRIPTION,
    images: [`/opengraph-image.png`],
    title: `${PRODUCT_TITLE} | ${PRODUCT_NAME}`,
  },
  verification: {
    other: bingSiteVerification
      ? {
          "msvalidate.01": bingSiteVerification,
        }
      : undefined,
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
        {/* {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )} */}
      </body>
    </html>
  )
}
