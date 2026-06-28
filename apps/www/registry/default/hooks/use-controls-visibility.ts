"use client"

import React from "react"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"

export interface UseControlsVisibilityOptions {
  controlsHideDelay?: number
  hideCursorOnIdle?: boolean
}

type RootInteractionProps = Pick<
  React.ComponentPropsWithoutRef<"div">,
  | "onBlur"
  | "onFocus"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onPointerMove"
  | "onPointerOver"
  | "onPointerUp"
>

export const CONTROLS_FORCE_VISIBLE_ATTRIBUTE = "data-controls-force-visible"

const CONTROLS_KEEP_VISIBLE_SELECTOR = `[${CONTROLS_FORCE_VISIBLE_ATTRIBUTE}]`

export function useControlsVisibility({
  controlsHideDelay = 2000,
  hideCursorOnIdle = true,
}: UseControlsVisibilityOptions = {}) {
  const debug = useMediaStore((state) => state.debug)
  const forceIdle = useMediaStore((state) => state.forceIdle)
  const idle = useMediaStore((state) => state.idle)
  const setIdle = useMediaStore((state) => state.setIdle)
  const status = usePlaybackStore((state) => state.status)
  const hideTimerRef = React.useRef<null | number>(null)
  const autoHide = controlsHideDelay > 0
  const controlsHidden =
    !debug &&
    !forceIdle &&
    idle &&
    status !== "buffering" &&
    status !== "error" &&
    status !== "paused"

  const clearHideTimer = React.useCallback(() => {
    if (hideTimerRef.current === null) return

    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = null
  }, [])

  const hideControls = React.useCallback(() => {
    if (forceIdle) return

    clearHideTimer()

    if (autoHide) {
      hideTimerRef.current = window.setTimeout(() => {
        setIdle(true)
        hideTimerRef.current = null
      }, controlsHideDelay)
      return
    }

    setIdle(true)
  }, [autoHide, clearHideTimer, controlsHideDelay, forceIdle, setIdle])

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

  const rootProps = React.useMemo<RootInteractionProps>(
    () => ({
      onBlur: (event) => {
        const relatedTarget = event.relatedTarget
        if (
          relatedTarget instanceof Node &&
          event.currentTarget.contains(relatedTarget)
        ) {
          return
        }

        hideControls()
      },
      onFocus: () => {
        showControls()
      },
      onPointerEnter: () => {
        showControls({ autoHide })
      },
      onPointerLeave: () => {
        hideControls()
      },
      onPointerMove: (event) => {
        showControls({
          autoHide: autoHide && !isKeepVisibleTarget(event.target),
        })
      },
      onPointerOver: (event) => {
        if (isKeepVisibleTarget(event.target)) {
          showControls()
        }
      },
      onPointerUp: (event) => {
        showControls({
          autoHide: autoHide && !isKeepVisibleTarget(event.target),
        })
      },
    }),
    [autoHide, hideControls, showControls]
  )

  return {
    className: hideCursorOnIdle && controlsHidden ? "cursor-none" : undefined,
    rootProps,
  }
}

function isKeepVisibleTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(CONTROLS_KEEP_VISIBLE_SELECTOR) !== null
  )
}
