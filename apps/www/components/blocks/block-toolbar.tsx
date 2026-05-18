"use client"

import {
  CodeXmlIcon,
  Maximize2Icon,
  Minimize2Icon,
  MoonIcon,
  RotateCcwIcon,
  SunIcon,
} from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useAnimationControls,
} from "motion/react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import {
  StreamPanel,
  StreamPanelProvider,
  useStreamPanel,
} from "@/components/stream-panel"
import { useStreamPanelSync } from "@/components/stream-panel/use-stream-panel-sync"
import { PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const PILL_TRANSITION = { bounce: 0.2, duration: 0.5, type: "spring" } as const
const CONTENT_TRANSITION = {
  bounce: 0,
  duration: 0.6,
  type: "spring",
} as const

type ActivePanel = "settings" | null

interface BlockToolbarProps {
  codeUrl?: string
  expanded: boolean
  onExpandToggle: () => void
  onReload: () => void
  onThemeToggle: () => void
  theme: "dark" | "light"
}

export function BlockStreamSync({
  playerType = "video",
}: {
  playerType?: "audio" | "video"
}) {
  const { handleLoadStream } = useStreamPanelSync()

  return (
    <StreamPanel
      onLoadStream={handleLoadStream}
      playerType={playerType}
      position="bottom-right"
      side="top"
      variant="floating"
    />
  )
}

export function BlockToolbar({
  codeUrl,
  expanded,
  onExpandToggle,
  onReload,
  onThemeToggle,
  theme,
}: BlockToolbarProps) {
  const { handle } = useStreamPanel()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const rotateControls = useAnimationControls()
  const rotationRef = useRef(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (!contentRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height)
      }
    })
    ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [activePanel])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (
        target?.closest(
          '[data-slot="select-content"], [data-slot="select-item"], [data-slot="select-trigger"], [role="listbox"]'
        )
      )
        return
      if (containerRef.current && !containerRef.current.contains(target)) {
        setActivePanel(null)
      }
    }
    if (activePanel !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activePanel])

  const handleRotateStart = useCallback(() => {
    rotationRef.current -= 20
    void rotateControls.start({
      rotate: rotationRef.current,
      transition: { damping: 25, stiffness: 400, type: "spring" },
    })
  }, [rotateControls])

  const handleRotateEnd = useCallback(() => {
    rotationRef.current -= 340
    void rotateControls.start({
      rotate: rotationRef.current,
      transition: { damping: 18, stiffness: 200, type: "spring" },
    })
  }, [rotateControls])

  const handleSettingsToggle = useCallback(() => {
    // No-op: PopoverTrigger opens the StreamPanel popover directly
    setActivePanel(null)
  }, [])

  type ToolbarItem = {
    active: boolean
    icon: React.ElementType
    iconStyle?: string
    id: string
    label: string
    strokeWidth?: number
    type: "action" | "tab"
  }

  const items: ToolbarItem[] = [
    {
      active: expanded,
      icon: expanded ? Minimize2Icon : Maximize2Icon,
      id: "expand",
      label: expanded ? "Collapse" : "Expand",
      strokeWidth: 2.2,
      type: "action",
    },
    {
      active: false,
      icon: RotateCcwIcon,
      id: "refresh",
      label: "Refresh",
      strokeWidth: 2.5,
      type: "action",
    },
    {
      active: false,
      icon: theme === "dark" ? MoonIcon : SunIcon,
      iconStyle: "fill-current",
      id: "theme",
      label: theme === "dark" ? "Light mode" : "Dark mode",
      strokeWidth: 2.5,
      type: "action",
    },
    // {
    //   active: activePanel === "settings",
    //   icon: Settings2Icon,
    //   iconStyle: "fill-current size-4.5",
    //   id: "settings",
    //   label: "Settings",
    //   strokeWidth: 1.5,
    //   type: "tab",
    // },
    ...(codeUrl
      ? [
          {
            active: false,
            icon: CodeXmlIcon,
            iconStyle: "size-4.5",
            id: "code",
            label: "Source Code",
            strokeWidth: 2.8,
            type: "action" as const,
          },
        ]
      : []),
  ]

  const dividerIndex = items.findIndex((i) => i.type === "tab")

  const labelWidths = items.reduce(
    (acc, item) => acc + (item.active ? item.label.length * 7 + 24 : 0),
    0
  )
  const baseWidth =
    12 +
    36 * items.length +
    4 * Math.max(items.length - 1, 0) +
    (dividerIndex !== -1 ? 9 : 0)
  const pillWidth = baseWidth + labelWidths

  const pillHeight =
    activePanel === null ? 52 : contentHeight > 0 ? contentHeight + 52 : 52

  function handleItemClick(item: ToolbarItem) {
    if (item.id === "refresh") return
    if (item.type === "tab") {
      handleSettingsToggle()
    } else {
      if (item.id === "expand") onExpandToggle()
      if (item.id === "theme") onThemeToggle()
      if (item.id === "code" && codeUrl) {
        window.open(codeUrl, "_blank", "noopener,noreferrer")
      }
    }
  }

  return (
    <div
      className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-end"
      style={{ maxHeight: "calc(100% - 2rem)" }}
    >
      <div ref={containerRef}>
        <LayoutGroup>
          <motion.div
            animate={{ height: pillHeight, width: pillWidth }}
            className="relative overflow-hidden rounded-3xl bg-background"
            initial={false}
            transition={PILL_TRANSITION}
          >
            <div ref={contentRef} />

            <div className="absolute bottom-0 w-full bg-background p-2">
              <div className="flex h-9 items-center justify-center gap-1">
                {items.map((item, index) => {
                  const Icon = item.icon
                  const isActive = item.active
                  const sharedClassName = cn(
                    "flex h-9 cursor-pointer items-center rounded-2xl text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "bg-foreground/4 text-foreground"
                      : `
                        text-muted-foreground
                        hover:bg-muted hover:text-foreground
                      `,
                    item.id === "code" && "hover:bg-accent/10"
                  )
                  const sharedAnimate = {
                    gap: isActive ? ".5rem" : "0",
                    paddingLeft: isActive ? "1rem" : ".5rem",
                    paddingRight: isActive ? "1rem" : ".5rem",
                  }

                  if (item.id === "settings") {
                    return (
                      <span className="flex items-center gap-1" key={item.id}>
                        {dividerIndex === index && (
                          <div className="mx-0.5 h-5 w-px bg-border/60" />
                        )}
                        <PopoverTrigger
                          handle={handle}
                          nativeButton={false}
                          render={
                            <motion.div
                              animate={sharedAnimate}
                              className={sharedClassName}
                              initial={false}
                              onClick={() => handleSettingsToggle()}
                              transition={CONTENT_TRANSITION}
                            />
                          }
                        >
                          <motion.span className="inline-flex">
                            <Icon
                              className={cn("size-4", item.iconStyle)}
                              strokeWidth={item.strokeWidth}
                            />
                          </motion.span>
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.span
                                animate={{ opacity: 1, width: "auto" }}
                                className="overflow-hidden text-sm font-medium tracking-tight whitespace-nowrap"
                                exit={{ opacity: 0, width: 0 }}
                                initial={{ opacity: 0, width: 0 }}
                                transition={CONTENT_TRANSITION}
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </PopoverTrigger>
                      </span>
                    )
                  }

                  return (
                    <span className="flex items-center gap-1" key={item.id}>
                      {dividerIndex === index && (
                        <div className="mx-0.5 h-5 w-px bg-border/60" />
                      )}
                      <motion.button
                        animate={sharedAnimate}
                        className={sharedClassName}
                        initial={false}
                        onClick={() => handleItemClick(item)}
                        onTap={
                          item.id === "refresh"
                            ? () => {
                                onReload()
                                void handleRotateEnd()
                              }
                            : undefined
                        }
                        onTapStart={
                          item.id === "refresh" ? handleRotateStart : undefined
                        }
                        transition={CONTENT_TRANSITION}
                        type="button"
                      >
                        <motion.span
                          animate={
                            item.id === "refresh" ? rotateControls : undefined
                          }
                          className="inline-flex"
                        >
                          <Icon
                            className={cn("size-4", item.iconStyle)}
                            strokeWidth={item.strokeWidth}
                          />
                        </motion.span>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              animate={{ opacity: 1, width: "auto" }}
                              className="overflow-hidden text-sm font-medium tracking-tight whitespace-nowrap"
                              exit={{ opacity: 0, width: 0 }}
                              initial={{ opacity: 0, width: 0 }}
                              transition={CONTENT_TRANSITION}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </span>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </LayoutGroup>
      </div>
    </div>
  )
}

export { StreamPanelProvider }
