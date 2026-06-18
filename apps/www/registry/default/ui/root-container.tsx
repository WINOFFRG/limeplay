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
   * Time in milliseconds before controls become idle after pointer activity.
   * Pass 0 to keep the immediate default behavior.
   */
  controlsHideDelay?: number
  /**
   * Height in pixels for aspect ratio calculation.
   * Used only if aspectRatio prop is not provided.
   */
  height?: number
  /**
   * Hide the cursor when controls are hidden.
   */
  hideCursorOnIdle?: boolean
  /**
   * Width in pixels for aspect ratio calculation.
   * Used only if aspectRatio prop is not provided.
   */
  width?: number
}

export type RootContainerPropsDocs = Pick<
  RootContainerProps,
  | "asChild"
  | "aspectRatio"
  | "controlsHideDelay"
  | "height"
  | "hideCursorOnIdle"
  | "width"
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
    controlsHideDelay = 0,
    height = 1080,
    hideCursorOnIdle = false,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    onPointerUp,
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
  const hideTimerRef = React.useRef<null | number>(null)
  const aspectRatio = React.useMemo(
    () => resolveAspectRatio(aspectRatioProp, width, height),
    [aspectRatioProp, height, width]
  )
  const Component = asChild ? Slot : "div"
  const controlsHidden =
    !debug &&
    !forceIdle &&
    idle &&
    status !== "buffering" &&
    status !== "paused"

  const clearHideTimer = React.useCallback(() => {
    if (hideTimerRef.current === null) return

    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = null
  }, [])

  const hideControls = React.useCallback(() => {
    if (forceIdle) return

    clearHideTimer()

    if (controlsHideDelay > 0) {
      hideTimerRef.current = window.setTimeout(() => {
        setIdle(true)
        hideTimerRef.current = null
      }, controlsHideDelay)
      return
    }

    setIdle(true)
  }, [clearHideTimer, controlsHideDelay, forceIdle, setIdle])

  const showControls = React.useCallback(
    (options?: { autoHide?: boolean }) => {
      if (forceIdle) return

      clearHideTimer()
      setIdle(false)

      if (options?.autoHide) {
        hideControls()
      }
    },
    [clearHideTimer, forceIdle, hideControls, setIdle]
  )

  React.useEffect(() => clearHideTimer, [clearHideTimer])

  React.useEffect(() => {
    if (forceIdle) {
      clearHideTimer()
    }
  }, [clearHideTimer, forceIdle])

  return (
    <Component
      aria-label="Media player"
      className={cn(
        `
          group/root
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        aspectRatio ? "aspect-(--aspect-ratio)" : "",
        hideCursorOnIdle && controlsHidden ? "cursor-none" : "",
        className
      )}
      data-idle={debug || forceIdle ? "false" : idle}
      data-layout-type="root-container"
      data-status={status}
      onBlur={composeEventHandlers(onBlur, (event) => {
        const relatedTarget = event.relatedTarget
        if (
          relatedTarget instanceof Node &&
          event.currentTarget.contains(relatedTarget)
        ) {
          return
        }

        hideControls()
      })}
      onFocus={composeEventHandlers(onFocus, () => {
        showControls()
      })}
      onPointerEnter={composeEventHandlers(onPointerEnter, () => {
        showControls({ autoHide: controlsHideDelay > 0 })
      })}
      onPointerLeave={composeEventHandlers(onPointerLeave, () => {
        hideControls()
      })}
      onPointerMove={composeEventHandlers(onPointerMove, () => {
        showControls({ autoHide: controlsHideDelay > 0 })
      })}
      onPointerUp={composeEventHandlers(onPointerUp, () => {
        showControls({ autoHide: controlsHideDelay > 0 })
      })}
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

function composeEventHandlers<E extends React.SyntheticEvent>(
  consumerHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void
) {
  return (event: E) => {
    consumerHandler?.(event)
    if (!event.defaultPrevented) {
      internalHandler(event)
    }
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
