"use client"

import React, { useImperativeHandle, useRef } from "react"
import { Slider as SliderPrimitive } from "@base-ui-components/react/slider"

import { cn } from "@/lib/utils"
import { MediaReadyState } from "@/registry/default/hooks/use-player"
import { useTimeline } from "@/registry/default/hooks/use-timeline"
import { useTrackEvents } from "@/registry/default/hooks/use-track-events"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export const Root = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Root>
>((props, ref) => {
  const internalRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>
  const { className, orientation = "horizontal", ...etc } = props

  const player = useMediaStore((s) => s.player)
  const currentTime = useMediaStore((s) => s.currentTime)
  const duration = useMediaStore((s) => s.duration)
  const isLive = useMediaStore((s) => s.isLive)
  const currentValue = duration ? (currentTime / duration) * 100 : 0
  const readyState = useMediaStore((s) => s.readyState)

  const disabled = props.disabled || readyState < MediaReadyState.HAVE_METADATA

  useImperativeHandle(ref, () => internalRef.current)
  const { seek, setHoveringTime, setIsHovering, getTimeFromEvent } =
    useTimeline()

  const trackEvents = useTrackEvents({
    onPointerDown: (progress, event) => {
      if (player) {
        const newTime = getTimeFromEvent(event)
        const seekRange = player.seekRange()

        const liveSeekTime = isLive
          ? seekRange.start +
            (newTime / duration) * (seekRange.end - seekRange.start)
          : newTime

        if (duration) {
          seek(liveSeekTime)
        }
      }
    },
    onPointerMove: (progress, isPointerDown, event) => {
      if (duration && player) {
        const newTime = getTimeFromEvent(event)
        const seekRange = player.seekRange()

        setHoveringTime(newTime)
        setIsHovering(true)

        const liveSeekTime = isLive ? seekRange.start + newTime : newTime

        if (isPointerDown) {
          seek(liveSeekTime)
        }
      }
    },
    onPointerUp: () => {
      setIsHovering(false)
    },
    orientation,
  })

  return (
    <SliderPrimitive.Root
      value={[currentValue]}
      className={cn(
        `
          relative h-1 rounded-full transition-[height] duration-(--speed-regularTransition) ease-out-quad
          data-[orientation=horizontal]:h-(--lp-timeline-track-height)
          active:data-[orientation=horizontal]:h-(--lp-timeline-track-height-active)
        `,
        className
      )}
      aria-label="Timeline Slider"
      orientation={orientation}
      ref={internalRef}
      {...trackEvents}
      {...etc}
      disabled={disabled}
    />
  )
})

Root.displayName = "SliderRoot"

export const Track = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Track>
>((props, ref) => {
  const { className, ...etc } = props

  return (
    <SliderPrimitive.Track
      ref={ref}
      tabIndex={0}
      className={cn(
        `
          relative flex h-full grow flex-row rounded-full bg-foreground/20
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        className
      )}
      {...etc}
    />
  )
})

Track.displayName = "SliderTrack"

export const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SliderPrimitive.Track>
>((props, ref) => {
  const { className, ...etc } = props

  const progress = useMediaStore((s) => s.progress)

  return (
    <SliderPrimitive.Indicator
      ref={ref}
      className={cn(
        "h-full w-(--lp-played-width)! rounded-s-full bg-primary",
        className
      )}
      style={
        {
          "--lp-played-width": `${progress * 100}%`,
        } as React.CSSProperties
      }
      {...etc}
    />
  )
})

Progress.displayName = "SliderProgress"

interface ThumbProps
  extends React.ComponentProps<typeof SliderPrimitive.Thumb> {
  /**
   * Custom position of the thumb in percentage
   */
  position?: number
  /**
   * Thumb moves with the cursor seeking over the timeline
   */
  showWithHover?: boolean
}

interface BufferedProps
  extends React.ComponentProps<typeof SliderPrimitive.Track> {
  variant?: "combined" | "from-zero" | "default"
}

export const Buffered = React.forwardRef<HTMLDivElement, BufferedProps>(
  (props, ref) => {
    const { className, variant = "default", ...etc } = props

    const buffered = useMediaStore((s) => s.buffered)
    const duration = useMediaStore((s) => s.duration)
    const { processBufferedRanges } = useTimeline()

    if (!duration || !buffered.length) {
      return null
    }

    const normalizedPercentages = processBufferedRanges(buffered, variant)

    return (
      <div ref={ref} className={cn("absolute size-full", className)} {...etc}>
        {normalizedPercentages.map(({ startPercent, widthPercent }, index) => (
          <SliderPrimitive.Indicator
            key={index}
            className={cn(
              `left-(--lp-buffered-start)! h-full w-(--lp-buffered-width)! bg-foreground/30`,
              variant === "from-zero" && "rounded-e-full",
              className
            )}
            style={
              {
                "--lp-buffered-start": `${startPercent}%`,
                "--lp-buffered-width": `${widthPercent}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    )
  }
)

Buffered.displayName = "SliderBuffered"

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(
  (props, ref) => {
    const { className, position, showWithHover = false, ...etc } = props
    const hoveringTime = useMediaStore((s) => s.hoveringTime)
    const duration = useMediaStore((s) => s.duration)
    const currentTime = useMediaStore((s) => s.currentTime)

    let finalPosition = 0

    if (!duration) {
      return null
    }

    if (position && Number.isFinite(position)) {
      finalPosition = position
    } else if (showWithHover) {
      finalPosition = (hoveringTime / duration) * 100
    } else {
      finalPosition = (currentTime / duration) * 100
    }

    return (
      <SliderPrimitive.Thumb
        className={cn(
          `
            left-(--lp-timeline-thumb-position)! size-4 rounded-full bg-foreground
            data-disabled:bg-foreground/85
          `,
          className
        )}
        ref={ref}
        {...etc}
        style={
          {
            "--lp-timeline-thumb-position": `${finalPosition}%`,
          } as React.CSSProperties
        }
      />
    )
  }
)

Thumb.displayName = "SliderThumb"
