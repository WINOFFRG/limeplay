import Script from "next/script"

import { cn } from "@/lib/utils"
import { Header } from "@/components/layouts/header"
import { slot } from "@/components/layouts/shared"
import { baseOptions, HEADER_LINKS } from "@/app/layout.config"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
      <main
        id="nd-home-layout"
        className={cn(
          "w-dvw bg-gradient-to-br from-slate-50 via-amber-50 to-neutral-200"
        )}
      >
        {slot(
          baseOptions.nav,
          <Header links={HEADER_LINKS} nav={baseOptions.nav} />
        )}
        {children}
      </main>
    </>
  )
}
