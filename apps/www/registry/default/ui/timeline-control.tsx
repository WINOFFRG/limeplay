"use client"

import React, { useImperativeHandle, useRef } from "react"
import { Slider as SliderPrimitive } from "@base-ui-components/react/slider"

import { cn } from "@/lib/utils"
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

  const currentTime = useMediaStore((s) => s.currentTime)
  const duration = useMediaStore((s) => s.duration)
  const currentValue = duration ? (currentTime / duration) * 100 : 0

  useImperativeHandle(ref, () => internalRef.current)
  const { seek, setHoveringTime, setIsHovering, getTimeFromEvent } =
    useTimeline()

  const trackEvents = useTrackEvents({
    onPointerDown: (progress, event) => {
      const newTime = getTimeFromEvent(event)
      if (duration) {
        seek(newTime)
      }
    },
    onPointerMove: (progress, isPointerDown, event) => {
      if (duration) {
        setHoveringTime(getTimeFromEvent(event))
        setIsHovering(true)

        if (isPointerDown) {
          seek(getTimeFromEvent(event))
        }
      }
    },
    onPointerUp: (event) => {
      setIsHovering(false)
    },
    orientation,
  })

  return (
    <SliderPrimitive.Root
      value={[currentValue]}
      className={cn(
        "relative h-1 rounded-full transition-[height] duration-[var(--speed-regularTransition)] ease-[var(--ease-out-quad)] data-[orientation=horizontal]:h-[var(--lp-timeline-track-height)] active:data-[orientation=horizontal]:h-[var(--lp-timeline-track-height-active)]",
        className
      )}
      aria-label="Timeline Slider"
      orientation={orientation}
      ref={internalRef}
      {...trackEvents}
      {...etc}
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
        "focus-visible:outline-primary/50 relative h-full grow rounded-full bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2",
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
        "h-full w-(--lp-played-width) rounded-s-full bg-white",
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

    if (!duration || !buffered?.length) {
      return null
    }

    let normalizedBuffered: shaka.extern.BufferedRange[] = []

    if (variant === "combined") {
      const combinedBuffered = buffered.reduce(
        (acc, range) => {
          acc.start = Math.min(acc.start, range.start)
          acc.end = Math.max(acc.end, range.end)
          return acc
        },
        { start: Infinity, end: 0 }
      )

      if (combinedBuffered.start !== Infinity) {
        normalizedBuffered = [
          {
            start: combinedBuffered.start,
            end: combinedBuffered.end,
          },
        ]
      }
    } else if (variant === "from-zero") {
      normalizedBuffered = buffered.map((range) => ({
        start: 0,
        end: range.end,
      }))
    } else {
      normalizedBuffered = buffered
    }

    if (!normalizedBuffered.length) {
      return null
    }

    return (
      <div ref={ref} className={cn("absolute size-full", className)} {...etc}>
        {normalizedBuffered.map((range, i: number) => {
          const startPercent = (range.start / duration) * 100
          const widthPercent = ((range.end - range.start) / duration) * 100
          return (
            <SliderPrimitive.Track
              key={i}
              className="absolute left-[var(--lp-buffered-start)] h-full w-[var(--lp-buffered-width)] rounded-e-full bg-white/40"
              style={
                {
                  "--lp-buffered-start": `${startPercent}%`,
                  "--lp-buffered-width": `${widthPercent}%`,
                } as React.CSSProperties
              }
            />
          )
        })}
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
          "left-(--lp-timeline-thumb-position)! size-4 rounded-full bg-white",
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
