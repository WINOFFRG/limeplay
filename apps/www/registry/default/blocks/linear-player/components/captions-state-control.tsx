"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { useCaptionsStore } from "@/registry/default/hooks/use-captions"
import { CaptionsControl } from "@/registry/default/ui/captions"

export function CaptionsStateControl() {
  const textTrackVisible = useCaptionsStore((state) => state.visible)

  return (
    <CaptionsControl asChild>
      <Button className="cursor-pointer" size="icon" variant="glass">
        <ClosedCaptioningIcon weight={textTrackVisible ? "fill" : "regular"} />
      </Button>
    </CaptionsControl>
  )
}
