"use client"

import React, { useState } from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

const VOLUME_RESET_BASE = 0.05

export const Root = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>((props, forwardedRef) => {
  const { className, onValueChange: propOnValueChange, ...etc } = props
  const volume = useMediaStore((state) => state.volume)
  const hasAudio = useMediaStore((state) => state.hasAudio)
  const setVolume = useMediaStore((state) => state.setVolume)
  const muted = useMediaStore((state) => state.muted)
  const [currentValue, setCurrentValue] = useState(volume)

  const onValueChange = (value: number[]) => {
    propOnValueChange?.(value)
    setCurrentValue(value[0])
    setVolume(value[0])
  }

  if (!hasAudio) {
    return null
  }

  return (
    <SliderPrimitive.Root
      ref={forwardedRef}
      min={0}
      max={1}
      step={0.05}
      value={[muted ? 0 : currentValue === 0 ? VOLUME_RESET_BASE : volume]}
      defaultValue={[volume]}
      className={cn(
        "relative flex touch-none items-center justify-center select-none",
        className
      )}
      onValueChange={onValueChange}
      {...etc}
    />
  )
})

Root.displayName = "Root"

export const Track = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>((props, forwardRef) => {
  const { className } = props

  return (
    <SliderPrimitive.Track
      {...props}
      ref={forwardRef}
      className={cn(
        "bg-primary/20 relative size-full overflow-hidden rounded-md",
        className
      )}
    />
  )
})

Track.displayName = "Track"

export const Range = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>((props, forwardedRef) => {
  const { ...etc } = props

  return (
    <SliderPrimitive.Range
      ref={forwardedRef}
      {...etc}
      className="bg-primary absolute rounded-s-md data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
    />
  )
})

Range.displayName = "Range"

export const Thumb = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>((props, forwardRef) => {
  const { className, ...etc } = props
  const volume = useMediaStore((state) => state.volume)
  const displayValue = Number((volume * 100).toFixed(2))

  return (
    <SliderPrimitive.Thumb
      className={cn(
        "bg-primary outline-primary block size-2 rounded-full outline-offset-1 focus-visible:ring-0 focus-visible:outline-1",
        className
      )}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={displayValue}
      aria-valuetext={`${displayValue}% volume`}
      aria-label="Volume"
      {...etc}
      ref={forwardRef}
    />
  )
})

Thumb.displayName = "Thumb"
