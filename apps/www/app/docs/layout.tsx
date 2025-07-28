import type { ReactNode } from "react"
import Link from "next/link"
import { Banner } from "fumadocs-ui/components/banner"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { RootProvider } from "fumadocs-ui/provider"

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
      <Banner variant="rainbow" className="font-medium">
        Limeplay V2 in under heavy development 🥳 We are looking for
        contributors 👀
      </Banner>
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
