import type { ReactNode } from "react"

import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"

export function BlockInfoPane({
  content,
  description,
  title,
}: {
  content: ReactNode
  description?: string
  title: string
}) {
  return (
    <div
      className={`
        no-scrollbar h-full pb-16
        lg:overflow-x-hidden lg:overflow-y-scroll
      `}
    >
      <DocsPage>
        <DocsTitle
          className="
            text-3xl
            sm:text-4xl
            md:text-5xl
          "
        >
          {title}
        </DocsTitle>
        <DocsDescription className="mt-1 leading-relaxed">
          {description}
        </DocsDescription>
        <DocsBody>{content}</DocsBody>
      </DocsPage>
    </div>
  )
}
