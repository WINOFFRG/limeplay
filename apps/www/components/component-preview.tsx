import fs from "fs"
import path from "path"
import React from "react"
import { highlight } from "fumadocs-core/highlight"
import { Pre } from "fumadocs-ui/components/codeblock"

import { cn } from "@/lib/utils"
import { atomReader } from "@/hooks/use-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Index } from "@/registry/__index__"
import { PlayerLayoutDemo } from "@/registry/default/examples/player-root-demo"

import { CodeBlock as CustomCodeBlock } from "./codeblock"
import { PreviewTabComponent } from "./preview-tab-component"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  hideCode?: boolean
  type?: "overlay" | "block"
  withPlayer?: boolean
  name: string
}

export async function ComponentPreview({
  name,
  className,
  withPlayer = false,
  hideCode = false,
  type = "block",
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
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "min-dark",
    },
    components: {
      pre: (props) => <Pre {...props} />,
    },
  })

  return (
    <div
      className={cn("group relative my-4 mb-12 flex flex-col space-y-2")}
      {...props}
    >
      <Tabs
        defaultValue="preview"
        className="relative mr-auto w-full rounded-none"
      >
        <div className="flex items-center justify-between pb-3">
          {!hideCode && (
            <TabsList className="w-fit justify-start border-b bg-transparent p-0 rounded-none">
              <TabsTrigger
                value="preview"
                className={`
                  relative h-9 cursor-pointer rounded-b-none border-b-2 border-b-transparent bg-transparent px-6 py-3 font-semibold
                  text-muted-foreground shadow-none transition-none
                  data-[state=active]:border-b-primary! data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-primary/10!
                `}
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className={`
                  relative h-9 cursor-pointer rounded-b-none border-b-2 border-b-transparent bg-transparent px-6 py-3 font-semibold
                  text-muted-foreground shadow-none transition-none
                  data-[state=active]:border-b-primary! data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-primary/10!
                `}
              >
                Code
              </TabsTrigger>
            </TabsList>
          )}
        </div>
        <TabsContent
          value="preview"
          className={`
            relative hidden
            data-[state=active]:block
          `}
          forceMount
        >
          <div className={className}>
            <PreviewComponent type={type}>
              <PreviewTabComponent componentName={name} />
            </PreviewComponent>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CustomCodeBlock
            title={fileName}
            data-line-numbers
            data-line-numbers-start={1}
            {...props}
          >
            {rendered}
          </CustomCodeBlock>
        </TabsContent>
      </Tabs>
    </div>
  )
}
