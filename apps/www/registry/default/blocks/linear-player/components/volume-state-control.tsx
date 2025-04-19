"use client"

import { SpeakerHigh, SpeakerLow, SpeakerX } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"
import { MuteControl } from "@/registry/default/ui/mute-control"

export function VolumeStateControl() {
  const muted = useMediaStore((state) => state.muted)
  const volume = useMediaStore((state) => state.volume)

  return (
    <Button size="icon" variant="glass" asChild>
      <MuteControl>
        {muted || volume === 0 ? (
          <SpeakerX size={18} weight="fill" />
        ) : volume < 0.5 ? (
          <SpeakerLow size={18} weight="fill" />
        ) : (
          <SpeakerHigh size={18} weight="fill" />
        )}
      </MuteControl>
    </Button>
  )
}
