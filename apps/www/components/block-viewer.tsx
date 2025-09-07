"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Check,
  ChevronRight,
  File,
  Folder,
  Fullscreen,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react"
import type { ImperativePanelHandle } from "react-resizable-panels"
import { useCopyToClipboard } from "react-use"
import type { registryItemFileSchema, registryItemSchema } from "shadcn/schema"
import type { z } from "zod"

import type {
  createFileTreeForRegistryItemFiles,
  FileTree,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CodeBlock } from "@/components/codeblock"
import { getIconForLanguageExtension } from "@/components/icons"
import { OpenInV0Button } from "@/components/open-in-v0-button"

interface BlockViewerContext {
  item: z.infer<typeof registryItemSchema>
  view: "code" | "preview"
  setView: (view: "code" | "preview") => void
  activeFile: string | null
  setActiveFile: (file: string) => void
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null> | null
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null
  highlightedFiles:
    | (z.infer<typeof registryItemFileSchema> & {
        highlightedContent: any
      })[]
    | null
  iframeKey?: number
  setIframeKey?: React.Dispatch<React.SetStateAction<number>>
}

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null)

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext)
  if (!context) {
    throw new Error("useBlockViewer must be used within a BlockViewerProvider.")
  }
  return context
}

function BlockViewerProvider({
  item,
  tree,
  highlightedFiles,
  children,
}: Pick<BlockViewerContext, "item" | "tree" | "highlightedFiles"> & {
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<BlockViewerContext["view"]>("preview")
  const [activeFile, setActiveFile] = React.useState<
    BlockViewerContext["activeFile"]
  >(highlightedFiles?.[0].target ?? null)
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null)
  const [iframeKey, setIframeKey] = React.useState(0)

  return (
    <BlockViewerContext.Provider
      value={{
        item,
        view,
        setView,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
        iframeKey,
        setIframeKey,
      }}
    >
      <div
        id={item.name}
        data-view={view}
        className={`
          group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-4 overflow-hidden
          md:flex-col
        `}
        style={
          {
            "--height": item.meta?.iframeHeight ?? "930px",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </BlockViewerContext.Provider>
  )
}

function BlockViewerToolbar() {
  const { setView, view, item, resizablePanelRef, setIframeKey } =
    useBlockViewer()
  const [isCopied, copyToClipboard] = useCopyToClipboard()

  return (
    <div
      className={`
        hidden w-full items-center gap-2 pl-2
        md:pr-6
        lg:flex
      `}
    >
      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value as "preview" | "code")
        }}
      >
        <TabsList
          className={`
            grid h-8 grid-cols-2 items-center rounded-md p-1
            *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs
          `}
        >
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator orientation="vertical" className="mx-2 !h-4" />
      <span
        className={`
          flex-1 text-sm font-medium text-primary-foreground
          md:flex-auto md:text-left
        `}
      >
        {item.description?.replace(/\.$/, "")}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <div className="h-8 items-center gap-1.5 rounded-md border border-border bg-muted p-1 shadow-none">
          <ToggleGroup
            type="single"
            defaultValue="100"
            onValueChange={(value) => {
              setView("preview")
              if (resizablePanelRef?.current) {
                resizablePanelRef.current.resize(parseInt(value))
              }
            }}
            className={`
              gap-1
              *:data-[slot=toggle-group-item]:!size-6 *:data-[slot=toggle-group-item]:!rounded-sm
            `}
          >
            <ToggleGroupItem value="100" title="Desktop">
              <Monitor className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="60" title="Tablet">
              <Tablet className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="30" title="Mobile">
              <Smartphone className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <Separator orientation="vertical" className="!h-4" />
            <Button
              size="icon"
              variant="ghost"
              className={`
                size-6 rounded-sm p-0
                hover:bg-accent hover:text-accent-foreground
              `}
              asChild
              title="Open in New Tab"
            >
              <Link href={`/view/${item.name}`} target="_blank">
                <span className="sr-only">Open in New Tab</span>
                <Fullscreen className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Separator orientation="vertical" className="!h-4" />
            <Button
              size="icon"
              variant="ghost"
              className={`
                size-6 rounded-sm p-0
                hover:bg-accent hover:text-accent-foreground
              `}
              title="Refresh Preview"
              onClick={() => {
                if (setIframeKey) {
                  setIframeKey((k) => k + 1)
                }
              }}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span className="sr-only">Refresh Preview</span>
            </Button>
          </ToggleGroup>
        </div>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <Button
          variant="outline"
          className={`
            w-fit gap-1 border border-border bg-muted px-2 py-2 shadow-none
            hover:bg-accent hover:text-accent-foreground
          `}
          size="sm"
          onClick={() => {
            copyToClipboard(
              `npx shadcn@latest add https://limeplay.winoffrg.dev/r/${item.name}.json`
            )
          }}
        >
          {isCopied.value ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Terminal className="h-3.5 w-3.5" />
          )}
          <span>npx shadcn add {item.name}</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 !h-4" />
        <OpenInV0Button
          name={item.name}
          className={`
            border border-border bg-muted text-foreground
            hover:bg-accent hover:text-accent-foreground
          `}
          size="sm"
        />
      </div>
    </div>
  )
}

function BlockViewerIframe({ className }: { className?: string }) {
  const { item, iframeKey } = useBlockViewer()

  return (
    <>
      <iframe
        key={iframeKey}
        src={`/view/${item.name}`}
        height={item.meta?.iframeHeight ?? 930}
        loading="lazy"
        className={cn("relative z-20 no-scrollbar w-full", className)}
      />
    </>
  )
}

function BlockViewerView() {
  const { resizablePanelRef } = useBlockViewer()

  return (
    <div
      className={`
        hidden overflow-hidden
        group-data-[view=code]/block-view-wrapper:hidden
        md:h-(--height)
        lg:flex
      `}
    >
      <div className="relative grid w-full gap-4">
        <div
          className={`
            absolute inset-0 right-4 m-1.5
            [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]
            [background-size:20px_20px]
            dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]
          `}
        />
        <ResizablePanelGroup
          direction="horizontal"
          className={`
            relative z-10
            after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl after:bg-surface/50
          `}
        >
          <ResizablePanel
            ref={resizablePanelRef as React.Ref<ImperativePanelHandle>}
            className={`
              relative aspect-[4/2.5] overflow-hidden rounded-lg border bg-transparent
              md:aspect-auto md:rounded-xl
            `}
            defaultSize={100}
            minSize={30}
          >
            <BlockViewerIframe />
          </ResizablePanel>
          <ResizableHandle
            className={`
              relative hidden w-3 bg-transparent p-0
              after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full
              after:bg-primary-foreground/80 after:transition-all after:hover:h-10
              md:block
            `}
          />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

function BlockViewerMobile({ children }: { children: React.ReactNode }) {
  const { item } = useBlockViewer()

  return (
    <div
      className={`
        flex flex-col gap-2
        lg:hidden
      `}
    >
      <div className="flex items-center gap-2 px-2">
        <div className="line-clamp-1 text-sm font-medium text-foreground">
          {item.description}
        </div>
        <div className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
          {item.name}
        </div>
      </div>
      {item.meta?.mobile === "component" ? (
        children
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Image
            src={`/r/styles/new-york-v4/${item.name}-light.png`}
            alt={item.name}
            data-block={item.name}
            width={1440}
            height={900}
            className={`
              object-cover
              dark:hidden
            `}
          />
          <Image
            src={`/r/styles/new-york-v4/${item.name}-dark.png`}
            alt={item.name}
            data-block={item.name}
            width={1440}
            height={900}
            className={`
              hidden object-cover
              dark:block
            `}
          />
        </div>
      )}
    </div>
  )
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles } = useBlockViewer()

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile)
  }, [highlightedFiles, activeFile])

  if (!file) {
    return null
  }

  const language = file.path.split(".").pop() ?? "tsx"

  return (
    <div
      className={`
        mr-[14px] flex overflow-hidden rounded-xl border border-border bg-background
        group-data-[view=preview]/block-view-wrapper:hidden
        md:h-(--height)
      `}
    >
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
          <BlockViewerFileTree />
        </ResizablePanel>
        <ResizableHandle
          className={`
            relative w-1 bg-transparent p-0
            after:absolute after:top-1/2 after:left-1/2 after:h-8 after:w-[3px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full
            after:bg-border after:transition-all after:hover:h-10
          `}
        />
        <ResizablePanel defaultSize={75} minSize={60}>
          <CodeBlock
            allowCopy
            lang={language}
            title={file.target}
            icon={getIconForLanguageExtension(language)}
            keepBackground
            data-line-numbers
            className="my-0 w-full rounded-none border-0 pt-0 pl-0"
            viewportProps={{
              className: "max-h-fit h-(--height)",
            }}
            titleProps={{
              className: "h-12 border-b border-border",
            }}
          >
            {file.highlightedContent}
          </CodeBlock>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function BlockViewerFileTree() {
  const { tree } = useBlockViewer()

  if (!tree) {
    return null
  }

  return (
    <SidebarProvider className="flex !min-h-full w-full flex-col border-r border-border bg-background">
      <Sidebar collapsible="none" className="w-full flex-1 bg-card">
        <SidebarGroupLabel className="h-12 rounded-none border-b border-border px-4 text-sm font-medium text-foreground">
          Files
        </SidebarGroupLabel>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="translate-x-0 gap-1.5">
              {tree.map((file, index) => (
                <Tree key={index} item={file} index={1} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  )
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer()

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.path === activeFile}
          onClick={() => {
            if (item.path) {
              setActiveFile(item.path)
            }
          }}
          className={`
            rounded-none pl-(--index) text-sm whitespace-nowrap
            hover:bg-accent hover:text-accent-foreground
            focus:bg-accent focus:text-accent-foreground
            focus-visible:bg-accent focus-visible:text-accent-foreground
            active:bg-accent active:text-accent-foreground
            data-[active=true]:bg-accent data-[active=true]:text-accent-foreground
          `}
          data-index={index}
          style={
            {
              "--index": `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            } as React.CSSProperties
          }
        >
          <ChevronRight className="invisible" />
          <File className="h-4 w-4" />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className={`
          group/collapsible
          [&[data-state=open]>button>svg:first-child]:rotate-90
        `}
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`
              rounded-none pl-(--index) text-sm whitespace-nowrap
              hover:bg-accent hover:text-accent-foreground
              focus:bg-accent focus:text-accent-foreground
              focus-visible:bg-accent focus-visible:text-accent-foreground
              active:bg-accent active:text-accent-foreground
              data-[active=true]:bg-accent data-[active=true]:text-accent-foreground
            `}
            style={
              {
                "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRight className="transition-transform" />
            <Folder className="h-4 w-4" />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
            {item.children.map((subItem, key) => (
              <Tree key={key} item={subItem} index={index + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

function BlockViewer({
  item,
  tree,
  highlightedFiles,
  children,
  ...props
}: Pick<BlockViewerContext, "item" | "tree" | "highlightedFiles"> & {
  children: React.ReactNode
}) {
  return (
    <BlockViewerProvider
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
      {...props}
    >
      <BlockViewerToolbar />
      <BlockViewerView />
      <BlockViewerCode />
      <BlockViewerMobile>{children}</BlockViewerMobile>
    </BlockViewerProvider>
  )
}

export { BlockViewer }
