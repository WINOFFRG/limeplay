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

export function SelectRoot(
  props: React.ComponentProps<typeof SelectPrimitive>
) {
  const playbackRate = useMediaStore((state) => state.playbackRate)
  const { setPlaybackRate } = usePlaybackRate()

  return (
    <SelectPrimitive
      onValueChange={(value) => setPlaybackRate(Number(value))}
      value={playbackRate.toString()}
      {...props}
    />
  )
}

SelectRoot.displayName = "PlaybackRateSelectRoot"

export function SelectTrigger(
  props: React.ComponentProps<typeof SelectTriggerPrimitive>
) {
  return (
    <SelectTriggerPrimitive {...props}>
      <SelectValue />
    </SelectTriggerPrimitive>
  )
}

SelectTrigger.displayName = "PlaybackRateSelectTrigger"

interface SelectGroupProps
  extends React.ComponentProps<typeof SelectGroupPrimitive> {
  suffix?: string
}

export function SelectGroup(props: SelectGroupProps) {
  const playbackRates = useMediaStore((state) => state.playbackRates)
  const { children, suffix = "x", ...etc } = props

  return (
    <SelectGroupPrimitive {...etc}>
      {children}
      {playbackRates.map((rate) => (
        <SelectItem key={rate} value={rate.toString()}>
          {rate}
          {suffix && <span className="text-xs">{suffix}</span>}
        </SelectItem>
      ))}
    </SelectGroupPrimitive>
  )
}

SelectGroup.displayName = "PlaybackRateSelectGroup"
