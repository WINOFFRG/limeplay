import React from "react"

import { cn } from "@/lib/utils"
import { durationDateTime, formatTimestamp } from "@/registry/default/lib/time"
import { useMediaStore } from "@/registry/default/ui/media-provider"

const HOURS_IN_SECONDS = 60 * 60

/**
 * Elapsed time
 * @note formatted as HH:MM:SS where HH only shows if > 1 hour
 */
export const Elapsed = React.forwardRef<
  HTMLTimeElement,
  React.HTMLProps<HTMLTimeElement>
>((props, forwardedRef) => {
  const { className, ...etc } = props
  const currentTime = useMediaStore((s) => s.currentTime)
  const duration = useMediaStore((s) => s.duration)
  const player = useMediaStore((s) => s.player)

  return (
    <time
      dateTime={durationDateTime(currentTime, player?.seekRange())}
      role="timer"
      {...etc}
      className={cn("tabular-nums", className)}
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
  const { className, ...etc } = props
  const duration = useMediaStore((s) => s.duration)
  const currentTime = useMediaStore((s) => s.currentTime)
  const player = useMediaStore((s) => s.player)

  return (
    <time
      dateTime={durationDateTime(duration - currentTime, player?.seekRange())}
      role="timer"
      className={cn("tabular-nums", className)}
      {...etc}
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
  const { className, ...etc } = props
  const duration = useMediaStore((s) => s.duration)
  const player = useMediaStore((s) => s.player)

  return (
    <time
      dateTime={durationDateTime(duration, player?.seekRange())}
      className={cn("tabular-nums", className)}
      ref={forwardedRef}
      {...etc}
    >
      <span className="sr-only">Duration</span>
      {formatTimestamp(duration, duration > HOURS_IN_SECONDS)}
    </time>
  )
})

Duration.displayName = "Duration"

export const HoverTime = React.forwardRef<
  HTMLTimeElement,
  React.HTMLProps<HTMLTimeElement>
>((props, forwardedRef) => {
  const { className, ...etc } = props
  const hoveringTime = useMediaStore((s) => s.hoveringTime)
  const player = useMediaStore((s) => s.player)
  const duration = useMediaStore((s) => s.duration)
  const isLive = useMediaStore((s) => s.isLive)

  const hoverTime = isLive ? duration - hoveringTime : hoveringTime

  return (
    <time
      dateTime={durationDateTime(hoveringTime, player?.seekRange())}
      className={cn("tabular-nums", className)}
      ref={forwardedRef}
      {...etc}
    >
      <span className="sr-only">Seek To:</span>
      {formatTimestamp(hoverTime, duration > HOURS_IN_SECONDS)}
    </time>
  )
})

HoverTime.displayName = "HoverTime"

export const LiveLatency = React.forwardRef<
  HTMLTimeElement,
  React.HTMLProps<HTMLTimeElement>
>((props, forwardedRef) => {
  const { className, ...etc } = props
  const liveLatency = useMediaStore((s) => s.liveLatency)

  if (liveLatency == null) return null

  return (
    <time ref={forwardedRef} {...etc} className={cn("tabular-nums", className)}>
      <span className="sr-only">Live Latency:</span>
      <span aria-hidden>&minus;</span>
      {formatTimestamp(liveLatency, liveLatency > HOURS_IN_SECONDS)}
    </time>
  )
})

LiveLatency.displayName = "LiveLatency"
