"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import React, { useImperativeHandle, useRef } from "react"

import { cn } from "@/lib/utils"
import { MediaReadyState } from "@/registry/default/hooks/use-player"
import { useTimeline } from "@/registry/default/hooks/use-timeline"
import { useTrackEvents } from "@/registry/default/hooks/use-track-events"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export type TimelineRootPropsDocs = Pick<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "disabled" | "orientation"
>

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
  const { getTimeFromEvent, seek, setHoveringTime, setIsHovering } =
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
      aria-label="Timeline Slider"
      className={cn(
        `
          relative h-1 rounded-full transition-[height] duration-(--speed-regularTransition) ease-out-quad
          data-[orientation=horizontal]:h-(--lp-timeline-track-height)
          active:data-[orientation=horizontal]:h-(--lp-timeline-track-height-active)
        `,
        className
      )}
      orientation={orientation}
      ref={internalRef}
      value={[currentValue]}
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
      className={cn(
        `
          relative flex h-full grow flex-row rounded-full bg-foreground/20
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
        `,
        className
      )}
      ref={ref}
      tabIndex={0}
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
      className={cn(
        "h-full w-(--lp-played-width)! rounded-s-full bg-primary",
        className
      )}
      ref={ref}
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

export type TimelineBufferedPropsDocs = Pick<BufferedProps, "variant">

export type TimelineThumbPropsDocs = Pick<
  ThumbProps,
  "position" | "showWithHover"
>

interface BufferedProps extends React.ComponentProps<
  typeof SliderPrimitive.Track
> {
  /**
   * How to render buffered ranges
   * - "default": Show each buffered range separately
   * - "combined": Merge all ranges into one
   * - "from-zero": Show ranges from start to their end
   * @default "default"
   */
  variant?: "combined" | "default" | "from-zero"
}

interface ThumbProps extends React.ComponentProps<
  typeof SliderPrimitive.Thumb
> {
  /**
   * Custom position of the thumb in percentage
   */
  position?: number
  /**
   * Thumb moves with the cursor seeking over the timeline
   */
  showWithHover?: boolean
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
      <div className={cn("absolute size-full", className)} ref={ref} {...etc}>
        {normalizedPercentages.map(({ startPercent, widthPercent }, index) => (
          <SliderPrimitive.Indicator
            className={cn(
              `left-(--lp-buffered-start)! h-full w-(--lp-buffered-width)! bg-foreground/30`,
              variant === "from-zero" && "rounded-e-full",
              className
            )}
            key={`${index}_${startPercent}`}
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
            left-(--lp-timeline-thumb-position)! size-4 rounded-full bg-primary
            data-disabled:bg-primary/85
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
