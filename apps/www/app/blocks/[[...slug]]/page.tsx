import type { Metadata } from "next"

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { notFound } from "next/navigation"

import { getBlockShowcase } from "@/components/blocks/block-showcase"
import { BlockTopBar } from "@/components/blocks/breadcrumbs"
import { BlockInfoPane } from "@/components/blocks/info-pane"
import { BlockPreviewPane } from "@/components/blocks/preview-background"
import { getMDXComponents } from "@/components/mdx-components"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
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
          <div className="flex size-full">
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
              />
            </div>

            <div
              className={`
                hidden h-screen w-full
                lg:block
              `}
            >
              <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel defaultSize={"35%"} minSize={"30%"}>
                  <div className="relative h-full overflow-hidden bg-transparent">
                    <BlockTopBar title={page.data.title} />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                      style={{
                        backdropFilter: "blur(2px)",
                        background:
                          "linear-gradient(to top, color-mix(in oklch, var(--background) 100%, transparent) 0%, transparent 100%)",
                        height: "92px",
                        maskImage:
                          "linear-gradient(to top, black 50%, transparent 100%)",
                        WebkitBackdropFilter: "blur(2px)",
                        WebkitMaskImage:
                          "linear-gradient(to top, black 50%, transparent 100%)",
                        willChange: "backdrop-filter",
                      }}
                    />

                    <div className="h-full min-w-0 overflow-x-hidden overflow-y-auto pt-16">
                      <BlockInfoPane
                        content={content}
                        description={page.data.description}
                        title={page.data.title}
                      />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle className="z-20" withHandle />

                <ResizablePanel
                  className="relative"
                  defaultSize={"65%"}
                  minSize={"40%"}
                >
                  <PreviewComponent />
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
