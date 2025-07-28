import Script from "next/script"

import { HomeLayout } from "@/components/layouts/home/layout"
import { baseOptions } from "@/app/layout.config"

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
      <HomeLayout {...baseOptions}>{children}</HomeLayout>
    </>
  )
}
