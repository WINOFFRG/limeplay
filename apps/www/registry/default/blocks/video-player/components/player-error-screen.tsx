"use client"

import { RotateCwIcon } from "lucide-react"
import React from "react"

import type { VideoPlayerAsset } from "@/registry/default/blocks/video-player/player"
import type {
  PlayerSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import { Button } from "@/registry/default/blocks/video-player/components/button"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { usePlaybackStore } from "@/registry/default/hooks/use-playback"
import { ErrorScreen } from "@/registry/default/ui/error-screen"

export interface PlayerErrorScreenProps {
  initialIndex?: number
  loading?: UseAssetOptions<VideoPlayerAsset>
  source?: PlayerSource<VideoPlayerAsset>
  sourceKey?: string
}

export function PlayerErrorScreen({
  initialIndex,
  loading,
  source,
  sourceKey,
}: PlayerErrorScreenProps) {
  const error = usePlaybackStore((s) => s.error)
  const status = usePlaybackStore((s) => s.status)
  const { currentItem, loadAsset, loadSource } = useAsset<VideoPlayerAsset>()

  const retryStream = React.useCallback(() => {
    if (currentItem) {
      void loadAsset(currentItem.properties)
      return
    }

    if (source === undefined) return

    loadSource(source, {
      initialIndex,
      loading,
      sourceKey,
    })
  }, [
    currentItem,
    initialIndex,
    loadAsset,
    loading,
    loadSource,
    source,
    sourceKey,
  ])

  if (status !== "error") return null

  return (
    <ErrorScreen className="z-10 rounded-lg" error={error}>
      {(currentItem || source !== undefined) && (
        <Button onClick={retryStream} size="sm">
          <RotateCwIcon />
          Retry
        </Button>
      )}
    </ErrorScreen>
  )
}
