"use client"

import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"
import { MuteControl } from "@/registry/default/ui/mute-control"

export function VolumeStateControlDemo() {
  const muted = useVolumeStore((state) => state.muted)
  const volume = useVolumeStore((state) => state.level)

  return (
    <MuteControl asChild>
      <Button size="icon" variant="ghost">
        {muted || volume === 0 ? (
          <SpeakerXIcon weight="fill" />
        ) : volume < 0.5 ? (
          <SpeakerLowIcon weight="fill" />
        ) : (
          <SpeakerHighIcon weight="fill" />
        )}
      </Button>
    </MuteControl>
  )
}
