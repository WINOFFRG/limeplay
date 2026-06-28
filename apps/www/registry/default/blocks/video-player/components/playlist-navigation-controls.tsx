"use client"

import { SkipForwardIcon } from "@phosphor-icons/react"

import { Button } from "@/registry/default/blocks/video-player/components/button"
import {
  AssetSourceType,
  useAssetStore,
} from "@/registry/default/hooks/use-asset"
import { usePlaylistStore } from "@/registry/default/hooks/use-playlist"

export function PlaylistNextControl() {
  const next = usePlaylistStore((state) => state.next)
  const hasPlaylist = useAssetStore(
    (state) => state.sourceType === AssetSourceType.Playlist
  )
  const hasNext = usePlaylistStore((state) => {
    if (state.repeatMode === "all" && state.queue.length > 0) return true

    return state.getNextIndex() !== -1
  })

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
