"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { Toggle } from "@/registry/default/blocks/linear-player/ui/toggle"
import { CaptionsControl } from "@/registry/default/ui/captions"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function CaptionsStateControl() {
  const textTrackVisible = useMediaStore((state) => state.textTrackVisible)

  return (
    <Toggle asChild pressed={textTrackVisible} variant="glass">
      <CaptionsControl>
        <ClosedCaptioningIcon
          weight={textTrackVisible ? "fill" : "regular"}
          fill="white"
        />
      </CaptionsControl>
    </Toggle>
  )
}
