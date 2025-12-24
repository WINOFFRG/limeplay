"use client"

import { Button } from "@/components/ui/button"
import * as Select from "@/components/ui/select"
import * as PlaybackRate from "@/registry/default/ui/playback-rate"

export function PlaybackRateDemo() {
  return (
    <PlaybackRate.SelectRoot>
      <Button asChild size="icon" variant="ghost">
        <PlaybackRate.SelectTrigger
          className={`
            border-none bg-transparent px-8 shadow-none
            hover:bg-foreground/10
            dark:bg-transparent dark:shadow-none
          `}
          size="sm"
        />
      </Button>
      <Select.SelectContent
        align="start"
        className={`
          min-w-24 backdrop-blur-md
          dark:bg-accent
        `}
      >
        <PlaybackRate.SelectGroup className="tracking-wider" />
      </Select.SelectContent>
    </PlaybackRate.SelectRoot>
  )
}
