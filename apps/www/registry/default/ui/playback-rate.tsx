"use client"

import * as React from "react"

import {
  SelectGroup as SelectGroupPrimitive,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue,
} from "@/components/ui/select"
import { usePlaybackRate } from "@/registry/default/hooks/use-playback-rate"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export const SelectRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPrimitive>
>((props, _) => {
  const playbackRate = useMediaStore((state) => state.playbackRate)
  const { setPlaybackRate } = usePlaybackRate()

  return (
    <SelectPrimitive
      value={playbackRate.toString()}
      onValueChange={(value) => setPlaybackRate(Number(value))}
      {...props}
    />
  )
})

SelectRoot.displayName = "PlaybackRateSelectRoot"

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectTriggerPrimitive>
>((props, forwardedRef) => {
  const playbackRate = useMediaStore((state) => state.playbackRate)

  return (
    <SelectTriggerPrimitive ref={forwardedRef} {...props}>
      <SelectValue
        placeholder={playbackRate.toString()}
        render={(_, { value }) => {
          return <span>{value}x</span>
        }}
      />
    </SelectTriggerPrimitive>
  )
})

SelectTrigger.displayName = "PlaybackRateSelectTrigger"

interface SelectGroupProps
  extends React.ComponentProps<typeof SelectGroupPrimitive> {
  suffix?: string
}

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  (props, forwardedRef) => {
    const playbackRates = useMediaStore((state) => state.playbackRates)
    const { suffix = "x" } = props

    return (
      <SelectGroupPrimitive ref={forwardedRef} {...props}>
        {playbackRates.map((rate) => (
          <SelectItem key={rate} value={rate.toString()}>
            {rate}
            {suffix && <span className="text-xs">{suffix}</span>}
          </SelectItem>
        ))}
      </SelectGroupPrimitive>
    )
  }
)

SelectGroup.displayName = "PlaybackRateSelectGroup"
