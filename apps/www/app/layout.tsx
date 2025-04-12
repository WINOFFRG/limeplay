import "./global.css"

import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { RootProvider } from "fumadocs-ui/provider"

const inter = Inter({
  subsets: ["latin"],
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
