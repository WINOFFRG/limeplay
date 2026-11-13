"use client"

import * as React from "react"

import {
  SelectGroup as SelectGroupPrimitive,
  SelectItem,
  Select as SelectPrimitive,
} from "@/components/ui/select"
import { usePlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"

export function SelectRoot({
  onValueChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive>) {
  const setPlaybackRate = usePlaybackRateStore((state) => state.setPlaybackRate)
  const value = usePlaybackRateStore((state) => state.value)

  return (
    <SelectPrimitive
      value={value.toString()}
      {...props}
      onValueChange={(...args) => {
        setPlaybackRate(Number(args[0]))
        onValueChange?.(...args)
      }}
    />
  )
}

SelectRoot.displayName = "PlaybackRateSelectRoot"

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
