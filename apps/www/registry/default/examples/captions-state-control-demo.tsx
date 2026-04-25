"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useCaptionsStore } from "@/registry/default/hooks/use-captions"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/registry/default/hooks/use-playback"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import {
  CaptionsContainer,
  CaptionsControl,
} from "@/registry/default/ui/captions"

export function CaptionsHybridDemo() {
  return <CaptionsContainer className="mb-16" />
}

export function CaptionsStateControlDemo() {
  const textTrackVisible = useCaptionsStore((state) => state.visible)
  const player = usePlayerStore((state) => state.instance)
  const readyState = usePlaybackStore((state) => state.readyState)

  // DEV: Adding text tracks externally as demo asset doesn't have built-in text tracks
  useEffect(() => {
    if (!player || readyState < MediaReadyState.HAVE_METADATA) return

    player
      .addTextTrackAsync(
        "/assets/sprite_fight.vtt",
        "en",
        "captions",
        "text/vtt",
        undefined,
        "English"
      )
      .then(() => {
        player.selectTextTrack(player.getTextTracks()[0])
        player.setTextTrackVisibility(true)
      })
      .catch((error: unknown) => {
        console.error("Error adding text track:", error)
      })
  }, [readyState, player])

  return (
    <CaptionsControl asChild>
      <Button size="icon" variant="ghost">
        <ClosedCaptioningIcon
          size={18}
          weight={textTrackVisible ? "fill" : "regular"}
        />
      </Button>
    </CaptionsControl>
  )
}
