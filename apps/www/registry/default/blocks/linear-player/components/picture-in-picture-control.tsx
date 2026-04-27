"use client"

import { PictureInPictureIcon } from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { usePictureInPictureStore } from "@/registry/default/hooks/use-picture-in-picture"
import { PictureInPictureControl as PictureInPictureControlPrimitive } from "@/registry/default/ui/picture-in-picture-control"

export function PictureInPictureControl() {
  const isPictureInPictureActive = usePictureInPictureStore(
    (state) => state.active
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
