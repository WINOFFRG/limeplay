"use client"

import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { PlaybackControl } from "@/registry/default/ui/playback-control"

export function PlaybackStateControl() {
  const status = usePlaybackStore((state) => state.status)

  return (
    <Button asChild size="icon" variant="glass">
      <PlaybackControl>
        {status === "playing" ? (
          <PauseIcon size={18} weight="fill" />
        ) : status === "ended" ? (
          <RepeatIcon size={18} />
        ) : status === "buffering" ? (
          <CircleNotchIcon className="animate-spin" size={18} weight="bold" />
        ) : (
          <PlayIcon size={18} weight="fill" />
        )}
      </PlaybackControl>
    </Button>
  )
}
