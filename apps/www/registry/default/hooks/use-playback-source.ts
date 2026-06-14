"use client"

import { useEffect, useMemo, useRef } from "react"

import type {
  Asset,
  GetAssetId,
  PlayerSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import {
  AssetSourceOrigin,
  AssetSourceType,
  useAsset,
} from "@/registry/default/hooks/use-asset"
import { usePlayerStore } from "@/registry/default/hooks/use-player"

export interface UsePlaybackSourceOptions<TAsset extends Asset> {
  autoLoad?: boolean
  initialIndex?: number
  loading?: UseAssetOptions<TAsset>
  source?: PlayerSource<TAsset>
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
    autoLoad = true,
    initialIndex = 0,
    loading,
    source,
    sourceKey,
  } = options

  const assets = useMemo(() => {
    if (Array.isArray(source)) return [...source]
    if (typeof source === "string") return [{ src: source } as TAsset]
    if (source) return [source]

    return []
  }, [source])
  const player = usePlayerStore((state) => state.instance)
  const { loadSource } = useAsset<TAsset>()
  const loadedSourceKeyRef = useRef<null | string>(null)

  useEffect(() => {
    loadedSourceKeyRef.current = null
  }, [player])

  const resolvedSourceKey = useMemo(() => {
    if (sourceKey) return sourceKey

    return assets
      .map((item, index) => {
        const id =
          item.id ??
          loading?.getAssetId?.(item, {
            index,
            origin: getSourceOrigin(source),
          }) ??
          item.src

        return id ?? `item:${index}`
      })
      .join("|")
  }, [assets, loading, source, sourceKey])
  const sourceType = useMemo<AssetSourceType>(() => {
    return Array.isArray(source)
      ? AssetSourceType.Playlist
      : AssetSourceType.Asset
  }, [source])
  const requestKey = useMemo(
    () => `${resolvedSourceKey}::${sourceType}::${initialIndex}`,
    [initialIndex, resolvedSourceKey, sourceType]
  )

  useEffect(() => {
    loadedSourceKeyRef.current = null
  }, [requestKey])

  useEffect(() => {
    if (!autoLoad || !player || source === undefined || assets.length === 0)
      return

    if (loadedSourceKeyRef.current === requestKey) return
    loadedSourceKeyRef.current = requestKey

    loadSource(source, {
      initialIndex,
      loading,
      sourceKey,
      sourceType,
    })
  }, [
    assets,
    autoLoad,
    initialIndex,
    loadSource,
    player,
    requestKey,
    resolvedSourceKey,
    source,
    sourceKey,
    sourceType,
    loading,
  ])
}

function getSourceOrigin<TAsset extends Asset>(
  source: PlayerSource<TAsset> | undefined
): Parameters<GetAssetId<TAsset>>[1]["origin"] {
  if (Array.isArray(source)) return AssetSourceOrigin.Playlist
  if (typeof source === "string") return AssetSourceOrigin.MediaProps
  return AssetSourceOrigin.Asset
}
