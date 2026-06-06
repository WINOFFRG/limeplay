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

type BlockPageShellProps = {
  info: ReactNode
  preview: ReactNode
  title: string
}

export function BlockPageShell({ info, preview, title }: BlockPageShellProps) {
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return <div className="w-full">{info}</div>
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
          minSize={"40%"}
        >
          {preview}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches
}

function getServerDesktopSnapshot() {
  return false
}

function subscribeToDesktopChange(onStoreChange: () => void) {
  const mediaQueryList = window.matchMedia(DESKTOP_QUERY)
  mediaQueryList.addEventListener("change", onStoreChange)

  return () => mediaQueryList.removeEventListener("change", onStoreChange)
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeToDesktopChange,
    getDesktopSnapshot,
    getServerDesktopSnapshot
  )
}
