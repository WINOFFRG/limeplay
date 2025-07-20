import Script from "next/script"

import { HomeLayout } from "@/components/layouts/home/layout"

import { baseOptions } from "../layout.config"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
        {/* rest of your scripts go under */}
      </head>{" "}
      <HomeLayout {...baseOptions}>{children}</HomeLayout>
    </>
  )
}
