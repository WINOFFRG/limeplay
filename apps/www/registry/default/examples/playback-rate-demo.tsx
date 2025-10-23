"use client"

import { Button } from "@/components/ui/button"
import * as Select from "@/components/ui/select"
import * as PlaybackRate from "@/registry/default/ui/playback-rate"

export function PlaybackRateDemo() {
  return (
    <PlaybackRate.SelectRoot>
      <Button variant="glass" asChild>
        <PlaybackRate.SelectTrigger />
      </Button>
      <Select.SelectPositioner className="z-[100]">
        <Select.SelectContent>
          <PlaybackRate.SelectGroup className={"tracking-wider"} />
        </Select.SelectContent>
      </Select.SelectPositioner>
    </PlaybackRate.SelectRoot>
  )
}
