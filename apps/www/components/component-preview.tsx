import fs from "fs"
import path from "path"
import React from "react"
import { highlight } from "fumadocs-core/highlight"
import { Pre } from "fumadocs-ui/components/codeblock"

import { cn } from "@/lib/utils"
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
  const Component = (Index.default as Record<string, any>)[name]

  if (!Component) {
    throw new Error(`Component ${name} not found in registry`)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
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
      className={cn(
        "group relative my-4 mb-12 flex flex-col space-y-2",
        className
      )}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          {!hideCode && (
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="preview"
                className={`
                  relative h-9 cursor-pointer rounded-none border-b-2 border-b-transparent bg-transparent px-4 pt-2 pb-3 font-semibold
                  text-muted-foreground shadow-none transition-none
                  data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none
                `}
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className={`
                  relative h-9 cursor-pointer rounded-none border-b-2 border-b-transparent bg-transparent px-4 pt-2 pb-3 font-semibold
                  text-muted-foreground shadow-none transition-none
                  data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none
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
          {/* <React.Suspense
            fallback={
              <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                Loading...
              </div>
            }
          > */}
          <PreviewComponent type={type}>
            <PreviewTabComponent componentName={name} />
          </PreviewComponent>
          {/* </React.Suspense> */}
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
