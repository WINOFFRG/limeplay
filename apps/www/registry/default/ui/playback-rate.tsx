"use client";

import * as React from "react"

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPositioner,
  Select as SelectPrimitive,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePlaybackRate } from "@/registry/default/hooks/use-playback-rate"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export const Select = React.forwardRef<
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

Select.displayName = "PlaybackRateSelect"

export const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectTrigger>
>((props, forwardedRef) => {
  const playbackRate = useMediaStore((state) => state.playbackRate)

  return (
    <SelectTrigger ref={forwardedRef} {...props}>
      <SelectValue
        placeholder={playbackRate.toString()}
        render={(_, { value }) => {
          return <span>{value}x</span>
        }}
      />
    </SelectTrigger>
  )
})

Trigger.displayName = "PlaybackRateTrigger"

export const Positioner = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectPositioner>
>((props, forwardedRef) => {
  return (
    <SelectPositioner ref={forwardedRef} {...props}>
      <Content />
    </SelectPositioner>
  )
})

Positioner.displayName = "PlaybackRatePositioner"

export const Content = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectContent>
>((props, forwardedRef) => {
  return (
    <SelectContent ref={forwardedRef} {...props}>
      <Group />
    </SelectContent>
  )
})

Content.displayName = "PlaybackRateContent"

interface GroupProps extends React.ComponentProps<typeof SelectGroup> {
  suffix?: string
}

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  (props, forwardedRef) => {
    const playbackRates = useMediaStore((state) => state.playbackRates)
    const { suffix = "x" } = props

    return (
      <SelectGroup ref={forwardedRef} {...props}>
        <SelectLabel>Playback Rate</SelectLabel>
        {playbackRates.map((rate) => (
          <Item key={rate} value={rate.toString()}>
            {rate}
            <span className="text-xs">{suffix}</span>
          </Item>
        ))}
      </SelectGroup>
    )
  }
)

Group.displayName = "PlaybackRateGroup"

export const Item = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SelectItem>
>((props, forwardedRef) => {
  return <SelectItem ref={forwardedRef} {...props} />
})

Item.displayName = "PlaybackRateItem"
