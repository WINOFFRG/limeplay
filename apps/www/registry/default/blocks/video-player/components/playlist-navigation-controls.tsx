"use client"

import { SkipForwardIcon } from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/video-player/components/button"
import {
  usePlaylist,
  usePlaylistStore,
} from "@/registry/default/hooks/use-playlist"

export function PlaylistNextControl() {
  const { hasNext, next } = usePlaylist()
  const hasPlaylist = useHasPlaylist()

  if (!hasPlaylist) return null

  return (
    <Button
      aria-label="Next video"
      disabled={!hasNext}
      onClick={next}
      size="icon"
      variant="glass"
    >
      <SkipForwardIcon weight="fill" />
    </Button>
  )
}

function useHasPlaylist() {
  return usePlaylistStore((state) => state.queue.length > 1)
}
