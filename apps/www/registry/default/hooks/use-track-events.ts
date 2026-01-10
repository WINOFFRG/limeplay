import clamp from "lodash.clamp"
import * as React from "react"

export interface UseTrackEventsProps<E extends HTMLElement> {
  /** Progress is 0-1 based on the width of the bar and the pointer event, clamped */
  onPointerDown: (progress: number, event: React.PointerEvent<E>) => void
  /**
   * Progress is 0-1 based on the width of the bar and the pointer event, clamped
   * Fires on every move, even if the pointer is not down, use isPointerDown to disambiguate
   */
  onPointerMove: (
    progress: number,
    isPointerDown: boolean,
    event: React.PointerEvent<E>
  ) => void
  /**  */
  onPointerOut?: (event: React.PointerEvent<E>) => void
  /**  */
  onPointerUp?: (event: React.PointerEvent<E>) => void
  /** Orientation of the track. @default "horizontal" */
  orientation?: "horizontal" | "vertical"
}

export interface UseTrackEventsReturn<E extends HTMLElement> {
  onPointerDown: (e: React.PointerEvent<E>) => void
  onPointerMove: (e: React.PointerEvent<E>) => void
  onPointerOut: (e: React.PointerEvent<E>) => void
  onPointerUp: (e: React.PointerEvent<E>) => void
}

/** Events for a track/slider bar */
export function useTrackEvents<E extends HTMLElement>(
  props: UseTrackEventsProps<E>
): UseTrackEventsReturn<E> {
  const { orientation = "horizontal" } = props

  const getProgress = React.useCallback(
    (e: React.PointerEvent<E>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      let value: number

      if (orientation === "vertical") {
        value = 1 - (e.clientY - rect.top) / e.currentTarget.offsetHeight
      } else {
        value = (e.clientX - rect.left) / e.currentTarget.offsetWidth
      }

      return clamp(value, 0, 1)
    },
    [orientation]
  )

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<E>) => {
      // Ignore non-left clicks
      if (e.button !== 0) {
        return
      }

      e.stopPropagation()
      e.preventDefault()

      e.currentTarget.setPointerCapture(e.pointerId)
      const value = getProgress(e)
      const progress = clamp(value, 0, 1)
      props.onPointerDown(progress, e)
    },
    [props.onPointerDown, getProgress]
  )

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<E>) => {
      e.stopPropagation()
      e.preventDefault()

      const value = getProgress(e)
      const progress = clamp(value, 0, 1)
      props.onPointerMove(
        progress,
        e.currentTarget.hasPointerCapture(e.pointerId),
        e
      )
    },
    [props.onPointerMove, getProgress]
  )

  const onPointerUp = React.useCallback(
    (e: React.PointerEvent<E>) => {
      e.stopPropagation()
      e.preventDefault()

      e.currentTarget.releasePointerCapture(e.pointerId)
      props.onPointerUp?.(e)
    },
    [props.onPointerUp]
  )

  const onPointerOut = React.useCallback(
    (e: React.PointerEvent<E>) => {
      e.stopPropagation()
      e.preventDefault()
      props.onPointerOut?.(e)
    },
    [props.onPointerOut]
  )

  return { onPointerDown, onPointerMove, onPointerOut, onPointerUp }
}
