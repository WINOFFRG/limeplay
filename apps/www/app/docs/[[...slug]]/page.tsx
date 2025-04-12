import React from "react"
import { notFound } from "next/navigation"
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"

import { source } from "@/lib/source"
import { ComponentPreview } from "@/components/component-preview"

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDXContent = page.data.body

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: "clerk",
        header: <div className="h-4 w-10"></div>,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={{
            ...defaultMdxComponents,
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            ComponentPreview,
            pre: ({
              ref: _ref,
              ...props
            }: React.ComponentPropsWithRef<any>) => (
              <CodeBlock keepBackground className="" {...props}>
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),
            // you can add other MDX components here
          }}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
