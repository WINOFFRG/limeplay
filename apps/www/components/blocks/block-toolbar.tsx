"use client"

import {
  CodeXmlIcon,
  CogIcon,
  type LucideIcon,
  Maximize2Icon,
  Minimize2Icon,
  MoonIcon,
  RotateCcwIcon,
  SunIcon,
} from "lucide-react"
import {
  AnimatePresence,
  domAnimation,
  LayoutGroup,
  LazyMotion,
  m,
  useAnimationControls,
} from "motion/react"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { StreamPanel, useStreamPanel } from "@/components/stream-panel"
import { cn } from "@/lib/utils"

const PILL_TRANSITION = { bounce: 0, duration: 0.24, type: "spring" } as const
const CONTENT_TRANSITION = {
  bounce: 0,
  duration: 0.6,
  type: "spring",
} as const
const PANEL_CONTENT_MAX_HEIGHT = 420
const PANEL_CONTENT_MIN_HEIGHT = 168

interface BlockToolbarProps {
  codeUrl?: string
  expanded: boolean
  onExpandToggle: () => void
  onReload: () => void
  onThemeToggle: () => void
  theme: "dark" | "light"
}

export function BlockToolbar({
  codeUrl,
  expanded,
  onExpandToggle,
  onReload,
  onThemeToggle,
  theme,
}: BlockToolbarProps) {
  const { controller, open, setOpen } = useStreamPanel()
  const rotateControls = useAnimationControls()
  const rotationRef = useRef(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const rootResizeObserverRef = useRef<null | ResizeObserver>(null)
  const toolbarResizeObserverRef = useRef<null | ResizeObserver>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [availableHeight, setAvailableHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [toolbarHeight, setToolbarHeight] = useState<null | number>(null)

  const handleRootRef = useCallback((node: HTMLDivElement | null) => {
    rootResizeObserverRef.current?.disconnect()
    rootRef.current = node

    if (!node) return

    setAvailableHeight(node.getBoundingClientRect().height)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAvailableHeight(entry.contentRect.height)
      }
    })
    observer.observe(node)
    rootResizeObserverRef.current = observer
  }, [])

  const handleToolbarRef = useCallback((node: HTMLDivElement | null) => {
    toolbarResizeObserverRef.current?.disconnect()
    toolbarRef.current = node

    if (!node) return

    setToolbarHeight(node.getBoundingClientRect().height)

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setToolbarHeight(entry.target.getBoundingClientRect().height)
      }
    })
    observer.observe(node)
    toolbarResizeObserverRef.current = observer
  }, [])

  const updateContentHeight = useCallback(() => {
    if (!open || !contentRef.current) {
      setContentHeight(0)
      return
    }
    setContentHeight(getStreamPanelContentHeight(contentRef.current))
  }, [open])

  useLayoutEffect(() => {
    if (!open || !contentRef.current) {
      setContentHeight(0)
      return
    }

    const root = contentRef.current
    let frameId = 0
    const scheduleResizeUpdate = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(updateContentHeight)
    }
    const resizeObserver = new ResizeObserver(scheduleResizeUpdate)
    const observeTargets = () => {
      resizeObserver.disconnect()
      resizeObserver.observe(root)
      root
        .querySelectorAll<HTMLElement>(
          `
            [data-stream-panel-root],
            [data-stream-panel-overlay],
            [data-stream-panel-overlay-header],
            [data-stream-panel-overlay-body]
          `
        )
        .forEach((target) => resizeObserver.observe(target))
      updateContentHeight()
    }
    const mutationObserver = new MutationObserver(observeTargets)

    observeTargets()
    mutationObserver.observe(root, {
      attributeFilter: ["class", "data-stream-panel-overlay", "style"],
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => {
      cancelAnimationFrame(frameId)
      mutationObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [open, updateContentHeight])

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
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

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
    setOpen((value) => !value)
  }, [setOpen])

  type ToolbarItem = {
    active: boolean
    icon: LucideIcon
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
    {
      active: open,
      icon: CogIcon,
      iconStyle: "size-4.5 stroke-[2.5]",
      id: "settings",
      label: "Settings",
      strokeWidth: 1.5,
      type: "tab",
    },
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
  const expandedPanelWidth = 296
  const toolbarWidth = open
    ? Math.max(pillWidth, expandedPanelWidth)
    : pillWidth

  const measuredToolbarHeight = toolbarHeight ?? 0
  const availableContentHeight =
    availableHeight > 0
      ? Math.max(0, availableHeight - measuredToolbarHeight)
      : PANEL_CONTENT_MAX_HEIGHT
  const maxContentHeight = Math.min(
    PANEL_CONTENT_MAX_HEIGHT,
    availableContentHeight
  )
  const minContentHeight = Math.min(PANEL_CONTENT_MIN_HEIGHT, maxContentHeight)
  const boundedContentHeight = open
    ? Math.min(Math.max(contentHeight, minContentHeight), maxContentHeight)
    : 0
  const naturalPillHeight = measuredToolbarHeight + boundedContentHeight
  const pillHeight = toolbarHeight === null ? "auto" : naturalPillHeight

  function handleItemClick(item: ToolbarItem) {
    if (item.type !== "tab") setOpen(false)

    if (item.id === "refresh") {
      onReload()
      void handleRotateEnd()
      return
    }
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
      className="pointer-events-none absolute inset-y-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-end"
      ref={handleRootRef}
    >
      <div className="pointer-events-auto max-h-full" ref={containerRef}>
        <LazyMotion features={domAnimation}>
          <LayoutGroup>
            <m.div
              animate={{ height: pillHeight, width: toolbarWidth }}
              className="relative flex flex-col overflow-hidden rounded-4xl bg-background shadow-2xl ring-1 shadow-background/35 ring-border/60"
              initial={false}
              transition={PILL_TRANSITION}
            >
              <div
                className="w-full bg-background px-0 py-2"
                ref={handleToolbarRef}
              >
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
                          <m.button
                            animate={sharedAnimate}
                            className={sharedClassName}
                            initial={false}
                            onClick={handleSettingsToggle}
                            transition={CONTENT_TRANSITION}
                            type="button"
                          >
                            <m.span className="inline-flex">
                              <Icon
                                className={cn("size-4", item.iconStyle)}
                                strokeWidth={item.strokeWidth}
                              />
                            </m.span>
                            <AnimatePresence initial={false}>
                              {isActive && (
                                <m.span
                                  animate={{ opacity: 1, width: "auto" }}
                                  className="overflow-hidden text-sm font-medium tracking-tight whitespace-nowrap"
                                  exit={{ opacity: 0, width: 0 }}
                                  initial={{ opacity: 0, width: 0 }}
                                  transition={CONTENT_TRANSITION}
                                >
                                  {item.label}
                                </m.span>
                              )}
                            </AnimatePresence>
                          </m.button>
                        </span>
                      )
                    }

                    return (
                      <span className="flex items-center gap-1" key={item.id}>
                        {dividerIndex === index && (
                          <div className="mx-0.5 h-5 w-px bg-border/60" />
                        )}
                        <m.button
                          animate={sharedAnimate}
                          className={sharedClassName}
                          initial={false}
                          onClick={() => handleItemClick(item)}
                          onTapStart={
                            item.id === "refresh"
                              ? handleRotateStart
                              : undefined
                          }
                          transition={CONTENT_TRANSITION}
                          type="button"
                        >
                          <m.span
                            animate={
                              item.id === "refresh" ? rotateControls : undefined
                            }
                            className="inline-flex"
                          >
                            <Icon
                              className={cn("size-4", item.iconStyle)}
                              strokeWidth={item.strokeWidth}
                            />
                          </m.span>
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <m.span
                                animate={{ opacity: 1, width: "auto" }}
                                className="overflow-hidden text-sm font-medium tracking-tight whitespace-nowrap"
                                exit={{ opacity: 0, width: 0 }}
                                initial={{ opacity: 0, width: 0 }}
                                transition={CONTENT_TRANSITION}
                              >
                                {item.label}
                              </m.span>
                            )}
                          </AnimatePresence>
                        </m.button>
                      </span>
                    )
                  })}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {open && (
                  <m.div
                    animate={{ opacity: 1, y: 0 }}
                    className="no-scrollbar min-h-0 min-w-[200px] flex-1 overflow-y-auto overscroll-contain"
                    exit={{ opacity: 0, y: 4 }}
                    initial={{ opacity: 0, y: 8 }}
                    transition={CONTENT_TRANSITION}
                  >
                    <div className="px-2 pb-2" ref={contentRef}>
                      {controller ? (
                        <StreamPanel
                          onLoadStream={controller.onLoadStream}
                          onPlaylistChange={controller.onPlaylistChange}
                          onPresetChange={controller.onPresetChange}
                          playerType={controller.playerType}
                          variant="children"
                        />
                      ) : (
                        <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                          Player settings unavailable
                        </div>
                      )}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          </LayoutGroup>
        </LazyMotion>
      </div>
    </div>
  )
}

function getBlockSpacing(element: HTMLElement, axis: "margin" | "padding") {
  const style = getComputedStyle(element)
  return parseFloat(style[`${axis}Top`]) + parseFloat(style[`${axis}Bottom`])
}

function getStreamPanelContentHeight(root: HTMLElement) {
  const panelRoot = root.querySelector<HTMLElement>("[data-stream-panel-root]")
  const wrapperSpacing = getBlockSpacing(root, "padding")
  const panelSpacing = panelRoot ? getBlockSpacing(panelRoot, "margin") : 0
  const activeOverlay = root.querySelector<HTMLElement>(
    '[data-stream-panel-overlay="active"]'
  )

  if (!activeOverlay) {
    return Math.ceil(
      wrapperSpacing +
        panelSpacing +
        (panelRoot?.scrollHeight ?? root.scrollHeight)
    )
  }

  const overlayHeader = activeOverlay.querySelector<HTMLElement>(
    "[data-stream-panel-overlay-header]"
  )
  const overlayBody = activeOverlay.querySelector<HTMLElement>(
    "[data-stream-panel-overlay-body]"
  )
  const headerHeight = overlayHeader
    ? overlayHeader.getBoundingClientRect().height +
      getBlockSpacing(overlayHeader, "margin")
    : 0
  const bodyHeight = overlayBody?.scrollHeight ?? activeOverlay.scrollHeight

  return Math.ceil(wrapperSpacing + panelSpacing + headerHeight + bodyHeight)
}
