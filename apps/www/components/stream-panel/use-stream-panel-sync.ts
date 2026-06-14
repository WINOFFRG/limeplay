"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

import type {
  Asset,
  AssetEvents,
  UseAssetOptions,
} from "@/registry/default/hooks/use-asset"
import type { PlaybackStore } from "@/registry/default/hooks/use-playback"

import {
  addBlenderCaptions,
  APPLE_MUSIC_CHARTS_PLAYLIST_ID,
  type BlenderStreamResponse,
  fetchAppleMusicChartAssetsPage,
  fetchBlenderStream,
  fetchPlaylistPresetAssets,
  isBlenderOpenFilmAsset,
  type StreamPanelPlaylistPreset,
} from "@/components/stream-panel/content-catalog"
import {
  type StreamPanelContentKind,
  type StreamPanelPlayerType,
  type StreamPanelSelection,
  useStreamPanelStore,
  useStreamPanelStoreHydrated,
} from "@/components/stream-panel/use-stream-panel"
import { getPresetsForType, type StreamPreset } from "@/lib/stream-presets"
import {
  AssetRecoveryAction,
  useAsset,
} from "@/registry/default/hooks/use-asset"
import { useMediaStore } from "@/registry/default/hooks/use-media"
import { PLAYBACK_FEATURE_KEY } from "@/registry/default/hooks/use-playback"
import { usePlayerStore } from "@/registry/default/hooks/use-player"
import {
  PLAYLIST_FEATURE_KEY,
  type PlaylistStore,
} from "@/registry/default/hooks/use-playlist"
import { useVolumeStore } from "@/registry/default/hooks/use-volume"
import {
  useMediaEvents,
  useMediaFeatureApi,
} from "@/registry/default/ui/media-provider"

const DEFAULT_VIDEO_PRESET_ID = "mux-big-buck-bunny"
const APPLE_MUSIC_LOAD_MORE_THRESHOLD = 5

interface AppleMusicPaginationState {
  loadingPage?: number
  nextPage?: number
}

export function useStreamPanelSync({
  playerType = "video",
}: {
  playerType?: StreamPanelPlayerType
} = {}) {
  const playbackApi = useMediaFeatureApi<PlaybackStore>(PLAYBACK_FEATURE_KEY)
  const playlistApi = useMediaFeatureApi<PlaylistStore>(PLAYLIST_FEATURE_KEY)
  const events = useMediaEvents<AssetEvents>()
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const player = usePlayerStore((state) => state.instance)

  const volume = useStreamPanelStore((s) => s.volume)
  const muted = useStreamPanelStore((s) => s.muted)
  const autoplay = useStreamPanelStore((s) => s.autoplay)
  const contentSelection = useStreamPanelStore(
    (s) => s.contentSelections[playerType]
  )
  const storeHydrated = useStreamPanelStoreHydrated()
  const setContentSelection = useStreamPanelStore((s) => s.setContentSelection)

  const setVolume = useVolumeStore((s) => s.setVolume)
  const setMuted = useVolumeStore((s) => s.setMuted)
  const appleMusicPaginationRef = useRef<AppleMusicPaginationState>({})
  const playlistAbortRef = useRef<AbortController | null>(null)
  const restoredSelectionRef = useRef(false)
  const blenderStreamCacheRef = useRef<Map<
    string,
    BlenderStreamResponse
  > | null>(null)
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
          // DEV: The selected asset may change while the Blender stream URL is resolving.
          context.signal.throwIfAborted()

          await context.loadDefault(
            context.preloadManager ?? {
              config: context.asset.config,
              src: stream.playback.hls,
            }
          )
          // DEV: loadDefault is async; avoid adding captions to a superseded player load.
          context.signal.throwIfAborted()

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
      recover: {
        loadError: (_asset, error) => {
          playbackApi.getState().playback.setError(error)
          return AssetRecoveryAction.Stop
        },
      },
    }),
    [blenderStreamCache, playbackApi]
  )

  const { loadSource } = useAsset<Asset>()

  const appendNextAppleMusicChartPage = useCallback(
    (currentIndex: number) => {
      const pagination = appleMusicPaginationRef.current
      if (!pagination.nextPage || pagination.loadingPage) return

      const playlist = playlistApi.getState().playlist
      const remainingItems = playlist.queue.length - currentIndex - 1
      if (remainingItems >= APPLE_MUSIC_LOAD_MORE_THRESHOLD) return

      const page = pagination.nextPage
      const abortController = playlistAbortRef.current
      appleMusicPaginationRef.current = {
        ...pagination,
        loadingPage: page,
      }

      void fetchAppleMusicChartAssetsPage(page, abortController?.signal)
        .then(({ assets, nextPage }) => {
          if (abortController?.signal.aborted) return

          const selection =
            useStreamPanelStore.getState().contentSelections[playerType]
          if (
            !selection ||
            selection.kind !== "playlist" ||
            selection.id !== APPLE_MUSIC_CHARTS_PLAYLIST_ID
          ) {
            return
          }

          const existingIds = new Set(
            playlistApi.getState().playlist.queue.map((item) => item.id)
          )
          const newItems = assets
            .filter((asset) => asset.id && !existingIds.has(asset.id))
            .map((asset) => ({
              id: asset.id!,
              properties: asset,
            }))

          if (newItems.length > 0) {
            playlistApi.getState().playlist.append(newItems)
          }

          appleMusicPaginationRef.current = {
            nextPage,
          }
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError")
            return

          playbackApi.getState().playback.setError(error)
          appleMusicPaginationRef.current = {
            nextPage: page,
          }
        })
    },
    [playbackApi, playerType, playlistApi]
  )

  useEffect(() => {
    return events.on("assetchange", (event) => {
      const selection =
        useStreamPanelStore.getState().contentSelections[playerType]
      if (!selection || selection.kind !== "playlist") return

      if (selection.index !== event.currentIndex) {
        setContentSelection(playerType, {
          ...selection,
          index: event.currentIndex,
        })
      }

      if (
        playerType === "audio" &&
        selection.id === APPLE_MUSIC_CHARTS_PLAYLIST_ID
      ) {
        appendNextAppleMusicChartPage(event.currentIndex)
      }
    })
  }, [appendNextAppleMusicChartPage, events, playerType, setContentSelection])

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
    appleMusicPaginationRef.current = {}
    playlistAbortRef.current?.abort()
  }, [])

  useEffect(() => abortPlaylistRequest, [abortPlaylistRequest])

  const loadCustomStream = useCallback(
    (src: string, config?: string, id = `custom-${Date.now()}`) => {
      let parsedConfig: Record<string, unknown> | undefined
      if (config) {
        const parseResult = safeParseJson(config)
        if (!parseResult.ok) {
          playbackApi
            .getState()
            .playback.setError(
              new Error("Invalid JSON config: " + parseResult.error)
            )
          return null
        }
        parsedConfig = parseResult.value
      }

      const asset: StreamPreset = {
        config: parsedConfig,
        features: [],
        format: "progressive",
        group: "Special",
        id,
        name: "Custom Stream",
        src,
        type: playerType,
      }
      loadSource(asset as unknown as Asset, { loading: assetOptions })
      return asset
    },
    [assetOptions, loadSource, playbackApi, playerType]
  )

  const loadPlaylistPreset = useCallback(
    (playlistId: string, startIndex = 0) => {
      appleMusicPaginationRef.current = {}
      playlistAbortRef.current?.abort()
      const abortController = new AbortController()
      playlistAbortRef.current = abortController

      const playlistRequest =
        playlistId === APPLE_MUSIC_CHARTS_PLAYLIST_ID
          ? fetchAppleMusicChartAssetsPage(1, abortController.signal).then(
              ({ assets, nextPage }) => {
                appleMusicPaginationRef.current = {
                  nextPage,
                }
                return assets
              }
            )
          : fetchPlaylistPresetAssets(playlistId, abortController.signal).then(
              (assets) => {
                appleMusicPaginationRef.current = {}
                return assets
              }
            )

      void playlistRequest
        .then((assets) => {
          if (abortController.signal.aborted) return

          const index = normalizePlaylistIndex(
            playlistId === APPLE_MUSIC_CHARTS_PLAYLIST_ID ? 0 : startIndex,
            assets.length
          )
          setContentSelection(playerType, {
            id: playlistId,
            index,
            kind: "playlist",
          })
          loadSource(assets, {
            initialIndex: index,
            loading: assetOptions,
          })

          if (playlistId === APPLE_MUSIC_CHARTS_PLAYLIST_ID) {
            appendNextAppleMusicChartPage(index)
          }
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError")
            return

          playbackApi.getState().playback.setError(error)
        })
    },
    [
      appendNextAppleMusicChartPage,
      assetOptions,
      loadSource,
      playbackApi,
      playerType,
      setContentSelection,
    ]
  )

  const restoreContentSelection = useCallback(
    (selection: StreamPanelSelection) => {
      if (selection.kind === "playlist") {
        loadPlaylistPreset(selection.id, selection.index)
        return
      }

      const preset = getPresetsForType(playerType).find(
        (item) => item.id === selection.id
      )
      if (preset) {
        abortPlaylistRequest()
        loadSource(preset as unknown as Asset, { loading: assetOptions })
        return
      }

      if (!selection.src) return
      abortPlaylistRequest()
      loadCustomStream(selection.src, selection.config, selection.id)
    },
    [
      abortPlaylistRequest,
      loadCustomStream,
      assetOptions,
      loadSource,
      loadPlaylistPreset,
      playerType,
    ]
  )

  useEffect(() => {
    if (
      !storeHydrated ||
      !mediaElement ||
      !player ||
      restoredSelectionRef.current
    )
      return

    restoredSelectionRef.current = true
    if (contentSelection) {
      restoreContentSelection(contentSelection)
      return
    }

    const defaultSelection = getDefaultSelectionForType(playerType)
    if (!defaultSelection) return

    setContentSelection(playerType, defaultSelection)
    restoreContentSelection(defaultSelection)
  }, [
    contentSelection,
    mediaElement,
    player,
    playerType,
    restoreContentSelection,
    setContentSelection,
    storeHydrated,
  ])

  const handlePresetChange = useCallback(
    (preset: StreamPreset, kind: StreamPanelContentKind = "stream") => {
      abortPlaylistRequest()
      setContentSelection(playerType, { id: preset.id, index: 0, kind })
      loadSource(preset as unknown as Asset, { loading: assetOptions })
    },
    [
      abortPlaylistRequest,
      assetOptions,
      loadSource,
      playerType,
      setContentSelection,
    ]
  )

  const handlePlaylistPresetChange = useCallback(
    (playlist: StreamPanelPlaylistPreset) => {
      loadPlaylistPreset(playlist.id)
    },
    [loadPlaylistPreset]
  )

  const handleLoadStream = useCallback(
    (src: string, config?: string) => {
      abortPlaylistRequest()
      const asset = loadCustomStream(src, config)
      if (!asset) return

      setContentSelection(playerType, {
        config,
        id: asset.id,
        index: 0,
        kind: "stream",
        src,
      })
    },
    [abortPlaylistRequest, loadCustomStream, playerType, setContentSelection]
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

function getDefaultPresetForType(
  playerType: StreamPanelPlayerType
): StreamPreset | undefined {
  const presets = getPresetsForType(playerType)
  if (playerType === "video") {
    return (
      presets.find((preset) => preset.id === DEFAULT_VIDEO_PRESET_ID) ??
      presets[0]
    )
  }

  return presets[0]
}

function getDefaultSelectionForType(
  playerType: StreamPanelPlayerType
): StreamPanelSelection | undefined {
  if (playerType === "audio") {
    return {
      id: APPLE_MUSIC_CHARTS_PLAYLIST_ID,
      index: 0,
      kind: "playlist",
    }
  }

  const defaultPreset = getDefaultPresetForType(playerType)
  if (!defaultPreset) return undefined

  return {
    id: defaultPreset.id,
    index: 0,
    kind: "stream",
  }
}

function normalizePlaylistIndex(index: number | undefined, itemCount: number) {
  if (typeof index !== "number" || !Number.isInteger(index) || itemCount <= 0)
    return 0
  return Math.min(Math.max(index, 0), itemCount - 1)
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
