// import Script from "next/script"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VideoBackground } from "@/components/video-background"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* {process.env.NODE_ENV === "development" && (
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      )} */}
      <main
        className={
          "w-dvw overscroll-contain bg-linear-to-br from-slate-50 to-neutral-200"
        }
      >
        <VideoBackground />
        <Header />
        {children}
        <Footer />
      </main>
    </>
  )
}
