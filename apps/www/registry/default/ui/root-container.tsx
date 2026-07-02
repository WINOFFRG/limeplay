"use client"

import { composeRefs } from "@radix-ui/react-compose-refs"
import { Slot } from "@radix-ui/react-slot"
import React from "react"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { usePlayerStore } from "@/registry/default/hooks/use-player"

export interface RootContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
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
  render?: React.ReactElement
  /**
   * Width in pixels for aspect ratio calculation.
   * Used only if aspectRatio prop is not provided.
   */
  width?: number
}

export type RootContainerPropsDocs = Pick<
  RootContainerProps,
  "asChild" | "aspectRatio" | "height" | "render" | "width"
>

export const RootContainer = React.forwardRef<
  HTMLDivElement,
  RootContainerProps
>((props, forwardedRef) => {
  const {
    asChild = false,
    aspectRatio: aspectRatioProp,
    children,
    className,
    height = 1080,
    render,
    style,
    width = 1920,
    ...etc
  } = props
  const idle = useMediaStore((state) => state.idle)
  const forceIdle = useMediaStore((state) => state.forceIdle)
  const status = usePlaybackStore((state) => state.status)
  const debug = useMediaStore((state) => state.debug)

  const setPlayerContainerRef = usePlayerStore((state) => state.setContainerRef)
  const aspectRatio = React.useMemo(
    () => resolveAspectRatio(aspectRatioProp, width, height),
    [aspectRatioProp, height, width]
  )
  const Component = render ? Slot : asChild ? Slot : "div"

  return (
    <Component
      aria-label="Media player"
      className={cn(
        `
          group/root @container/root
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        aspectRatio ? "aspect-(--aspect-ratio)" : "",
        className
      )}
      data-idle={debug || forceIdle ? "false" : idle}
      data-layout-type="root-container"
      data-status={status}
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
      {render ? React.cloneElement(render, undefined, children) : children}
    </Component>
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
