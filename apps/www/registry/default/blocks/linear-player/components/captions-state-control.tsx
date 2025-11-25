"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { CaptionsControl } from "@/registry/default/ui/captions"
import { useMediaStore } from "@/registry/default/ui/media-provider"

export function CaptionsStateControl() {
  const textTrackVisible = useMediaStore((state) => state.textTrackVisible)

  return (
    <CaptionsControl asChild>
      <Button variant="glass" size="icon" className="cursor-pointer">
        <ClosedCaptioningIcon weight={textTrackVisible ? "fill" : "regular"} />
      </Button>
    </CaptionsControl>
  )
}
