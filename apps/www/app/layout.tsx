


import "@/app/global.css";



import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";



import { PROD_BASE_HOST, PRODUCT_DESCRIPTION, PRODUCT_NAME } from "@/lib/constants";
import { JsonLd } from "@/components/json-ld";





const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: PRODUCT_NAME,
    template: `%s | ${PRODUCT_NAME}`,
  },
  metadataBase: new URL(PROD_BASE_HOST),
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
    url: PROD_BASE_HOST,
    title: PRODUCT_NAME,
    description: PRODUCT_DESCRIPTION,
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
    description: PRODUCT_DESCRIPTION,
    images: [`${PROD_BASE_HOST}/opengraph-image.png`],
    creator: "@winoffrg",
  },
  manifest: `${PROD_BASE_HOST}/site.webmanifest`,
  robots: "index, follow",
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
        <JsonLd />
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
