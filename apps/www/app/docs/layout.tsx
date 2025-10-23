import type { ReactNode } from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { RootProvider } from "fumadocs-ui/provider/next"

import { source } from "@/lib/source"
import { baseOptions } from "@/app/layout.config"

import "@/app/docs/docs.css"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        options: {
          type: "static",
        },
      }}
    >
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
