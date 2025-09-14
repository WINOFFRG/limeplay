"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { CaptionsControl } from "@/registry/default/ui/captions"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function CaptionsStateControlDemo() {
  const textTrackVisible = useMediaStore((state) => state.textTrackVisible)

  return (
    <Button size="icon" variant="glass" asChild>
      <CaptionsControl>
        <ClosedCaptioningIcon
          weight={textTrackVisible ? "fill" : "regular"}
          size={20}
        />
      </CaptionsControl>
    </Button>
  )
}
