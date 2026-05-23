"use client"

import { motion } from "motion/react"
import React, { useCallback, useEffect, useRef, useState } from "react"

import { StreamPanel, StreamPanelProvider } from "@/components/stream-panel"
import { useThemeToggle } from "@/components/theme-toggle"

import { BlockToolbar } from "./block-toolbar"

export function BlockPreviewWithToolbar({
  children,
  codeUrl,
}: {
  children: React.ReactNode
  codeUrl?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const { isDark, toggleTheme } = useThemeToggle({
    blur: false,
    start: "top-right",
    variant: "circle",
  })
  const theme = isDark ? "dark" : "light"
  const [reloadKey, setReloadKey] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelRect, setPanelRect] = useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
  })

  useEffect(() => {
    if (!panelRef.current) return
    const update = () => {
      if (!panelRef.current) return
      const rect = panelRef.current.getBoundingClientRect()
      setPanelRect({
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(panelRef.current)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const handleExpandToggle = useCallback(() => {
    setExpanded((e) => !e)
  }, [])

  const handleReload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  const expandedInset = 16
  const [windowSize, setWindowSize] = useState({ height: 0, width: 0 })

  useEffect(() => {
    const update = () =>
      setWindowSize({ height: window.innerHeight, width: window.innerWidth })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // DEV: This controls the breadcumbs to be hidden when preview is expanded
  useEffect(() => {
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
      <div className="absolute inset-0" ref={panelRef} />
      <motion.div
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
      </motion.div>
      <StreamPanel
        align="end"
        playerType="video"
        side="top"
        variant="anchored"
      />
    </StreamPanelProvider>
  )
}
