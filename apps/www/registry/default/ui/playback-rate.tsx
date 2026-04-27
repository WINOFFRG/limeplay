"use client"

import * as React from "react"

import {
  SelectGroup as SelectGroupPrimitive,
  SelectItem,
  Select as SelectPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue,
} from "@/components/ui/select"
import { usePlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"

export function SelectRoot(
  props: React.ComponentProps<typeof SelectPrimitive>
) {
  const setPlaybackRate = usePlaybackRateStore((state) => state.setPlaybackRate)
  const value = usePlaybackRateStore((state) => state.value)

  return (
    <SelectPrimitive
      onValueChange={(value) => setPlaybackRate(Number(value))}
      value={value.toString()}
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

interface SelectGroupProps extends React.ComponentProps<
  typeof SelectGroupPrimitive
> {
  suffix?: string
}

export function SelectGroup(props: SelectGroupProps) {
  const rates = usePlaybackRateStore((state) => state.rates)
  const { children, suffix = "x", ...etc } = props

  return (
    <SelectGroupPrimitive {...etc}>
      {children}
      {rates.map((rate: number) => (
        <SelectItem key={rate} value={rate.toString()}>
          {rate}
          {suffix && <span className="text-xs">{suffix}</span>}
        </SelectItem>
      ))}
    </SelectGroupPrimitive>
  )
}

SelectGroup.displayName = "PlaybackRateSelectGroup"
