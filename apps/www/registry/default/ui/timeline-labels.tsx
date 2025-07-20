import React from "react"

import { durationDateTime, formatTimestamp } from "../lib/time"
import { useMediaStore } from "./media-provider"

const HOURS_IN_SECONDS = 60 * 60

/**
 * Elapsed time
 * @note formatted as HH:MM:SS where HH only shows if > 1 hour
 */
export const Elapsed = React.forwardRef<
  HTMLTimeElement,
  React.HTMLProps<HTMLTimeElement>
>((props, forwardedRef) => {
  const currentTime = useMediaStore((s) => s.currentTime)
  const duration = useMediaStore((s) => s.duration)

  return (
    <time
      dateTime={durationDateTime(currentTime)}
      role="timer"
      {...props}
      ref={forwardedRef}
    >
      <span className="sr-only">Elapsed</span>
      {formatTimestamp(currentTime, duration > HOURS_IN_SECONDS)}
    </time>
  )
})

Elapsed.displayName = "Elapsed"

/**
 * Remaining time
 * @note formatted as HH:MM:SS where HH only shows if > 1 hour
 */
export const Remaining = React.forwardRef<
  HTMLTimeElement,
  React.HTMLProps<HTMLTimeElement>
>((props, forwardedRef) => {
  const duration = useMediaStore((s) => s.duration)
  const currentTime = useMediaStore((s) => s.currentTime)

  return (
    <time
      dateTime={durationDateTime(duration - currentTime)}
      role="timer"
      {...props}
      ref={forwardedRef}
    >
      <span className="sr-only">Remaining</span>
      <span aria-hidden>&minus;</span>
      {formatTimestamp(duration - currentTime, duration > HOURS_IN_SECONDS)}
    </time>
  )
})

Remaining.displayName = "Remaining"

/**
 * Total Duration of the content
 * @note formatted as HH:MM:SS where HH only shows if > 1 hour
 * @description Time is formatted as HH:MM:SS where HH will only be shown if time has hour
 */
export const Duration = React.forwardRef<
  HTMLTimeElement,
  React.HTMLProps<HTMLTimeElement>
>((props, forwardedRef) => {
  const duration = useMediaStore((s) => s.duration)

  return (
    <time dateTime={durationDateTime(duration)} ref={forwardedRef} {...props}>
      <span className="sr-only">Duration</span>
      {formatTimestamp(duration)}
    </time>
  )
})

Duration.displayName = "Duration"
