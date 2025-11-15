"use client"

import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"
import { MuteControl } from "@/registry/default/ui/mute-control"

export function VolumeStateControlDemo() {
  const muted = useMediaStore((state) => state.muted)
  const volume = useMediaStore((state) => state.volume)

  return (
    <Button size="icon" variant="glass" asChild>
      <MuteControl>
        {muted || volume === 0 ? (
          <SpeakerXIcon size={20} weight="fill" />
        ) : volume < 0.5 ? (
          <SpeakerLowIcon size={20} weight="fill" />
        ) : (
          <SpeakerHighIcon size={20} weight="fill" />
        )}
      </MuteControl>
    </Button>
  )
}
