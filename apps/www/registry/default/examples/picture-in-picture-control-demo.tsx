"use client"

import { PictureInPictureIcon } from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/linear-player/ui/button"
import { usePictureInPictureStore } from "@/registry/default/hooks/use-picture-in-picture"
import { PictureInPictureControl } from "@/registry/default/ui/picture-in-picture-control"

export default function PictureInPictureControlDemo() {
  const isPictureInPictureActive = usePictureInPictureStore(
    (state) => state.active
  )

  return (
    <PictureInPictureControl asChild shortcut="P">
      <Button className="cursor-pointer" size="icon" variant="glass">
        <PictureInPictureIcon
          weight={isPictureInPictureActive ? "fill" : "regular"}
        />
      </Button>
    </PictureInPictureControl>
  )
}
