"use client"

import { domAnimation, LazyMotion, m } from "motion/react"
import { usePathname, useRouter } from "next/navigation"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { StreamPanelProvider } from "@/components/stream-panel"
import { useThemeToggle } from "@/components/theme-toggle"

import { BlockToolbar } from "./block-toolbar"

const EXPANDED_QUERY_PARAM = "expanded"

type PreviewRect = {
  height: number | string
  left: number | string
  top: number
  width: number
}

export function BlockPreviewWithToolbar({
  children,
  codeUrl,
}: {
  children: React.ReactNode
  codeUrl?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const { isDark, toggleTheme } = useThemeToggle({
    blur: false,
    start: "top-right",
    variant: "circle",
  })
  const theme = isDark ? "dark" : "light"
  const [reloadKey, setReloadKey] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelRect, setPanelRect] = useState<PreviewRect>({
    height: "100%",
    left: "100%",
    top: 0,
    width: 0,
  })

  const handlePanelRef = useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node
    if (node) setPanelRect(getElementRect(node))
  }, [])

  useEffect(() => {
    if (!panelRef.current) return
    const update = () => {
      if (!panelRef.current) return
      setPanelRect(getElementRect(panelRef.current))
    }
    const ro = new ResizeObserver(update)
    ro.observe(panelRef.current)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const updateExpandedQuery = useCallback(
    (nextExpanded: boolean) => {
      const nextSearchParams = new URLSearchParams(window.location.search)
      if (nextExpanded) {
        nextSearchParams.set(EXPANDED_QUERY_PARAM, "true")
      } else {
        nextSearchParams.delete(EXPANDED_QUERY_PARAM)
      }

      const queryString = nextSearchParams.toString()
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router]
  )

  const handleExpandToggle = useCallback(() => {
    setExpanded((currentExpanded) => {
      const nextExpanded = !currentExpanded
      updateExpandedQuery(nextExpanded)
      return nextExpanded
    })
  }, [updateExpandedQuery])

  const handleReload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  const expandedInset = 16
  const [windowSize, setWindowSize] = useState(getWindowSize)

  useEffect(() => {
    const update = () => setWindowSize(getWindowSize())
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useLayoutEffect(() => {
    setExpanded(getExpandedFromUrl())
  }, [pathname])

  // DEV: This controls the left doc section to be hidden when preview is expanded
  useLayoutEffect(() => {
    document.documentElement.dataset.blockPreviewExpanded = expanded
      ? "true"
      : "false"
    return () => {
      document.documentElement.dataset.blockPreviewExpanded = "false"
    }
  }, [expanded])

  const collapsedStyle = {
    height: panelRect.height,
    left: panelRect.left,
    top: panelRect.top,
    width: panelRect.width,
  }

  const expandedStyle = {
    height: windowSize.height - expandedInset * 2,
    left: expandedInset,
    top: expandedInset,
    width: windowSize.width - expandedInset * 2,
  }

  return (
    <StreamPanelProvider>
      <div className="absolute inset-0" ref={handlePanelRef} />
      <LazyMotion features={domAnimation}>
        <m.div
          animate={expanded ? expandedStyle : collapsedStyle}
          className="fixed z-40 overflow-hidden bg-transparent p-4"
          initial={false}
          transition={{ damping: 35, stiffness: 300, type: "spring" }}
        >
          <div className="flex size-full flex-col">
            <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-muted">
              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden"
                key={reloadKey}
              >
                {children}
              </div>

              <BlockToolbar
                codeUrl={codeUrl}
                expanded={expanded}
                onExpandToggle={handleExpandToggle}
                onReload={handleReload}
                onThemeToggle={toggleTheme}
                theme={theme}
              />
            </div>
          </div>
        </m.div>
      </LazyMotion>
    </StreamPanelProvider>
  )
}

function getElementRect(element: HTMLElement): PreviewRect {
  const rect = element.getBoundingClientRect()
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  }
}

function getExpandedFromUrl() {
  return (
    new URLSearchParams(window.location.search).get(EXPANDED_QUERY_PARAM) ===
    "true"
  )
}

function getWindowSize() {
  if (typeof window === "undefined") return { height: 0, width: 0 }
  return { height: window.innerHeight, width: window.innerWidth }
}
