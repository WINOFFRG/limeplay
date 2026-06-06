import type { Metadata } from "next"

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { notFound } from "next/navigation"

import { BlockPageShell } from "@/components/blocks/block-page-shell"
import { getBlockShowcase } from "@/components/blocks/block-showcase"
import { BlockInfoPane } from "@/components/blocks/info-pane"
import { getMDXComponents } from "@/components/mdx-components"
import { blocksSource } from "@/lib/blocks-source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

type BlockPageProps = {
  params: Promise<{ slug?: string[] }>
}

export default async function BlockPage(props: BlockPageProps) {
  const params = await props.params
  const slug = params.slug ?? []
  const page = blocksSource.getPage(slug)

  if (!page) {
    notFound()
  }

  const showcase = getBlockShowcase(page.data.preview)

  const MDXContent = page.data.body
  const PreviewComponent = showcase.component
  const content = (
    <MDXContent
      components={getMDXComponents({
        pre: ({ ref: _ref, ...props }) => (
          <CodeBlock {...props} keepBackground>
            <Pre>{props.children}</Pre>
          </CodeBlock>
        ),
      })}
    />
  )
  const info = (
    <BlockInfoPane
      content={content}
      description={page.data.description}
      title={page.data.title}
    />
  )
  const preview = <PreviewComponent />

  return (
    <DocsLayout
      nav={{
        enabled: false,
      }}
      searchToggle={{
        enabled: false,
      }}
      sidebar={{
        enabled: false,
      }}
      tree={blocksSource.getPageTree()}
    >
      <main className="relative min-h-svh overflow-x-hidden bg-background">
        <script
          dangerouslySetInnerHTML={{
            __html: `
                document.documentElement.dataset.blockPreviewExpanded =
                  new URLSearchParams(window.location.search).get("expanded") === "true"
                    ? "true"
                    : "false";
              `,
          }}
        />
        <BlockPageShell info={info} preview={preview} title={page.data.title} />
      </main>
    </DocsLayout>
  )
}

export async function generateMetadata(
  props: BlockPageProps
): Promise<Metadata> {
  const params = await props.params

  if (!params.slug?.length) {
    return {
      title: "Blocks",
    }
  }

  const page = blocksSource.getPage(params.slug)

  if (!page) notFound()

  return {
    description: page.data.description,
    title: `${page.data.title} Block`,
  }
}

export function generateStaticParams() {
  return blocksSource.generateParams()
}
