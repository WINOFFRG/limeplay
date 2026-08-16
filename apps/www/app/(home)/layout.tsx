import type { Metadata } from "next"

import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VideoBackground } from "@/components/video-background"
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_TITLE,
  SITE_URL,
} from "@/lib/constants"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description: PRODUCT_DESCRIPTION,
  openGraph: {
    description: PRODUCT_DESCRIPTION,
    title: `${PRODUCT_TITLE} | ${PRODUCT_NAME}`,
    url: SITE_URL,
  },
  twitter: {
    description: PRODUCT_DESCRIPTION,
    title: `${PRODUCT_TITLE} | ${PRODUCT_NAME}`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      )}
      <main
        className={`
          light w-dvw scrollbar-gutter-auto overscroll-contain bg-linear-to-br from-white to-neutral-200
          md:scrollbar-gutter-stable
        `}
      >
        <VideoBackground />
        <Header />
        {children}
        <Footer />
      </main>
    </>
  )
}
