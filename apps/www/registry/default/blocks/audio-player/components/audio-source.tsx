"use client"

import * as React from "react"

import type {
  Asset,
  GetAssetId,
  ResolveSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import { PlaybackSourceController } from "@/registry/default/hooks/use-playback-source"

export interface AudioPlayerAsset extends Asset {
  description?: string
  duration?: number
  genre?: string
  playbackUrls?: PlaybackUrls
  poster?: string
  releaseYear?: number | string
  title?: string
  year?: number | string
}

export interface AudioSourceContextValue {
  items: AudioPlayerAsset[]
}

export interface AudioSourceProviderProps {
  asset?: AudioPlayerAsset
  assetOptions?: Omit<
    UseAssetOptions<AudioPlayerAsset>,
    "getAssetId" | "resolveSource"
  >
  autoLoad?: boolean
  children?: React.ReactNode
  getAssetId?: GetAssetId<AudioPlayerAsset>
  initialIndex?: number
  mediaSrc?: string
  playlist?: AudioPlayerAsset[]
  resolveSource?: ResolveSource<AudioPlayerAsset>
}

export interface PlaybackUrls {
  primary: string
  secondary?: string
}

const AudioSourceContext = React.createContext<AudioSourceContextValue | null>(
  null
)

interface RawPlaybackResponse {
  expires_at: string
  url: string
}

export function AudioSourceProvider({
  asset,
  assetOptions,
  autoLoad = true,
  children,
  getAssetId,
  initialIndex,
  mediaSrc,
  playlist,
  resolveSource,
}: AudioSourceProviderProps) {
  const items = React.useMemo(() => {
    if (playlist) return playlist
    if (asset) return [asset]
    return []
  }, [asset, playlist])

  const resolvedAssetOptions = React.useMemo<UseAssetOptions<AudioPlayerAsset>>(
    () => ({
      onLoadError: (_asset: AudioPlayerAsset, _error: unknown, { hasNext }) => {
        return hasNext ? "skip" : "stop"
      },
      onPlaybackError: async (
        _asset: AudioPlayerAsset,
        error: Error,
        { currentTime }: { currentTime: number }
      ): Promise<
        | { action: "reload"; startTime?: number }
        | { action: "skip" }
        | { action: "stop" }
      > => {
        if (isNetworkError(error)) {
          return { action: "reload", startTime: currentTime }
        }

        return { action: "skip" }
      },
      ...assetOptions,
    }),
    [assetOptions]
  )
  const resolvedGetAssetId = React.useCallback<GetAssetId<AudioPlayerAsset>>(
    (asset, context) =>
      getAssetId?.(asset, context) ??
      asset.id ??
      asset.src ??
      asset.playbackUrls?.primary,
    [getAssetId]
  )
  const resolvedSource = React.useCallback<ResolveSource<AudioPlayerAsset>>(
    async (context) => {
      if (resolveSource) return resolveSource(context)

      const { asset, signal } = context
      if (asset.src) {
        return {
          config: asset.config,
          src: asset.src,
        }
      }

      if (!asset.playbackUrls?.primary) {
        throw new Error("AudioPlayerAsset requires src or playbackUrls.primary")
      }

      const src = await fetchPlaybackUrl(asset.playbackUrls.primary, signal)
      if (signal.aborted) {
        throw new DOMException("Playback source request aborted", "AbortError")
      }

      return {
        config: asset.config,
        src,
      }
    },
    [resolveSource]
  )

  const value = React.useMemo(
    () => ({
      items,
    }),
    [items]
  )

  return (
    <AudioSourceContext.Provider value={value}>
      <PlaybackSourceController
        asset={asset}
        assetOptions={resolvedAssetOptions}
        autoLoad={autoLoad}
        getAssetId={resolvedGetAssetId}
        initialIndex={initialIndex}
        mediaSrc={mediaSrc}
        playlist={playlist}
        resolveSource={resolvedSource}
      />
      {children}
    </AudioSourceContext.Provider>
  )
}

export function useAudioSource() {
  const context = React.useContext(AudioSourceContext)

  if (!context) {
    throw new Error("Missing AudioSourceProvider")
  }

  return context
}

async function fetchPlaybackUrl(
  playbackUrl: string,
  signal?: AbortSignal
): Promise<string> {
  const url = new URL(playbackUrl)
  url.searchParams.set("raw", "true")

  const response = await fetch(url.toString(), { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch playback URL: ${response.statusText}`)
  }

  const data: RawPlaybackResponse = await response.json()
  return data.url
}

function isNetworkError(error: unknown) {
  return (
    error &&
    typeof error === "object" &&
    "category" in error &&
    (error as { category: number }).category === 1
  )
}
