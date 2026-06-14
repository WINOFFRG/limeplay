"use client"

import { composeRefs } from "@radix-ui/react-compose-refs"
import React from "react"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { usePlayerStore } from "@/registry/default/hooks/use-player"

export interface RootContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  /**
   * Aspect ratio for the player root. Pass false for players that should size
   * from their content, such as compact audio controls.
   */
  aspectRatio?: false | number | string
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
  "aspectRatio" | "height" | "width"
>

export const RootContainer = React.forwardRef<
  HTMLDivElement,
  RootContainerProps
>((props, forwardedRef) => {
  const {
    aspectRatio: aspectRatioProp,
    children,
    className,
    height = 1080,
    style,
    width = 1920,
    ...etc
  } = props
  const idle = useMediaStore((state) => state.idle)
  const forceIdle = useMediaStore((state) => state.forceIdle)
  const setIdle = useMediaStore((state) => state.setIdle)
  const status = usePlaybackStore((state) => state.status)
  const debug = useMediaStore((state) => state.debug)

  const setPlayerContainerRef = usePlayerStore((state) => state.setContainerRef)
  const aspectRatio = React.useMemo(
    () => resolveAspectRatio(aspectRatioProp, width, height),
    [aspectRatioProp, height, width]
  )

  return (
    <div
      aria-label="Media player"
      className={cn(
        `
          group/root
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        aspectRatio ? "aspect-(--aspect-ratio)" : "",
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
        ...style,
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

function resolveAspectRatio(
  aspectRatio: false | number | string | undefined,
  width?: number,
  height?: number
) {
  if (aspectRatio === false) return undefined
  if (typeof aspectRatio === "number") return String(aspectRatio)
  if (typeof aspectRatio === "string") {
    return aspectRatio.split(":").join("/")
  }

  return calculateAspectRatio(width, height)?.split(":").join("/")
}
