import type { ReactNode } from "react"

import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"
import { DotIcon } from "lucide-react"
import Link from "next/link"

export function BlockInfoPane({
  content,
  description,
  title,
  url,
}: {
  content: ReactNode
  description?: string
  title: string
  url: string
}) {
  return (
    <div
      className={`
        no-scrollbar h-full
        lg:overflow-x-hidden lg:overflow-y-scroll
      `}
    >
      <header
        className={`
          top-0 z-10
          lg:sticky
        `}
      >
        <div className="pointer-events-none absolute top-0 h-36 w-full bg-linear-to-b from-background via-background/90 to-transparent" />
        <div
          className={`
            relative z-10 flex items-center gap-2 pt-11 text-sm capitalize
            lg:pl-18 lg:text-base
          `}
        >
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm"
          >
            <Link className={`truncate`} href="/">
              Blocks
            </Link>
            <DotIcon className="size-4 shrink-0" />
            <Link className={`truncate capitalize`} href={url}>
              {title}
            </Link>
          </nav>
        </div>
      </header>
      <DocsPage>
        <DocsTitle className="text-4xl">{title}</DocsTitle>
        <DocsDescription>{description}</DocsDescription>
        <DocsBody className="mb-10">{content}</DocsBody>
      </DocsPage>
    </div>
  )
}
