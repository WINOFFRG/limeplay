"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

import type { StreamPreset } from "@/lib/stream-presets"
import type { Asset, UseAssetOptions } from "@/registry/default/hooks/use-asset"
import type { PlaybackStore } from "@/registry/default/hooks/use-playback"

import {
  addBlenderCaptions,
  type BlenderStreamResponse,
  fetchBlenderStream,
  fetchPlaylistPresetAssets,
  isBlenderOpenFilmAsset,
  type StreamPanelPlaylistPreset,
} from "@/components/stream-panel/content-catalog"
import {
  type StreamPanelContentKind,
  type StreamPanelPlayerType,
  useStreamPanelStore,
} from "@/lib/docs-dial-store"
import { useAsset } from "@/registry/default/hooks/use-asset"
import { useMediaStore } from "@/registry/default/hooks/use-media"
import { PLAYBACK_FEATURE_KEY } from "@/registry/default/hooks/use-playback"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"
import { useMediaFeatureApi } from "@/registry/default/ui/media-provider"

export function useStreamPanelSync({
  playerType = "video",
}: {
  playerType?: StreamPanelPlayerType
} = {}) {
  const playbackApi = useMediaFeatureApi<PlaybackStore>(PLAYBACK_FEATURE_KEY)
  const mediaElement = useMediaStore((state) => state.mediaElement)

  const volume = useStreamPanelStore((s) => s.volume)
  const muted = useStreamPanelStore((s) => s.muted)
  const autoplay = useStreamPanelStore((s) => s.autoplay)
  const setContentSelection = useStreamPanelStore((s) => s.setContentSelection)
  const setPresetId = useStreamPanelStore((s) => s.setPresetId)

  const setVolume = useVolumeStore((s) => s.setVolume)
  const setMuted = useVolumeStore((s) => s.setMuted)
  const playlistAbortRef = useRef<AbortController | null>(null)
  const blenderStreamCacheRef = useRef<Map<string, BlenderStreamResponse> | null>(
    null
  )
  if (blenderStreamCacheRef.current === null) {
    blenderStreamCacheRef.current = new Map()
  }
  const blenderStreamCache = blenderStreamCacheRef.current

  const assetOptions = useMemo<UseAssetOptions<Asset>>(
    () => ({
      getAssetId: (asset) => asset.id ?? asset.src,
      loader: {
        load: async (context) => {
          if (!isBlenderOpenFilmAsset(context.asset)) {
            await context.loadDefault()
            return
          }
          if (context.signal.aborted) return

          const stream = await getBlenderStream(
            context.asset.id,
            context.signal,
            blenderStreamCache
          )
          context.signal.throwIfAborted()

          await context.loadDefault(
            context.preloadManager ?? {
              config: context.asset.config,
              src: stream.playback.hls,
            }
          )

          try {
            await addBlenderCaptions(context.player, stream)
          } catch (error) {
            console.error("Failed to add Blender captions:", error)
          }
        },
        preload: async (context) => {
          if (!isBlenderOpenFilmAsset(context.asset)) {
            return context.preloadDefault()
          }
          if (context.signal.aborted) return null

          const stream = await getBlenderStream(
            context.asset.id,
            context.signal,
            blenderStreamCache
          )
          context.signal.throwIfAborted()

          return context.preloadDefault({
            config: context.asset.config,
            src: stream.playback.hls,
          })
        },
      },
      onLoadError: (_asset, error) => {
        playbackApi.setState(({ playback }) => {
          playback.status = "error"
          playback.error = error
        })
        return "stop"
      },
    }),
    [blenderStreamCache, playbackApi]
  )

  const { loadPlaylist } = useAsset(assetOptions)

  useEffect(() => {
    if (!mediaElement) return
    setVolume(volume / 100)
  }, [volume, mediaElement, setVolume])

  useEffect(() => {
    if (!mediaElement) return
    setMuted(muted)
  }, [muted, mediaElement, setMuted])

  useEffect(() => {
    if (!mediaElement) return
    mediaElement.autoplay = autoplay
  }, [autoplay, mediaElement])

  const abortPlaylistRequest = useCallback(() => {
    playlistAbortRef.current?.abort()
  }, [])

  useEffect(() => abortPlaylistRequest, [abortPlaylistRequest])

  const handlePresetChange = useCallback(
    (preset: StreamPreset, kind: StreamPanelContentKind = "stream") => {
      setPresetId(preset.id)
      setContentSelection(playerType, { id: preset.id, kind })
      loadPlaylist([preset as unknown as Asset])
    },
    [loadPlaylist, playerType, setContentSelection, setPresetId]
  )

  const handlePlaylistPresetChange = useCallback(
    (playlist: StreamPanelPlaylistPreset) => {
      playlistAbortRef.current?.abort()
      const abortController = new AbortController()
      playlistAbortRef.current = abortController

      void fetchPlaylistPresetAssets(playlist.id, abortController.signal)
        .then((assets) => {
          if (abortController.signal.aborted) return

          setContentSelection(playerType, {
            id: playlist.id,
            kind: "playlist",
          })
          loadPlaylist(assets)
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError")
            return

          playbackApi.setState(({ playback }) => {
            playback.status = "error"
            playback.error = error
          })
        })
    },
    [loadPlaylist, playbackApi, playerType, setContentSelection]
  )

  const handleLoadStream = useCallback(
    (src: string, config?: string) => {
      let parsedConfig: Record<string, unknown> | undefined
      if (config) {
        const parseResult = safeParseJson(config)
        if (!parseResult.ok) {
          playbackApi.setState(({ playback }) => {
            playback.status = "error"
            playback.error = new Error(
              "Invalid JSON config: " + parseResult.error
            )
          })
          return
        }
        parsedConfig = parseResult.value
      }
      const asset: StreamPreset = {
        config: parsedConfig,
        features: [],
        format: "progressive",
        group: "Special",
        id: `custom-${Date.now()}`,
        name: "Custom Stream",
        src,
        type: playerType,
      }
      setContentSelection(playerType, { id: asset.id, kind: "stream" })
      loadPlaylist([asset as unknown as Asset])
    },
    [loadPlaylist, playbackApi, playerType, setContentSelection]
  )

  return {
    handleLoadStream,
    handlePlaylistPresetChange,
    handlePresetChange,
  }
}

async function getBlenderStream(
  assetId: string | undefined,
  signal: AbortSignal,
  cache: Map<string, BlenderStreamResponse>
): Promise<BlenderStreamResponse> {
  if (!assetId) {
    throw new Error("Blender playlist asset is missing an id.")
  }

  const cached = cache.get(assetId)
  if (cached) return cached

  const stream = await fetchBlenderStream(assetId, signal)
  if (!signal.aborted) {
    cache.set(assetId, stream)
  }

  return stream
}

function safeParseJson(
  str: string
): { error: string; ok: false } | { ok: true; value: Record<string, unknown> } {
  try {
    return { ok: true, value: JSON.parse(str) }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e), ok: false }
  }
}
