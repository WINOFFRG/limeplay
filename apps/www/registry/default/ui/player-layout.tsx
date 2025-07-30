"use client"

import type { ComponentPropsWithoutRef } from "react"
import React from "react"
import { composeRefs } from "@radix-ui/react-compose-refs"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function PlayerContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-layout-type="player-container"
      className={cn(
        `relative z-20 aspect-(--aspect-ratio) max-h-[min(var(--height,_720px),_calc(100vh_-_16px_*_2))] w-full overflow-hidden rounded-lg`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ControlsContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-layout-type="controls-container"
      className={cn(
        `pointer-events-none absolute inset-0 isolate contain-strict`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ControlsOverlayContainer() {
  return (
    <div
      className={`
        pointer-events-none absolute inset-0 bg-black/30 bg-linear-to-t from-black/30 to-transparent to-[120px] transition-opacity duration-300
        ease-out
        group-data-[idle=true]/root:opacity-0
      `}
    />
  )
}

export interface RootContainerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  height?: number
  width?: number
}

export const RootContainer = React.forwardRef<
  HTMLDivElement,
  RootContainerProps
>((props, forwardedRef) => {
  const { children, height, width, className } = props
  const idle = useMediaStore((state) => state.idle)
  const setIdle = useMediaStore((state) => state.setIdle)
  const status = useMediaStore((state) => state.status)

  const setPlayerContainerRef = useMediaStore(
    (state) => state.setPlayerContainerRef
  )
  const aspectRatio = React.useMemo(
    () => calculateAspectRatio(width, height),
    [height, width]
  )
    ?.split(":")
    .join("/")

  return (
    <div
      tabIndex={0}
      aria-label="Media player"
      role="region"
      data-idle={idle}
      ref={composeRefs(forwardedRef, setPlayerContainerRef)}
      data-status={status}
      data-theme={"light"}
      style={{
        ["--width" as string]: `${width}px`,
        ["--height" as string]: `${height}px`,
        ["--aspect-ratio" as string]: aspectRatio,
        aspectRatio: aspectRatio,
      }}
      className={cn(
        `
          group/root m-auto max-w-[var(--width,1280px)] min-w-80
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        className
      )}
      // Show controls like tabbing over
      // onKeyDown={}
      // onPointerMove show controls again
      // onPointerUp IDK yet, but probably
      // onPointerLeave hide controls now, maybe with timeout?
      // onFocus show controls and set focus true so that keyboard shortcuts are triggered
      // onBlur hide controls and set focus to false
      onPointerUp={() => {
        setIdle(false)
      }}
      onPointerLeave={() => {
        setIdle(true)
      }}
      onPointerMove={() => {
        setIdle(false)
      }}
      onPointerEnter={() => {
        setIdle(false)
      }}
      onFocus={() => {
        setIdle(false)
      }}
      onBlur={() => {
        setIdle(true)
      }}
      {...props}
    >
      {children}
    </div>
  )
})

RootContainer.displayName = "RootContainer"

function calculateAspectRatio(width?: number, height?: number) {
  if (width && height) {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b)
    }
    const divisor = gcd(width, height)
    const aspectWidth = width / divisor
    const aspectHeight = height / divisor
    return `${aspectWidth}:${aspectHeight}`
  }
}
