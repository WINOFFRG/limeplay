"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import React, { useImperativeHandle, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { MediaReadyState } from "@/registry/default/hooks/use-playback"
import { useTrackEvents } from "@/registry/default/hooks/use-track-events"
import { useVolume } from "@/registry/default/hooks/use-volume"
import { useMediaStore } from "@/registry/default/ui/media-provider"

const VOLUME_RESET_BASE = 0.05

export const Root = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>((props, ref) => {
  const internalRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>
  const { className, orientation = "horizontal", ...etc } = props
  const volume = useMediaStore((state) => state.volume)
  const hasAudio = useMediaStore((state) => state.hasAudio)
  const muted = useMediaStore((state) => state.muted)
  const readyState = useMediaStore((state) => state.readyState)
  const [currentValue, setCurrentValue] = useState(volume)

  const disabled = props.disabled || readyState < MediaReadyState.HAVE_METADATA

  useImperativeHandle(ref, () => internalRef.current)
  const { setVolume } = useVolume()

  const getVolumeFromEvent = (event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    let percentage: number

    if (orientation === "vertical") {
      percentage = 1 - (event.clientY - rect.top) / rect.height
    } else {
      percentage = (event.clientX - rect.left) / rect.width
    }

    return Math.max(0, Math.min(1, percentage))
  }

  const trackEvents = useTrackEvents({
    onPointerDown: (progress, event) => {
      if (disabled) return
      const newVolume = getVolumeFromEvent(event)
      setCurrentValue(newVolume)
      setVolume(newVolume)
    },
    onPointerMove: (progress, isPointerDown, event) => {
      if (disabled) return
      if (isPointerDown) {
        const newVolume = getVolumeFromEvent(event)
        setCurrentValue(newVolume)
        setVolume(newVolume)
      }
    },
    orientation,
  })

  if (!hasAudio) {
    return null
  }

  const currentVolumeValue = muted
    ? 0
    : currentValue === 0
      ? VOLUME_RESET_BASE
      : volume

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex touch-none items-center justify-center select-none",
        className
      )}
      max={1}
      min={0}
      orientation={orientation}
      ref={internalRef}
      step={0.01}
      value={[currentVolumeValue]}
      {...trackEvents}
      {...etc}
      disabled={disabled}
    />
  )
})

Root.displayName = "VolumeRoot"

export const Track = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>((props, ref) => {
  const { className, ...etc } = props

  return (
    <SliderPrimitive.Track
      className={cn(
        "relative size-full overflow-hidden rounded-md bg-primary/30",
        className
      )}
      ref={ref}
      {...etc}
    />
  )
})

Track.displayName = "VolumeTrack"

export const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>((props, ref) => {
  const { className, ...etc } = props
  const volume = useMediaStore((state) => state.volume)
  const muted = useMediaStore((state) => state.muted)
  const currentValue = muted ? 0 : volume

  return (
    <SliderPrimitive.Indicator
      className={cn(
        `
          h-full w-(--lp-volume-value) bg-primary
          data-disabled:bg-primary/20
        `,
        "data-[orientation=vertical]:h-(--lp-volume-value) data-[orientation=vertical]:w-full",
        className
      )}
      ref={ref}
      style={
        {
          "--lp-volume-value": `${(currentValue * 100).toString()}%`,
        } as React.CSSProperties
      }
      {...etc}
    />
  )
})

Progress.displayName = "VolumeProgress"

interface ThumbProps extends React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Thumb
> {
  /**
   * Whether to show volume percentage as aria text
   * @default true
   */
  showVolumeText?: boolean
}

export const Thumb = React.forwardRef<HTMLDivElement, ThumbProps>(
  (props, ref) => {
    const { className, showVolumeText = true, ...etc } = props
    const volume = useMediaStore((state) => state.volume)
    const displayValue = Number((volume * 100).toFixed(2))

    return (
      <SliderPrimitive.Thumb
        aria-label="Volume"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={displayValue}
        aria-valuetext={
          showVolumeText ? `${displayValue.toString()}% volume` : undefined
        }
        className={cn(
          `
            block size-2 rounded-full bg-primary
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50
            data-disabled:bg-primary/85
          `,
          className
        )}
        ref={ref}
        {...etc}
      />
    )
  }
)

Thumb.displayName = "VolumeThumb"
