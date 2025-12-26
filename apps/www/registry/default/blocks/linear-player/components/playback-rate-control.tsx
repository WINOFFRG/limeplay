"use client"

import * as Select from "@/components/ui/select"
import * as PlaybackRate from "@/registry/default/ui/playback-rate"

export function PlaybackRateControl() {
  return (
    <PlaybackRate.SelectRoot>
      <Select.SelectTrigger
        className={`
          border-none bg-transparent shadow-none
          hover:bg-foreground/10
          dark:bg-transparent dark:shadow-none
        `}
        size="sm"
      >
        <Select.SelectValue />
      </Select.SelectTrigger>
      <Select.SelectContent
        align="start"
        className={`dark min-w-24 bg-background/60 backdrop-blur-md backdrop-saturate-[1.15]`}
        position="popper"
        side="left"
      >
        <PlaybackRate.SelectGroup className={`tracking-wider`}>
          <Select.SelectLabel>Playback Rate</Select.SelectLabel>
        </PlaybackRate.SelectGroup>
      </Select.SelectContent>
    </PlaybackRate.SelectRoot>
  )
}
