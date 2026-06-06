"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import {
  CogIcon,
  ExternalLinkIcon,
  RotateCcwIcon,
  RotateCwIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useCallback, useState } from "react"

import {
  StreamPanel,
  StreamPanelProvider,
  useStreamPanel,
} from "@/components/stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"
import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { CustomDemoControls } from "@/registry/default/internal/custom-demo-controls"
import { MediaProvider, useMediaStore } from "@/registry/default/internal/media"
import {
  ErrorScreen,
  getErrorDetails,
} from "@/registry/default/ui/error-screen"
import { FallbackPoster } from "@/registry/default/ui/fallback-poster"
import { LimeplayLogo } from "@/registry/default/ui/limeplay-logo"
import { Media } from "@/registry/default/ui/media"
import * as Layout from "@/registry/default/ui/player-layout"
import { RootContainer } from "@/registry/default/ui/root-container"

interface PlayerDemoLayoutProps extends React.PropsWithChildren {
  blockChildren?: React.ReactNode
  codeSlot?: React.ReactNode
  overlayChildren?: React.ReactNode
  type: "block" | "hybrid" | "overlay" | "poster"
}

export function PlayerLayoutDemo({
  blockChildren,
  children,
  codeSlot,
  overlayChildren,
  type,
}: PlayerDemoLayoutProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [reloadKey, setReloadKey] = useState(0)
  const [rotation, setRotation] = useState(0)

  const handleReload = useCallback(() => {
    setReloadKey((k) => k + 1)
    setRotation((r) => r - 720)
  }, [])

  return (
    <StreamPanelProvider>
      <Tabs
        className="relative w-full"
        defaultValue="preview"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border/50">
          <div className="flex h-11 items-center justify-between border-b border-border/50 px-8">
            <TabsList
              className={cn(
                "relative flex w-fit items-center gap-0.5",
                "bg-transparent p-0 text-sm shadow-none"
              )}
            >
              {["preview", "code"].map((tab) => (
                <TabsPrimitive.Trigger
                  className={cn(
                    `
                      relative inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-sm transition-colors
                      focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
                      disabled:pointer-events-none disabled:opacity-50
                    `,
                    activeTab === tab
                      ? "text-foreground"
                      : `
                        text-muted-foreground
                        hover:text-foreground
                      `
                  )}
                  key={tab}
                  value={tab}
                >
                  {activeTab === tab && (
                    <motion.div
                      className="absolute inset-0 rounded-md bg-muted"
                      layoutId="player-tab-indicator"
                      transition={{
                        bounce: 0.2,
                        duration: 0.6,
                        type: "spring",
                      }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{tab}</span>
                </TabsPrimitive.Trigger>
              ))}
            </TabsList>
            {activeTab === "preview" && (
              <div className="flex items-center gap-1.5">
                <Button
                  className="size-7 rounded-lg border"
                  onClick={handleReload}
                  size="icon"
                  variant="ghost"
                >
                  <motion.span
                    animate={{ rotate: rotation }}
                    className="inline-flex self-center"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <RotateCcwIcon className="size-3.5" />
                  </motion.span>
                </Button>
                <PanelTriggerButton />
              </div>
            )}
          </div>

          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: activeTab === "preview" ? 50 : -50,
              }}
              initial={{
                opacity: 0,
                x: activeTab === "preview" ? -50 : 50,
              }}
              key={activeTab}
              transition={{
                duration: 0.35,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <TabsContent
                className={`
                  relative mt-0 hidden pb-4
                  data-[state=active]:block
                `}
                forceMount
                value="preview"
              >
                <MediaProvider key={reloadKey}>
                  <DemoStreamSync>
                    <svg className="pointer-events-none absolute top-12 left-0 z-10 h-px w-full">
                      <line
                        className="text-border"
                        stroke="currentColor"
                        strokeDasharray="8 4"
                        strokeWidth="1"
                        x1="0"
                        x2="100%"
                        y1="0"
                        y2="0"
                      />
                    </svg>
                    <svg className="pointer-events-none absolute top-0 left-6 z-10 h-full w-px">
                      <line
                        className="text-border"
                        stroke="currentColor"
                        strokeDasharray="8 4"
                        strokeWidth="1"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="100%"
                      />
                    </svg>
                    <svg className="pointer-events-none absolute top-0 right-6 z-10 h-full w-px">
                      <line
                        className="text-border"
                        stroke="currentColor"
                        strokeDasharray="8 4"
                        strokeWidth="1"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="100%"
                      />
                    </svg>

                    <div className="mb-2 px-8 pt-14">
                      <RootContainer
                        className="container rounded-lg border border-border/50 p-0"
                        height={720}
                        width={1280}
                      >
                        <Layout.PlayerContainer>
                          <PlayerErrorScreen />
                          {type === "poster" ? (
                            children
                          ) : (
                            <FallbackPoster className="rounded-lg bg-background">
                              <LimeplayLogo />
                            </FallbackPoster>
                          )}
                          <Media
                            as="video"
                            autoPlay={false}
                            className="m-0! size-full rounded-lg bg-black object-cover"
                            controls={true}
                            muted
                          />
                          <Layout.ControlsContainer>
                            {type === "overlay" && children}
                            {type === "hybrid" && overlayChildren}
                          </Layout.ControlsContainer>
                        </Layout.PlayerContainer>
                      </RootContainer>
                    </div>
                    <CustomDemoControls>
                      {type === "block" ? children : null}
                      {type === "hybrid" ? blockChildren : null}
                    </CustomDemoControls>
                  </DemoStreamSync>
                </MediaProvider>
              </TabsContent>

              <TabsContent className="relative m-0!" value="code">
                {codeSlot}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </StreamPanelProvider>
  )
}

function DemoStreamSync({ children }: React.PropsWithChildren) {
  const {
    handleLoadStream,
    handlePlaylistPresetChange,
    handlePresetChange,
  } = useStreamPanelSync({ playerType: "video" })

  return (
    <>
      {children}
      <StreamPanel
        align="end"
        onLoadStream={handleLoadStream}
        onPlaylistChange={handlePlaylistPresetChange}
        onPresetChange={handlePresetChange}
        playerType="video"
        side="top"
        variant="anchored"
      />
    </>
  )
}

function PanelTriggerButton() {
  const { handle } = useStreamPanel()

  return (
    <Button
      asChild
      className="size-7 rounded-lg border"
      size="icon"
      variant="ghost"
    >
      <PopoverTrigger handle={handle}>
        <CogIcon className="size-3.5" />
      </PopoverTrigger>
    </Button>
  )
}

function PlayerErrorScreen() {
  const status = useMediaStore((s) => s.playback.status)
  const error = useMediaStore((s) => s.playback.error)
  const debug = useMediaStore((s) => s.media.debug)
  const details = getErrorDetails(error)
  const { currentItem, loadAsset } = useAsset()

  const retryStream = useCallback(() => {
    if (!currentItem) return
    void loadAsset(currentItem.properties)
  }, [currentItem, loadAsset])

  if (status !== "error") return null

  return (
    <ErrorScreen className="rounded-lg" error={error}>
      <div className="flex gap-3">
        <Button onClick={retryStream} size="sm">
          <RotateCwIcon />
          Retry
        </Button>
        {debug && details.shakaDocsUrl && (
          <Button asChild variant="secondary">
            <a
              href={details.shakaDocsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLinkIcon />
              Shaka Error
            </a>
          </Button>
        )}
      </div>
    </ErrorScreen>
  )
}
