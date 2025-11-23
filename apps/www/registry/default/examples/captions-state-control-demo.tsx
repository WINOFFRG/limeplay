"use client"

import { useEffect } from "react"
import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { MediaReadyState } from "@/registry/default/hooks/use-player"
import {
  CaptionsContainer,
  CaptionsControl,
} from "@/registry/default/ui/captions"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function CaptionsStateControlDemo() {
  const textTrackVisible = useMediaStore((state) => state.textTrackVisible)
  const player = useMediaStore((state) => state.player)
  const readyState = useMediaStore((state) => state.readyState)

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
        console.log("Text track added")
      })
      .catch((error) => {
        console.error("Error adding text track:", error)
      })
  }, [readyState, player])

  return (
    <CaptionsControl asChild>
      <Button variant="ghost" size="icon">
        <ClosedCaptioningIcon
          weight={textTrackVisible ? "fill" : "regular"}
          size={18}
        />
      </Button>
    </CaptionsControl>
  )
}

export function CaptionsHybridDemo() {
  return <CaptionsContainer className="mb-16" />
}
