import type { ReactNode } from "react"

import { RootProvider } from "fumadocs-ui/provider/next"

import { BlocksSidebar } from "@/components/blocks/blocks-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getBlockIcon } from "@/lib/block-showcase"
import { blocksSource } from "@/lib/blocks-source"

import "./blocks.css"

export default function BlocksLayout({ children }: { children: ReactNode }) {
  const items = blocksSource.getPages().map((page) => ({
    description: page.data.description,
    href: page.url,
    icon: page.data.icon ? getBlockIcon(page.data.icon) : undefined,
    status: page.data.status,
    title: page.data.title,
  }))

  return (
    <RootProvider
      theme={{
        forcedTheme: "light",
      }}
    >
      <SidebarProvider
        defaultOpen={false}
        style={
          {
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
          } as React.CSSProperties
        }
      >
        <BlocksSidebar items={items} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </RootProvider>
  )
}
