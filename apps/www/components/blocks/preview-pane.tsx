"use client"

import { domAnimation, LazyMotion, m } from "motion/react"
import { usePathname, useRouter } from "next/navigation"
import React, { useCallback, useLayoutEffect, useState } from "react"

import { StreamPanelProvider } from "@/components/stream-panel"
import { useThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

import { BlockToolbar } from "./block-toolbar"

const EXPANDED_QUERY_PARAM = "expanded"

export function BlockPreviewWithToolbar({
  children,
  codeUrl,
}: {
  children: React.ReactNode
  codeUrl?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(() => {
    if (typeof window === "undefined") return false
    return getExpandedFromUrl()
  })
  const { isDark, toggleTheme } = useThemeToggle({
    blur: false,
    start: "top-right",
    variant: "circle",
  })
  const theme = isDark ? "dark" : "light"
  const [reloadKey, setReloadKey] = useState(0)

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

  return (
    <StreamPanelProvider>
      <LazyMotion features={domAnimation}>
        <m.div
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "z-40 overflow-hidden p-4",
            expanded
              ? `
                fixed inset-0 bg-background
                lg:inset-4
              `
              : "absolute inset-0 bg-transparent"
          )}
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

function getExpandedFromUrl() {
  return (
    new URLSearchParams(window.location.search).get(EXPANDED_QUERY_PARAM) ===
    "true"
  )
}
