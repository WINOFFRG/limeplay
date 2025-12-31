import type { ReactNode } from "react"

import "@/app/docs/docs.css"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { RootProvider } from "fumadocs-ui/provider/next"
import { ThemeProvider } from "next-themes"

import { baseOptions } from "@/app/layout.config"
import SearchDialog from "@/components/search"
import { source } from "@/lib/source"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" storageKey="limeplay-ui-theme">
      <RootProvider
        search={{
          SearchDialog,
        }}
      >
        <DocsLayout tree={source.pageTree} {...baseOptions}>
          {children}
        </DocsLayout>
      </RootProvider>
    </ThemeProvider>
  )
}
