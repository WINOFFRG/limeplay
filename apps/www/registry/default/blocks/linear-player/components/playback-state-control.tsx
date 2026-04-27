"use client"

import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { PlaybackControl } from "@/registry/default/ui/playback-control"

export function PlaybackStateControl() {
  const status = usePlaybackStore((state) => state.status)

  return (
    <PlaybackControl asChild>
      <Button className="cursor-pointer" size="icon" variant="glass">
        {status === "playing" ? (
          <PauseIcon weight="fill" />
        ) : status === "ended" ? (
          <RepeatIcon />
        ) : status === "buffering" || status === "loading" ? (
          <CircleNotchIcon className="animate-spin" weight="bold" />
        ) : (
          <PlayIcon weight="fill" />
        )}
      </Button>
    </PlaybackControl>
  )
}
