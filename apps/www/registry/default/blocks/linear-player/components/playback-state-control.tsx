"use client"

import { CircleNotch, Pause, Play, Repeat } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"
import { PlaybackControl } from "@/registry/default/ui/playback-control"

export function PlaybackStateControl() {
  const status = useMediaStore((state) => state.status)

  return (
    <Button size="icon" variant="glass" asChild>
      <PlaybackControl>
        {status === "playing" ? (
          <Pause weight="fill" size={18} />
        ) : status === "ended" ? (
          <Repeat size={18} />
        ) : status === "buffering" ? (
          <CircleNotch className="animate-spin" size={18} weight="bold" />
        ) : (
          <Play weight="fill" size={18} />
        )}
      </PlaybackControl>
    </Button>
  )
}
