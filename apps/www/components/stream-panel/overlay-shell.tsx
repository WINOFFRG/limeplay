"use client"

import { ChevronLeft } from "lucide-react"
import { domAnimation, LazyMotion, m } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"

export type OverlayShellPlacement = "active" | "covered" | "idle"

interface OverlayShellProps {
  children: React.ReactNode
  description?: string
  onBack: () => void
  placement?: OverlayShellPlacement
  show: boolean
  title: string
}

export function OverlayShell({
  children,
  description,
  onBack,
  placement: placementProp,
  show,
  title,
}: OverlayShellProps) {
  const placement = placementProp ?? (show ? "active" : "idle")
  const lastVisiblePlacementRef = React.useRef<OverlayShellPlacement>("active")
  const wasVisibleRef = React.useRef(placement !== "idle")
  const [, forceRender] = React.useReducer(increment, 0)

  if (placement !== "idle") {
    lastVisiblePlacementRef.current = placement
    wasVisibleRef.current = true
  }

  const shouldRender = placement !== "idle" || wasVisibleRef.current
  const visiblePlacement =
    placement === "idle" ? lastVisiblePlacementRef.current : placement

  if (!shouldRender) return null

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={{ x: placement === "idle" ? "100%" : "0%" }}
        className={cn(
          "absolute inset-0 flex flex-col bg-background",
          visiblePlacement === "active" ? "z-20" : "z-10"
        )}
        data-stream-panel-overlay={placement}
        inert={placement !== "active" ? true : undefined}
        initial={{ x: "100%" }}
        onAnimationComplete={() => {
          if (placement === "idle") {
            wasVisibleRef.current = false
            forceRender()
          }
        }}
        transition={{
          bounce: 0,
          duration: placement === "idle" ? 0.16 : 0.34,
          type: "spring",
        }}
      >
        <div
          className="flex min-h-10 items-center gap-2 rounded-[22px] px-1"
          data-stream-panel-overlay-header=""
        >
          <Button
            className={`
              rounded-xl
              hover:bg-foreground/4 hover:text-foreground
              focus-visible:bg-foreground/4 focus-visible:text-foreground
              active:scale-[0.97]
            `}
            onClick={onBack}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="min-w-0">
            <span className="block truncate text-[13px]/4 font-semibold tracking-tight">
              {title}
            </span>
            {description ? (
              <span className="mt-2 block truncate text-[11px]/3 text-muted-foreground">
                {description}
              </span>
            ) : null}
          </span>
        </div>

        <div className="min-h-0" data-stream-panel-overlay-body="">
          {children}
        </div>
      </m.div>
    </LazyMotion>
  )
}

function increment(value: number) {
  return value + 1
}
