import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { PlaybackControl } from "@/registry/default/ui/playback-control"

export function PlaybackStateControlDemo() {
  const status = usePlaybackStore((state) => state.status)

  return (
    <PlaybackControl asChild>
      <Button size="icon" variant="ghost">
        {status === "playing" ? (
          <PauseIcon weight="fill" />
        ) : status === "ended" ? (
          <RepeatIcon />
        ) : status === "buffering" ? (
          <CircleNotchIcon className="animate-spin" weight="bold" />
        ) : (
          <PlayIcon weight="fill" />
        )}
      </Button>
    </PlaybackControl>
  )
}
