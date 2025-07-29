import "@/app/global.css"

import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "next-themes"

import {
  PROD_BASE_HOST,
  PRODUCT_DECSRIPTION,
  PRODUCT_NAME,
} from "@/lib/constants"

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`,
  },
  metadataBase: new URL(PROD_BASE_HOST),
  description: PRODUCT_DECSRIPTION,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "shaka-player",
    "shaka player",
    "video player",
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
    url: PROD_BASE_HOST,
    title: PRODUCT_NAME,
    description: PRODUCT_DECSRIPTION,
    siteName: PRODUCT_NAME,
    images: [
      {
        url: `${PROD_BASE_HOST}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: PRODUCT_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_NAME,
    description: PRODUCT_DECSRIPTION,
    images: [`${PROD_BASE_HOST}/opengraph-image.png`],
    creator: "@shadcn",
  },
  manifest: `${PROD_BASE_HOST}/site.webmanifest`,
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`
        ${geist.variable}
        ${mono.variable}
      `}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          storageKey="limeplay-ui-theme"
          defaultTheme="dark"
          attribute="class"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
