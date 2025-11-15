"use client"

import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"
import { PlaybackControl } from "@/registry/default/ui/playback-control"

export function PlaybackStateControl() {
  const status = useMediaStore((state) => state.status)

  return (
    <Button size="icon" variant="glass" asChild>
      <PlaybackControl>
        {status === "playing" ? (
          <PauseIcon weight="fill" size={18} />
        ) : status === "ended" ? (
          <RepeatIcon size={18} />
        ) : status === "buffering" ? (
          <CircleNotchIcon className="animate-spin" size={18} weight="bold" />
        ) : (
          <PlayIcon weight="fill" size={18} />
        )}
      </PlaybackControl>
    </Button>
  )
}
