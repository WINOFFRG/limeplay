"use client"

import type {
  AudioPlayerAsset,
  PlaybackUrls,
} from "@/registry/default/blocks/audio-player/components/audio-source"
import type { UseAssetReturn } from "@/registry/default/hooks/use-asset"

import { useAudioSource } from "@/registry/default/blocks/audio-player/components/audio-source"
import { useAsset } from "@/registry/default/hooks/use-asset"

export type { PlaybackUrls }

export type PlaylistAsset = AudioPlayerAsset

export interface UsePlaylistAssetReturn extends UseAssetReturn<PlaylistAsset> {
  items: PlaylistAsset[]
}

export function usePlaylistAsset(): UsePlaylistAssetReturn {
  const asset = useAsset<PlaylistAsset>()
  const source = useAudioSource()

  return {
    ...asset,
    items: source.items,
  }
}
