import type { Metadata } from "next"

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { notFound } from "next/navigation"

import { BlockInfoPane } from "@/components/blocks/block-info-pane"
import { BlockPreviewPane } from "@/components/blocks/block-preview-pane"
import { getMDXComponents } from "@/components/mdx-components"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { getBlockShowcase } from "@/lib/block-showcase"
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

  return (
    <div className="w-full">
      <DocsLayout
        sidebar={{
          enabled: false,
        }}
        tree={blocksSource.getPageTree()}
      >
        <main className="relative min-h-screen bg-background">
          <div className="flex h-full w-full">
            <div
              className={`
                w-full
                lg:hidden
              `}
            >
              <BlockPreviewPane>
                <PreviewComponent />
              </BlockPreviewPane>
              <BlockInfoPane
                content={content}
                description={page.data.description}
                title={page.data.title}
                url={page.url}
              />
            </div>

            <div
              className={`
                hidden h-screen w-full
                lg:block
              `}
            >
              <ResizablePanelGroup>
                <ResizablePanel defaultSize="35%">
                  <BlockInfoPane
                    content={content}
                    description={page.data.description}
                    title={page.data.title}
                    url={page.url}
                  />
                </ResizablePanel>
                <ResizableHandle className="z-20" withHandle />
                <ResizablePanel defaultSize="65%">
                  <BlockPreviewPane>
                    <PreviewComponent />
                  </BlockPreviewPane>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </main>
      </DocsLayout>
    </div>
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
