"use client"

import * as React from "react"

import type { AudioPlayerAsset } from "@/registry/default/blocks/audio-player/player"
import type {
  PlayerSource,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"

import { AssetRecoveryAction } from "@/registry/default/hooks/use-asset"
import { PlaybackSourceController } from "@/registry/default/hooks/use-playback-source"

export interface AudioAssetDisplayMetadata {
  poster?: string
  subtitle?: string
  title: string
}

export interface AudioSourceProviderProps {
  autoLoad?: boolean
  children?: React.ReactNode
  initialIndex?: number
  loading?: UseAssetOptions<AudioPlayerAsset>
  source?: PlayerSource<AudioPlayerAsset>
  sourceKey?: string
}

interface RawPlaybackResponse {
  expires_at: string
  url: string
}

export function AudioSourceProvider({
  autoLoad = true,
  children,
  initialIndex,
  loading,
  source,
  sourceKey,
}: AudioSourceProviderProps) {
  const resolvedLoading = React.useMemo<UseAssetOptions<AudioPlayerAsset>>(
    () => ({
      ...loading,
      getAssetId: (asset, context) =>
        loading?.getAssetId?.(asset, context) ??
        asset.id ??
        asset.src ??
        asset.playbackUrls?.primary,
      recover: {
        loadError: (_asset: AudioPlayerAsset, _error: unknown, { hasNext }) => {
          return hasNext ? AssetRecoveryAction.Skip : AssetRecoveryAction.Stop
        },
        playbackError: async (
          _asset: AudioPlayerAsset,
          error: Error,
          { currentTime }: { currentTime: number }
        ) => {
          if (isNetworkError(error)) {
            return {
              action: AssetRecoveryAction.Reload,
              startTime: currentTime,
            }
          }

          return { action: AssetRecoveryAction.Skip }
        },
        ...loading?.recover,
      },
      resolveSource: async (context) => {
        if (loading?.resolveSource) return loading.resolveSource(context)

        const { asset, signal } = context
        if (asset.src) {
          return {
            config: asset.config,
            src: asset.src,
          }
        }

        if (!asset.playbackUrls?.primary) {
          throw new Error(
            "AudioPlayerAsset requires src or playbackUrls.primary"
          )
        }

        const src = await fetchPlaybackUrl(asset.playbackUrls.primary, signal)
        if (signal.aborted) {
          throw new DOMException(
            "Playback source request aborted",
            "AbortError"
          )
        }

        return {
          config: asset.config,
          src,
        }
      },
    }),
    [loading]
  )

  return (
    <>
      <PlaybackSourceController
        autoLoad={autoLoad}
        initialIndex={initialIndex}
        loading={resolvedLoading}
        source={source}
        sourceKey={sourceKey}
      />
      {children}
    </>
  )
}

export function getAudioAssetMetadata(
  asset: AudioPlayerAsset | null | undefined,
  fallbackTitle = "Unknown Title"
): AudioAssetDisplayMetadata {
  if (!asset) {
    return {
      title: fallbackTitle,
    }
  }

  const releaseYear = asset.releaseYear ?? asset.year
  const artistAlbum = joinDisplayParts([asset.artistName, asset.albumName])
  const genreYear = joinDisplayParts([asset.genre, releaseYear])
  const streamLabel = getStreamLabel(asset)

  return {
    poster:
      firstNonEmpty(
        asset.poster,
        getArtworkUrl(asset.artwork),
        asset.images?.poster,
        asset.images?.backdrop
      ) ?? undefined,
    subtitle:
      firstNonEmpty(
        artistAlbum,
        genreYear,
        asset.subtitle,
        streamLabel,
        asset.description
      ) ?? undefined,
    title:
      firstNonEmpty(
        asset.title,
        asset.name,
        asset.albumName,
        asset.description
      ) ?? fallbackTitle,
  }
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

function firstNonEmpty(
  ...values: (null | number | string | undefined)[]
): string | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value)
    }

    if (typeof value !== "string") continue

    const trimmed = value.trim()
    if (trimmed) return trimmed
  }

  return undefined
}

function getArtworkUrl(
  artwork: AudioPlayerAsset["artwork"]
): string | undefined {
  const url = firstNonEmpty(artwork?.url, artwork?.templateUrl)
  if (!url) return undefined

  return url
    .replaceAll("{w}", "80")
    .replaceAll("{h}", "80")
    .replaceAll("{f}", "jpg")
}

function getStreamLabel(asset: AudioPlayerAsset): string | undefined {
  return joinDisplayParts([asset.group, ...(asset.features ?? [])])
}

function isNetworkError(error: unknown) {
  return (
    error &&
    typeof error === "object" &&
    "category" in error &&
    (error as { category: number }).category === 1
  )
}

function joinDisplayParts(
  values: (null | number | string | undefined)[]
): string | undefined {
  const parts = values
    .map((value) => firstNonEmpty(value))
    .filter((value): value is string => Boolean(value))

  return parts.length > 0 ? parts.join(" • ") : undefined
}
