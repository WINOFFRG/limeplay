import Script from "next/script"

import { Header } from "@/components/layouts/header"
import { slot } from "@/components/layouts/shared"
import { VideoBackground } from "@/components/video-background"
import { baseOptions, HEADER_LINKS } from "@/app/layout.config"

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
        className={
          "w-dvw bg-gradient-to-br from-slate-50 via-amber-50 to-neutral-200"
        }
      >
        <VideoBackground />
        {slot(
          baseOptions.nav,
          <Header links={HEADER_LINKS} nav={baseOptions.nav} />
        )}
        {children}
      </main>
    </>
  )
}
