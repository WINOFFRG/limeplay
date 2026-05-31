"use client"

import { useEffect, useMemo, useRef } from "react"

import type {
  Asset,
  GetAssetId,
  ResolveSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import { useAsset } from "@/registry/default/hooks/use-asset"
import { usePlayerStore } from "@/registry/default/hooks/use-player"

export interface UsePlaybackSourceOptions<TAsset extends Asset> {
  asset?: TAsset
  assetOptions?: Omit<UseAssetOptions<TAsset>, "getAssetId" | "resolveSource">
  autoLoad?: boolean
  getAssetId?: GetAssetId<TAsset>
  initialIndex?: number
  mediaSrc?: string
  playlist?: TAsset[]
  resolveSource?: ResolveSource<TAsset>
  sourceKey?: string
}

export function PlaybackSourceController<TAsset extends Asset>(
  props: UsePlaybackSourceOptions<TAsset>
) {
  usePlaybackSource(props)

  return null
}

export function usePlaybackSource<TAsset extends Asset>(
  options: UsePlaybackSourceOptions<TAsset>
): void {
  const {
    asset,
    assetOptions,
    autoLoad = true,
    getAssetId,
    initialIndex = 0,
    mediaSrc,
    playlist,
    resolveSource,
    sourceKey,
  } = options

  const player = usePlayerStore((state) => state.instance)
  const installedOptions = useMemo<UseAssetOptions<TAsset>>(
    () => ({
      ...assetOptions,
      getAssetId,
      resolveSource,
    }),
    [assetOptions, getAssetId, resolveSource]
  )
  const { loadPlaylist } = useAsset<TAsset>(installedOptions)
  const loadedSourceKeyRef = useRef<null | string>(null)

  useEffect(() => {
    loadedSourceKeyRef.current = null
  }, [player])

  const assets = useMemo(() => {
    if (playlist) return playlist
    if (asset) return [asset]
    if (mediaSrc) return [{ src: mediaSrc } as TAsset]

    return []
  }, [asset, mediaSrc, playlist])

  const resolvedSourceKey = useMemo(() => {
    if (sourceKey) return sourceKey

    return assets
      .map((item, index) => {
        const id =
          item.id ??
          getAssetId?.(item, {
            index,
            origin: playlist ? "playlist" : asset ? "asset" : "media-props",
          }) ??
          item.src

        return id ?? `item:${index}`
      })
      .join("|")
  }, [asset, assets, getAssetId, playlist, sourceKey])

  useEffect(() => {
    if (!autoLoad || !player || assets.length === 0) return

    if (loadedSourceKeyRef.current === resolvedSourceKey) return
    loadedSourceKeyRef.current = resolvedSourceKey

    loadPlaylist(assets, initialIndex)
  }, [assets, autoLoad, initialIndex, loadPlaylist, player, resolvedSourceKey])
}
