"use client"

import { Button } from "@/components/ui/button"
import * as PlaybackRate from "@/registry/default/ui/playback-rate"

export function PlaybackRateControl() {
  return (
    <PlaybackRate.Select>
      <Button variant="ghost" size="icon" asChild>
        <PlaybackRate.Trigger
          size="sm"
          className={`
            border-none bg-transparent px-8
            data-[highlighted]:!bg-accent/80
            data-[popup-open]:!bg-accent
            dark:bg-transparent
          `}
        />
      </Button>
      <PlaybackRate.Positioner className="z-[100]" align="start">
        <PlaybackRate.Content
          className={`
            min-w-24 backdrop-blur-md
            dark:bg-accent
          `}
        >
          <PlaybackRate.Group
            className={`
              tracking-wider
              dark:text-accent-foreground dark:hover:bg-primary/10
            `}
          />
        </PlaybackRate.Content>
      </PlaybackRate.Positioner>
    </PlaybackRate.Select>
  )
}
