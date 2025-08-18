"use client"

import React from "react"
import { composeRefs } from "@radix-ui/react-compose-refs"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface RootContainerProps
  extends React.ComponentPropsWithoutRef<"div"> {
  height?: number
  width?: number
}

export const RootContainer = React.forwardRef<
  HTMLDivElement,
  RootContainerProps
>((props, forwardedRef) => {
  const { children, height, width, className, ...etc } = props
  const idle = useMediaStore((state) => state.idle)
  const forceIdle = useMediaStore((state) => state.forceIdle)
  const setIdle = useMediaStore((state) => state.setIdle)
  const status = useMediaStore((state) => state.status)
  const debug = useMediaStore((state) => state.debug)

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
      data-layout-type="root-container"
      tabIndex={0}
      aria-label="Media player"
      role="region"
      data-idle={debug || forceIdle ? "false" : idle}
      ref={composeRefs(forwardedRef, setPlayerContainerRef)}
      data-status={status}
      style={{
        ["--aspect-ratio" as string]: aspectRatio,
        ["--height" as string]: height,
        ["--width" as string]: width,
      }}
      className={cn(
        className,
        `
          group/root aspect-(--aspect-ratio)
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `
      )}
      // Show controls like tabbing over
      // onKeyDown={}
      // onPointerMove show controls again
      // onPointerUp IDK yet, but probably
      // onPointerLeave hide controls now, maybe with timeout?
      // onFocus show controls and set focus true so that keyboard shortcuts are triggered
      // onBlur hide controls and set focus to false
      onPointerUp={() => {
        if (!forceIdle) {
          setIdle(false)
        }
      }}
      onPointerLeave={() => {
        if (!forceIdle) {
          setIdle(true)
        }
      }}
      onPointerMove={() => {
        if (!forceIdle) {
          setIdle(false)
        }
      }}
      onPointerEnter={() => {
        if (!forceIdle) {
          setIdle(false)
        }
      }}
      onFocus={() => {
        if (!forceIdle) {
          setIdle(false)
        }
      }}
      onBlur={() => {
        if (!forceIdle) {
          setIdle(true)
        }
      }}
      {...etc}
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
