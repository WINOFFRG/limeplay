"use client"

import type { ReactNode } from "react"

import { useSyncExternalStore } from "react"

import { BlockTopBar } from "@/components/blocks/breadcrumbs"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const DESKTOP_QUERY = "(min-width: 1024px)"
const STACKED_QUERY = "(min-width: 768px)"

type BlockPageLayout = "desktop" | "mobile" | "stacked"

type BlockPageShellProps = {
  info: ReactNode
  preview: ReactNode
  title: string
}

export function BlockPageShell({ info, preview, title }: BlockPageShellProps) {
  const layout = useBlockPageLayout()

  if (layout === "mobile") {
    return (
      <div className="w-full">
        <div className="relative h-[min(70svh,32rem)] min-h-88 w-full overflow-hidden bg-muted">
          {preview}
        </div>
        {info}
      </div>
    )
  }

  if (layout === "stacked") {
    return (
      <div className="w-full">
        <div className="relative h-[clamp(26rem,70svh,44rem)] min-h-0 w-full overflow-hidden bg-muted">
          {preview}
        </div>
        {info}
      </div>
    )
  }

  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          className={`
            overflow-hidden opacity-100 transition-[opacity,filter,transform] duration-300 ease-out
            in-data-[block-preview-expanded=true]:pointer-events-none in-data-[block-preview-expanded=true]:-translate-x-2
            in-data-[block-preview-expanded=true]:opacity-0 in-data-[block-preview-expanded=true]:blur-sm
          `}
          defaultSize={"35%"}
          minSize={"30%"}
        >
          <div className="relative h-full overflow-hidden bg-transparent">
            <BlockTopBar title={title} />
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
              }}
            />

            <div className="h-full min-w-0 overflow-x-hidden overflow-y-auto pt-16">
              {info}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle
          className={`
            z-20 opacity-100 transition-opacity duration-300 ease-out
            in-data-[block-preview-expanded=true]:pointer-events-none in-data-[block-preview-expanded=true]:opacity-0
          `}
          withHandle
        />

        <ResizablePanel
          className="relative"
          defaultSize={"65%"}
          minSize={"30%"}
        >
          {preview}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function getBlockPageLayoutSnapshot(): BlockPageLayout {
  if (window.matchMedia(DESKTOP_QUERY).matches) return "desktop"
  if (window.matchMedia(STACKED_QUERY).matches) return "stacked"

  return "mobile"
}

function getServerBlockPageLayoutSnapshot(): BlockPageLayout {
  return "desktop"
}

function subscribeToBlockPageLayoutChange(onStoreChange: () => void) {
  const mediaQueryLists = [
    window.matchMedia(DESKTOP_QUERY),
    window.matchMedia(STACKED_QUERY),
  ]

  mediaQueryLists.forEach((mediaQueryList) => {
    mediaQueryList.addEventListener("change", onStoreChange)
  })

  return () => {
    mediaQueryLists.forEach((mediaQueryList) => {
      mediaQueryList.removeEventListener("change", onStoreChange)
    })
  }
}

function useBlockPageLayout() {
  return useSyncExternalStore(
    subscribeToBlockPageLayoutChange,
    getBlockPageLayoutSnapshot,
    getServerBlockPageLayoutSnapshot
  )
}
