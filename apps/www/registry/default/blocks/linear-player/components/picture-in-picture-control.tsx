"use client"

import { PictureInPictureIcon } from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { useMediaStore } from "@/registry/default/ui/media-provider"
import { PictureInPictureControl as PictureInPictureControlPrimitive } from "@/registry/default/ui/picture-in-picture-control"

export function PictureInPictureControl() {
  const isPictureInPictureActive = useMediaStore(
    (state) => state.isPictureInPictureActive
  )

  return (
    <PictureInPictureControlPrimitive asChild shortcut="P">
      <Button className="cursor-pointer" size="icon" variant="glass">
        <PictureInPictureIcon
          weight={isPictureInPictureActive ? "fill" : "regular"}
        />
      </Button>
    </PictureInPictureControlPrimitive>
  )
}
