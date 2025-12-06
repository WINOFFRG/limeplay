import fs from "fs"
import { highlight } from "fumadocs-core/highlight"
import { Pre } from "fumadocs-ui/components/codeblock"
import path from "path"
import React from "react"

import { TabsContent } from "@/components/ui/tabs"
import { atomReader } from "@/hooks/use-config"
import { cn } from "@/lib/utils"
import { Index } from "@/registry/__index__"
import { PlayerLayoutDemo } from "@/registry/default/examples/player-root-demo"

import { CodeBlock as CustomCodeBlock } from "./codeblock"
import { ComponentPreviewControl } from "./component-preview-control"
import { PreviewTabComponent } from "./preview-tab-component"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  blockChildren?: React.ReactNode
  hideCode?: boolean
  name: string
  overlayChildren?: React.ReactNode
  type?: "block" | "overlay"
  withPlayer?: boolean
}

export async function ComponentPreview({
  blockChildren,
  className,
  hideCode = false,
  name,
  overlayChildren,
  type = "block",
  withPlayer = false,
  ...props
}: ComponentPreviewProps) {
  const config = atomReader()
  const Component = (Index[config.style] as Record<string, any>)[name]

  if (!Component) {
    throw new Error(`Component ${name} not found in registry`)
  }

  const filePath = path.join(Component?.files?.[0]?.path)
  const fileContent = await fs.promises.readFile(filePath, "utf-8")
  const fileName = path.basename(filePath)
  const PreviewComponent = withPlayer ? PlayerLayoutDemo : React.Fragment

  const rendered = await highlight(fileContent, {
    components: {
      pre: (props) => <Pre {...props} />,
    },
    lang: "tsx",
    themes: {
      dark: "min-dark",
      light: "github-light",
    },
  })

  return (
    <div
      className={cn("group relative my-4 mb-12 flex flex-col space-y-2")}
      {...props}
    >
      <ComponentPreviewControl
        className="relative mr-auto w-full rounded-none"
        hideCode={hideCode}
      >
        <TabsContent
          className={`
            relative hidden
            data-[state=active]:block
          `}
          forceMount
          value="preview"
        >
          <div className={className}>
            <PreviewComponent
              blockChildren={blockChildren}
              overlayChildren={overlayChildren}
              type={type}
            >
              <PreviewTabComponent componentName={name} />
            </PreviewComponent>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CustomCodeBlock
            data-line-numbers
            data-line-numbers-start={1}
            title={fileName}
            {...props}
          >
            {rendered}
          </CustomCodeBlock>
        </TabsContent>
      </ComponentPreviewControl>
    </div>
  )
}
