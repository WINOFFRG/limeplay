"use client"

import { Button } from "@/components/ui/button";
import * as Select from "@/components/ui/select"
import * as PlaybackRate from "@/registry/default/ui/playback-rate"

export function PlaybackRateControl() {
  return (
    <PlaybackRate.SelectRoot>
      <Button variant="ghost" size="icon" asChild>
        <PlaybackRate.SelectTrigger
          size="sm"
          className={`
            border-none bg-transparent px-8
            data-[highlighted]:!bg-accent/80
            data-[popup-open]:!bg-accent
            dark:bg-transparent
          `}
        />
      </Button>
      <Select.SelectPositioner className="z-[100]" align="start">
        <Select.SelectContent
          className={`
            min-w-24 backdrop-blur-md
            dark:bg-accent
          `}
        >
          <PlaybackRate.SelectGroup
            className={`
              tracking-wider
              dark:text-accent-foreground dark:hover:bg-primary/10
            `}
          />
        </Select.SelectContent>
      </Select.SelectPositioner>
    </PlaybackRate.SelectRoot>
  )
}
