"use client"

import type shaka from "shaka-player"

import { useCallback, useEffect } from "react"

import type {
  PlaybackEvents,
  PlaybackStore,
} from "@/registry/default/hooks/use-playback"
import type {
  PlayerEvents,
  PlayerStore,
  UsePlayerOptions,
} from "@/registry/default/hooks/use-player"
import type {
  PlaylistChangeEvent,
  PlaylistEvents,
  PlaylistStore,
} from "@/registry/default/hooks/use-playlist"
import type {
  ImmerStoreApi,
  MediaFeature,
  MediaStore,
} from "@/registry/default/ui/media-provider"

import { isLoadInterrupted } from "@/registry/default/hooks/use-player"
import {
  usePlaylist,
} from "@/registry/default/hooks/use-playlist"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export interface Asset {
  config?: shaka.extern.PlayerConfiguration
  description?: string
  id: string
  poster?: string
  src: string
  title?: string
}

export interface UseAssetLoadContext<TAsset extends Asset> {
  asset: TAsset
  defaultLoad: (
    source?: null | shaka.media.PreloadManager | string,
    startTime?: number
  ) => Promise<void>
  media: HTMLMediaElement
  player: shaka.Player
  preloadManager?: shaka.media.PreloadManager
  signal: AbortSignal
  startTime?: number
}

export interface UseAssetLoader<TAsset extends Asset> {
  load?: (context: UseAssetLoadContext<TAsset>) => Promise<void>
  preload?: (
    context: UseAssetPreloadContext<TAsset>
  ) => Promise<null | shaka.media.PreloadManager>
}

export interface UseAssetOptions<TAsset extends Asset> {
  autoplayFirst?: boolean
  loader?: UseAssetLoader<TAsset>
  maxRetries?: number
  onAssetChange?: (event: PlaylistChangeEvent<TAsset>) => void
  onAssetLoaded?: (asset: TAsset) => void
  onLoadError?: (
    asset: TAsset,
    error: Error,
    context: { hasNext: boolean; retryCount: number }
  ) => "retry" | "skip" | "stop"
  onPlaybackError?: (
    asset: TAsset,
    error: Error,
    context: { currentTime: number }
  ) => Promise<
    | { action: "reload"; asset?: TAsset; startTime?: number }
    | { action: "skip" }
    | { action: "stop" }
    >
  playerOptions?: Partial<UsePlayerOptions<TAsset>>
}

export interface UseAssetPreloadContext<TAsset extends Asset> {
  asset: TAsset
  defaultPreload: (
    source?: string
  ) => Promise<null | shaka.media.PreloadManager>
  player: shaka.Player
}

export interface UseAssetReturn<
  TAsset extends Asset,
  > {
  cancelPreload: (assetId: string) => void
  currentIndex: number
  currentItem: null | { id: string; properties: TAsset }
  cycleRepeatMode: () => void
  getItem: (id: string) => null | { id: string; properties: TAsset }
  hasNext: boolean
  hasPrevious: boolean
  insert: (items: { id: string; properties?: TAsset }[], atIndex: number) => void
  isPreloaded: (assetId: string) => boolean
  load: (items: { id: string; properties?: TAsset }[], startIndex?: number) => void
  loadAsset: (asset: TAsset, startTime?: number) => Promise<boolean>
  loadPlaylist: (assets: TAsset[], startIndex?: number) => void
  newSession: () => string
  next: () => boolean
  nextItem: null | { id: string; properties: TAsset }
  orderedItems: { id: string; properties: TAsset }[]
  playNext: (items: { id: string; properties?: TAsset }[]) => void
  preloadAsset: (asset: TAsset) => Promise<void>
  preloadNext: () => Promise<void>
  prepend: (items: { id: string; properties?: TAsset }[]) => void
  previous: () => boolean
  previousItem: null | { id: string; properties: TAsset }
  remove: (id: string) => void
  removeAt: (index: number) => void
  reorder: (fromIndex: number, toIndex: number) => void
  setRepeatMode: (mode: "all" | "off" | "one") => void
  setShuffle: (enabled: boolean) => void
  skipTo: (index: number) => boolean
  skipToId: (id: string) => boolean
  toggleShuffle: () => void
}

export const ASSET_FEATURE_KEY = "asset"

export interface AssetStore {
  [ASSET_FEATURE_KEY]: {
    installedOptions?: UseAssetOptions<Asset>
    isFirstLoad: boolean
    loadAbortController: AbortController | null
    loadAsset: (asset: Asset, startTime?: number) => Promise<boolean>
    loadGeneration: number
    loadPlaylist: (assets: Asset[], startIndex?: number) => void
    preloadAsset: (asset: Asset) => Promise<void>
    preloadNext: () => Promise<void>
    retryCount: number
    setOptions: (options?: UseAssetOptions<Asset>) => void
  }
}

type AssetSetupStore = AssetStore & PlaybackStore & PlayerStore & PlaylistStore

export function assetFeature(): MediaFeature<
  AssetStore,
  AssetStore & MediaStore & PlaybackStore & PlayerStore & PlaylistStore
> {
  return {
    createSlice: (set, get) => ({
      [ASSET_FEATURE_KEY]: {
        installedOptions: undefined,
        isFirstLoad: true,
        loadAbortController: null,
        loadAsset: async (asset, startTime) => {
          const player = get().player.instance as null | shaka.Player
          const media = get().media.mediaElement
          const options = get().asset.installedOptions as undefined | UseAssetOptions<Asset>

          if (!player || !media) {
            return false
          }

          const generation = get().asset.loadGeneration + 1
          get().asset.loadAbortController?.abort()

          const abortController = new AbortController()

          set(({ asset }) => {
            asset.loadAbortController = abortController
            asset.loadGeneration = generation
          })

          media.pause()

          const { onError: onPlayerError, onLoad, onPreload: _onPreload } =
            options?.playerOptions ?? {}

          try {
            const preloadManagers = get().player.preloadManagers as Map<
              string,
              shaka.media.PreloadManager
            >
            const preloadManager = preloadManagers.get(asset.id)

            const defaultLoad = async (
              source?: null | shaka.media.PreloadManager | string,
              customStartTime?: number
            ) => {
              player.resetConfiguration()
              if (asset.config) {
                player.configure(asset.config)
              }

              const resolvedSource =
                source === undefined ? (preloadManager ?? asset.src) : source

              const finalStartTime = customStartTime ?? startTime
              const timeToLoad = finalStartTime ?? undefined

              if (resolvedSource) {
                await player.load(resolvedSource, timeToLoad)
              } else {
                await player.load(asset.src, timeToLoad)
              }
            }

            if (options?.loader?.load) {
              await options.loader.load({
                asset,
                defaultLoad,
                media,
                player,
                preloadManager,
                signal: abortController.signal,
                startTime,
              })
            } else if (onLoad) {
              await onLoad(asset, player, media, preloadManager, startTime)
            } else {
              await defaultLoad()
            }

            if (preloadManager) {
              preloadManagers.delete(asset.id)
              set(({ player }) => {
                player.preloadManagers = new Map(preloadManagers)
              })
            }

            if (get().asset.loadGeneration !== generation) {
              return false
            }

            if (media.autoplay && media.paused) {
              if (get().asset.isFirstLoad) {
                if (options?.autoplayFirst) {
                  await get().playback.play()
                }
              } else {
                await get().playback.play()
              }
            }

            set(({ asset }) => {
              asset.isFirstLoad = false
              asset.retryCount = 0
            })

            options?.onAssetLoaded?.(asset)
            return true
          } catch (error) {
            onPlayerError?.(
              error instanceof Error ? error : new Error(String(error)),
              asset
            )

            if (
              get().asset.loadGeneration !== generation ||
              isLoadInterrupted(error) ||
              (error instanceof DOMException && error.name === "AbortError")
            ) {
              return false
            }

            const err = error instanceof Error ? error : new Error(String(error))
            const playlist = get().playlist
            const maxRetries = options?.maxRetries ?? 0
            const currentRetryCount = get().asset.retryCount
            const hasNext = playlist.getNextIndex() !== -1

            if (options?.onLoadError) {
              const decision = options.onLoadError(asset, err, {
                hasNext,
                retryCount: currentRetryCount,
              })

              if (decision === "retry" && currentRetryCount < maxRetries) {
                set(({ asset }) => {
                  asset.retryCount = currentRetryCount + 1
                })
                return get().asset.loadAsset(asset, startTime)
              }

              if ((decision === "skip" || (decision === "retry" && currentRetryCount >= maxRetries)) && hasNext) {
                set(({ asset }) => {
                  asset.retryCount = 0
                })
                playlist.next()
                return false
              }

              set(({ asset }) => {
                asset.retryCount = 0
              })
              return false
            }

            if (hasNext) {
              set(({ asset }) => {
                asset.retryCount = 0
              })
              playlist.next()
            }
            return false
          }
        },
        loadGeneration: 0,
        loadPlaylist: (assets, startIndex = 0) => {
          set(({ asset }) => {
            asset.isFirstLoad = true
          })

          get().playlist.load(
            assets.map((asset) => ({
              id: asset.id,
              properties: asset,
            })),
            startIndex
          )
        },
        preloadAsset: async (asset) => {
          const player = get().player.instance as null | shaka.Player
          const options = get().asset.installedOptions as undefined | UseAssetOptions<Asset>
          if (!player) return

          const { onError: onPlayerError, onPreload } = options?.playerOptions ?? {}

          try {
            const defaultPreload = async (
              source?: string
            ): Promise<null | shaka.media.PreloadManager> => {
              const resolvedSource = source ?? asset.src
              return player.preload(
                resolvedSource,
                undefined,
                undefined,
                asset.config
              )
            }

            let manager: null | shaka.media.PreloadManager = null

            if (options?.loader?.preload) {
              manager = await options.loader.preload({
                asset,
                defaultPreload,
                player,
              })
            } else if (onPreload) {
              manager = await onPreload(asset, player)
            } else {
              manager = await defaultPreload()
            }

            if (manager) {
              const preloadManagers = get().player.preloadManagers as Map<
                string,
                shaka.media.PreloadManager
              >
              preloadManagers.set(asset.id, manager)
              set(({ player }) => {
                player.preloadManagers = new Map(preloadManagers)
              })
            }
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error))
            onPlayerError?.(err, asset)
            console.error("[useAsset] Preload error:", error)
          }
        },
        preloadNext: async () => {
          const playlist = get().playlist
          const nextIndex = playlist.getNextIndex()
          if (nextIndex === -1) return
          const nextItem = playlist.queue[nextIndex]
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- noUncheckedIndexedAccess is off; index can be out of bounds
          if (nextItem) {
            await get().asset.preloadAsset(nextItem.properties as unknown as Asset)
          }
        },
        retryCount: 0,
        setOptions: (options) => {
          set(({ asset }) => {
            asset.installedOptions = options
          })
        },
      },
    }),
    key: ASSET_FEATURE_KEY,
    Setup: AssetSetup,
  }
}

export function useAsset<TAsset extends Asset = Asset>(
  options?: UseAssetOptions<TAsset>
): UseAssetReturn<TAsset> {
  const api = useMediaFeatureApi<AssetStore>(ASSET_FEATURE_KEY)
  const playlist = usePlaylist<TAsset>()
  const loadAsset = useAssetStore((state) => state.loadAsset) as (
    asset: TAsset,
    startTime?: number
  ) => Promise<boolean>
  const loadPlaylist = useAssetStore((state) => state.loadPlaylist) as (
    assets: TAsset[],
    startIndex?: number
  ) => void
  const preloadAsset = useAssetStore((state) => state.preloadAsset) as (
    asset: TAsset
  ) => Promise<void>
  const preloadNext = useAssetStore((state) => state.preloadNext)

  useEffect(() => {
    if (!options) return

    api.setState(({ asset }) => {
      asset.installedOptions = options as unknown as UseAssetOptions<Asset>
    })
  }, [api, options])

  const cancelPreload = useCallback(
    (assetId: string) => {
      const preloadManagers = (api.getState() as unknown as PlayerStore).player
        .preloadManagers as Map<string, shaka.media.PreloadManager>
      const manager = preloadManagers.get(assetId)
      if (manager) {
        manager.destroy()
        preloadManagers.delete(assetId)
          ; (api as unknown as ImmerStoreApi<PlayerStore>).setState(({ player }) => {
            player.preloadManagers = new Map(preloadManagers)
          })
      }
    },
    [api]
  )

  const isPreloaded = useCallback(
    (assetId: string) => {
      return (
        (api.getState() as unknown as PlayerStore).player.preloadManagers as Map<
          string,
          shaka.media.PreloadManager
        >
      ).has(assetId)
    },
    [api]
  )

  return {
    ...playlist,
    cancelPreload,
    isPreloaded,
    loadAsset,
    loadPlaylist,
    preloadAsset,
    preloadNext,
  }
}

export function useAssetStore<TSelected>(
  selector: (state: AssetStore["asset"]) => TSelected
): TSelected {
  return useMediaFeatureStore<AssetStore, TSelected>(
    ASSET_FEATURE_KEY,
    (state) => selector(state[ASSET_FEATURE_KEY])
  )
}

function AssetSetup() {
  const api = useMediaFeatureApi<AssetSetupStore>(ASSET_FEATURE_KEY)
  const events = useMediaEvents<PlaybackEvents & PlayerEvents & PlaylistEvents>()
  useEffect(() => {
    const getHasNext = () => {
      const { getNextIndex, queue, repeatMode } =
        api.getState().playlist
      return repeatMode === "all" && queue.length > 0
        ? true
        : getNextIndex() !== -1
    }

    const offPlaylistChange = events.on("playlistchange", (event) => {
      const item = event.currentItem
      if (!item) return

      const options = api.getState().asset
        .installedOptions as undefined | UseAssetOptions<Asset>

      options?.onAssetChange?.(event as unknown as PlaylistChangeEvent<Asset>)
      void api.getState().asset
        .loadAsset(item.properties as unknown as Asset)
    })

    const offPlaybackError = events.on("playbackerror", (payload) => {
      void (async () => {
        const { currentItem } = api.getState().playlist
        const options = api.getState().asset
          .installedOptions as undefined | UseAssetOptions<Asset>
        if (!currentItem || !options?.onPlaybackError) return

        const mediaElement = api.getState().media.mediaElement
        try {
          const currentTime = mediaElement ? mediaElement.currentTime : 0
          const decision = await options.onPlaybackError(
            currentItem.properties as unknown as Asset,
            payload.error,
            { currentTime }
          )

          if (decision.action === "reload") {
            const assetToLoad = (decision.asset ??
              currentItem.properties) as unknown as Asset
            const startTime = decision.startTime ?? currentTime
            void api.getState().asset
              .loadAsset(assetToLoad, startTime)
          } else if (decision.action === "skip" && getHasNext()) {
            api.getState().playlist.next()
          }
        } catch (callbackErr) {
          console.error("[useAsset] onPlaybackError callback failed:", callbackErr)
        }
      })()
    })

    const offEnded = events.on("ended", () => {
      if (getHasNext()) {
        api.getState().playlist.next()
      }
    })

    return () => {
      offPlaylistChange()
      offPlaybackError()
      offEnded()
    }
  }, [api, events])

  return null
}
