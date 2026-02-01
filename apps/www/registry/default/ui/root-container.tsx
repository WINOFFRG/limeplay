"use client"

import { composeRefs } from "@radix-ui/react-compose-refs"
import React from "react"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export interface RootContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Height in pixels for aspect ratio calculation.
   * Used only if aspectRatio prop is not provided.
   */
  height?: number
  /**
   * Width in pixels for aspect ratio calculation.
   * Used only if aspectRatio prop is not provided.
   */
  width?: number
}

export type RootContainerPropsDocs = Pick<
  RootContainerProps,
  "height" | "width"
>

export const RootContainer = React.forwardRef<
  HTMLDivElement,
  RootContainerProps
>((props, forwardedRef) => {
  const { children, className, height = 1080, width = 1920, ...etc } = props
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
      aria-label="Media player"
      className={cn(
        className,
        `
          group/root aspect-(--aspect-ratio)
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        className
      )}
      data-idle={debug || forceIdle ? "false" : idle}
      data-layout-type="root-container"
      data-status={status}
      onBlur={() => {
        if (!forceIdle) {
          setIdle(true)
        }
      }}
      onFocus={() => {
        if (!forceIdle) {
          setIdle(false)
        }
      }}
      onPointerEnter={() => {
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
      onPointerUp={() => {
        if (!forceIdle) {
          setIdle(false)
        }
      }}
      ref={composeRefs(forwardedRef, setPlayerContainerRef)}
      role="region"
      style={{
        ["--aspect-ratio" as string]: aspectRatio,
        ["--height" as string]: height,
        ["--width" as string]: width,
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
