"use client"

import type shaka from "shaka-player"

import { useCallback, useEffect, useId } from "react"

import type {
  PlaybackEvents,
  PlaybackStore,
} from "@/registry/default/hooks/use-playback"
import type {
  PlayerEvents,
  PlayerStore,
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
import { usePlaylist } from "@/registry/default/hooks/use-playlist"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@/registry/default/ui/media-provider"

export interface Asset {
  config?: shaka.extern.PlayerConfiguration
  description?: string
  id?: string
  poster?: string
  src?: string
  title?: string
}

export interface AssetLoadContext<TAsset extends Asset = Asset> {
  asset: TAsset
  loadDefault: (
    source?: null | PlaybackSource | shaka.media.PreloadManager | string,
    options?: number | { startTime?: number }
  ) => Promise<void>
  media: HTMLMediaElement
  player: shaka.Player
  preloadManager?: shaka.media.PreloadManager
  previousError?: unknown
  retryCount: number
  signal: AbortSignal
  startTime?: number
}

export interface AssetPreloadContext<TAsset extends Asset = Asset> {
  asset: TAsset
  player: shaka.Player
  preloadDefault: (
    source?: PlaybackSource | string
  ) => Promise<null | shaka.media.PreloadManager>
  previousError?: unknown
  retryCount: number
  signal: AbortSignal
}

export type AssetSourceOperation = "load" | "preload"

export type GetAssetId<TAsset extends Asset = Asset> = (
  asset: TAsset,
  context: {
    index?: number
    origin: "asset" | "media-props" | "playlist"
  }
) => null | string | undefined

export interface NormalizedAsset<TAsset extends Asset = Asset> {
  id: string
  properties: TAsset
}

export interface PlaybackSource {
  config?: shaka.extern.PlayerConfiguration
  src?: string
}

export type ResolveSource<TAsset extends Asset = Asset> = (
  context: ResolveSourceContext<TAsset>
) => MaybePromise<null | PlaybackSource | string | undefined>

export interface ResolveSourceContext<TAsset extends Asset = Asset> {
  asset: TAsset
  operation: AssetSourceOperation
  previousError?: unknown
  retryCount: number
  signal: AbortSignal
  startTime?: number
}

export interface UseAssetActions {
  clearOptions: (ownerId: string) => void
  loadAsset: (asset: Asset, startTime?: number) => Promise<boolean>
  loadPlaylist: (assets: Asset[], startIndex?: number) => void
  preloadAsset: (asset: Asset) => Promise<void>
  preloadNext: () => Promise<void>
  setOptions: (options: UseAssetOptions<Asset>, ownerId: string) => void
}

export interface UseAssetEvents {
  ended: "advance to the next playlist item when available"
  playbackerror: "delegate reload, skip, or stop decisions to onPlaybackError"
  playlistchange: "load the newly active playlist item"
}

export type UseAssetLoadContext<TAsset extends Asset> = AssetLoadContext<TAsset>

export interface UseAssetLoader<TAsset extends Asset> {
  load?: (context: AssetLoadContext<TAsset>) => Promise<void>
  preload?: (
    context: AssetPreloadContext<TAsset>
  ) => Promise<null | shaka.media.PreloadManager>
}

export interface UseAssetOptions<TAsset extends Asset> {
  autoplayFirst?: boolean
  getAssetId?: GetAssetId<TAsset>
  loader?: UseAssetLoader<TAsset>
  maxRetries?: number
  onAssetChange?: (event: PlaylistChangeEvent<TAsset>) => void
  onAssetLoaded?: (asset: TAsset) => void
  onError?: (error: Error, asset?: TAsset) => void
  onLoadError?: (
    asset: TAsset,
    error: unknown,
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
  resolveSource?: ResolveSource<TAsset>
}

export type UseAssetPreloadContext<TAsset extends Asset> =
  AssetPreloadContext<TAsset>

export interface UseAssetReturn<TAsset extends Asset> {
  cancelPreload: (assetId: string) => void
  currentIndex: number
  currentItem: null | { id: string; properties: TAsset }
  cycleRepeatMode: () => void
  getItem: (id: string) => null | { id: string; properties: TAsset }
  hasNext: boolean
  hasPrevious: boolean
  insert: (
    items: { id: string; properties?: TAsset }[],
    atIndex: number
  ) => void
  isPreloaded: (assetId: string) => boolean
  load: (
    items: { id: string; properties?: TAsset }[],
    startIndex?: number
  ) => void
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

export interface UseAssetState {
  installedOptions?: UseAssetOptions<Asset>
  isFirstLoad: boolean
  loadAbortController: AbortController | null
  loadGeneration: number
  optionsOwnerId: null | string
  previousError: unknown
  retryCount: number
}

export const ASSET_FEATURE_KEY = "asset"

export interface AssetStore {
  [ASSET_FEATURE_KEY]: {
    clearOptions: (ownerId: string) => void
    installedOptions?: UseAssetOptions<Asset>
    isFirstLoad: boolean
    loadAbortController: AbortController | null
    loadAsset: (asset: Asset, startTime?: number) => Promise<boolean>
    loadGeneration: number
    loadPlaylist: (assets: Asset[], startIndex?: number) => void
    optionsByOwner: Record<string, undefined | UseAssetOptions<Asset>>
    optionsOwnerId: null | string
    optionsOwnerOrder: string[]
    preloadAbortControllers: Record<string, AbortController | undefined>
    preloadAsset: (asset: Asset) => Promise<void>
    preloadNext: () => Promise<void>
    previousError: unknown
    retryCount: number
    setOptions: (options: UseAssetOptions<Asset>, ownerId: string) => void
  }
}

type AssetSetupStore = AssetStore & PlaybackStore & PlayerStore & PlaylistStore

type MaybePromise<T> = Promise<T> | T

type NormalizedSource = {
  config?: shaka.extern.PlayerConfiguration
  source?: null | shaka.media.PreloadManager | string
}

export function assetFeature(): MediaFeature<
  AssetStore,
  AssetStore & MediaStore & PlaybackStore & PlayerStore & PlaylistStore
> {
  return {
    createSlice: (set, get) => ({
      [ASSET_FEATURE_KEY]: {
        clearOptions: (ownerId) => {
          if (!get().asset.optionsByOwner[ownerId]) return

          set(({ asset }) => {
            delete asset.optionsByOwner[ownerId]
            asset.optionsOwnerOrder = asset.optionsOwnerOrder.filter(
              (id) => id !== ownerId
            )

            if (asset.optionsOwnerId !== ownerId) return

            const nextOwnerId =
              asset.optionsOwnerOrder[asset.optionsOwnerOrder.length - 1] ?? null
            asset.optionsOwnerId = nextOwnerId
            asset.installedOptions = nextOwnerId
              ? asset.optionsByOwner[nextOwnerId]
              : undefined
          })
        },
        installedOptions: undefined,
        isFirstLoad: true,
        loadAbortController: null,
        loadAsset: async (asset, startTime) => {
          const player = get().player.instance as null | shaka.Player
          const media = get().media.mediaElement
          const options = get().asset.installedOptions as
            | undefined
            | UseAssetOptions<Asset>

          if (!player || !media) {
            return false
          }

          const assetId = getNormalizedAssetId(asset, options, {
            origin: "asset",
          })

          const generation = get().asset.loadGeneration + 1
          get().asset.loadAbortController?.abort()

          const abortController = new AbortController()

          set(({ asset }) => {
            asset.loadAbortController = abortController
            asset.loadGeneration = generation
          })

          media.pause()

          try {
            const preloadManagers = get().player.preloadManagers as Map<
              string,
              shaka.media.PreloadManager
            >
            const preloadManager = preloadManagers.get(assetId)
            const retryCount = get().asset.retryCount
            const previousError = get().asset.previousError ?? undefined

            const loadDefault = async (
              source?:
                | null
                | PlaybackSource
                | shaka.media.PreloadManager
                | string,
              loadOptions?: number | { startTime?: number }
            ) => {
              const normalizedSource = normalizePlaybackSource(source)
              player.resetConfiguration()

              if (asset.config) {
                player.configure(asset.config)
              }

              if (normalizedSource.config) {
                player.configure(normalizedSource.config)
              }

              const shouldUseFallbackSource =
                source === undefined ||
                source === null ||
                (Boolean(normalizedSource.config) && !normalizedSource.source)
              const resolvedSource = shouldUseFallbackSource
                ? (preloadManager ?? normalizedSource.source ?? asset.src)
                : normalizedSource.source

              const finalStartTime =
                typeof loadOptions === "number"
                  ? loadOptions
                  : (loadOptions?.startTime ?? startTime)
              const timeToLoad = finalStartTime ?? undefined

              if (!resolvedSource) {
                throw new Error(
                  `[useAsset] Missing playback source for asset "${assetId}". Provide asset.src or resolveSource.`
                )
              }

              await player.load(resolvedSource, timeToLoad)
            }

            if (options?.loader?.load) {
              await options.loader.load({
                asset,
                loadDefault,
                media,
                player,
                preloadManager,
                previousError,
                retryCount,
                signal: abortController.signal,
                startTime,
              })
            } else {
              const resolved = await resolveSourceValue(options, {
                asset,
                operation: "load",
                previousError,
                retryCount,
                signal: abortController.signal,
                startTime,
              })

              if (abortController.signal.aborted) {
                return false
              }

              await loadDefault(resolved)
            }

            if (preloadManager) {
              const updated = new Map(preloadManagers)
              updated.delete(assetId)
              set(({ player }) => {
                player.preloadManagers = updated
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
              asset.previousError = null
              asset.retryCount = 0
            })

            options?.onAssetLoaded?.(asset)
            return true
          } catch (error) {
            if (
              get().asset.loadGeneration !== generation ||
              isLoadInterrupted(error) ||
              (error instanceof DOMException && error.name === "AbortError")
            ) {
              return false
            }

            const normalizedError = toError(error)
            options?.onError?.(normalizedError, asset)
            const playlist = get().playlist
            const maxRetries = options?.maxRetries ?? 0
            const currentRetryCount = get().asset.retryCount
            const hasNext = playlist.getNextIndex() !== -1

            set(({ asset }) => {
              asset.previousError = error
            })

            if (options?.onLoadError) {
              const decision = options.onLoadError(asset, error, {
                hasNext,
                retryCount: currentRetryCount,
              })

              if (decision === "retry" && currentRetryCount < maxRetries) {
                set(({ asset }) => {
                  asset.retryCount = currentRetryCount + 1
                })
                return get().asset.loadAsset(asset, startTime)
              }

              if (
                (decision === "skip" ||
                  (decision === "retry" && currentRetryCount >= maxRetries)) &&
                hasNext
              ) {
                set(({ asset }) => {
                  asset.previousError = null
                  asset.retryCount = 0
                })
                playlist.next()
                return false
              }

              set(({ asset }) => {
                asset.previousError = null
                asset.retryCount = 0
              })
              return false
            }

            if (hasNext) {
              set(({ asset }) => {
                asset.previousError = null
                asset.retryCount = 0
              })
              playlist.next()
            }
            return false
          }
        },
        loadGeneration: 0,
        loadPlaylist: (assets, startIndex = 0) => {
          const options = get().asset.installedOptions as
            | undefined
            | UseAssetOptions<Asset>
          const normalizedAssets = normalizeAssets(assets, options)

          set(({ asset }) => {
            asset.isFirstLoad = true
            asset.previousError = null
            asset.retryCount = 0
          })

          get().playlist.load(normalizedAssets, startIndex)
        },
        optionsByOwner: {},
        optionsOwnerId: null,
        optionsOwnerOrder: [],
        preloadAbortControllers: {},
        preloadAsset: async (asset) => {
          const player = get().player.instance as null | shaka.Player
          const options = get().asset.installedOptions as
            | undefined
            | UseAssetOptions<Asset>
          if (!player) return

          const assetId = getNormalizedAssetId(asset, options, {
            origin: "asset",
          })
          get().asset.preloadAbortControllers[assetId]?.abort()
          const abortController = new AbortController()

          set(({ asset }) => {
            asset.preloadAbortControllers[assetId] = abortController
          })

          const isCurrentPreload = () => {
            return (
              get().asset.preloadAbortControllers[assetId] === abortController &&
              !abortController.signal.aborted
            )
          }

          try {
            const retryCount = get().asset.retryCount
            const previousError = get().asset.previousError ?? undefined

            const preloadDefault = async (
              source?: PlaybackSource | string
            ): Promise<null | shaka.media.PreloadManager> => {
              if (!isCurrentPreload()) return null

              const normalizedSource = normalizePlaybackSource(source)
              const resolvedSource = normalizedSource.source ?? asset.src

              if (!resolvedSource || typeof resolvedSource !== "string") {
                throw new Error(
                  `[useAsset] Missing preload source for asset "${assetId}". Provide asset.src or resolveSource.`
                )
              }

              const manager = await player.preload(
                resolvedSource,
                undefined,
                undefined,
                mergePlayerConfiguration(asset.config, normalizedSource.config)
              )
              if (!isCurrentPreload()) {
                void manager?.destroy()
                return null
              }

              return manager
            }

            let manager: null | shaka.media.PreloadManager = null

            if (options?.loader?.preload) {
              manager = await options.loader.preload({
                asset,
                player,
                preloadDefault,
                previousError,
                retryCount,
                signal: abortController.signal,
              })
            } else {
              const resolved = await resolveSourceValue(options, {
                asset,
                operation: "preload",
                previousError,
                retryCount,
                signal: abortController.signal,
              })

              if (!isCurrentPreload()) return

              manager = await preloadDefault(resolved ?? undefined)
            }

            if (!isCurrentPreload()) {
              void manager?.destroy()
              return
            }

            if (manager) {
              const existing = get().player.preloadManagers as Map<
                string,
                shaka.media.PreloadManager
              >
              const previousManager = existing.get(assetId)

              if (previousManager && previousManager !== manager) {
                void previousManager.destroy()
              }

              const updated = new Map(existing)
              updated.set(assetId, manager)
              set(({ player }) => {
                player.preloadManagers = updated
              })
            }
          } catch (error) {
            if (
              abortController.signal.aborted ||
              (error instanceof DOMException && error.name === "AbortError")
            ) {
              return
            }

            const err = toError(error)
            options?.onError?.(err, asset)
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
            await get().asset.preloadAsset(
              nextItem.properties as unknown as Asset
            )
          }
        },
        previousError: null,
        retryCount: 0,
        setOptions: (options, ownerId) => {
          set(({ asset }) => {
            asset.optionsByOwner[ownerId] = options
            asset.optionsOwnerOrder = [
              ...asset.optionsOwnerOrder.filter((id) => id !== ownerId),
              ownerId,
            ]
            asset.installedOptions = options
            asset.optionsOwnerId = ownerId
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
  const optionsOwnerId = useId()
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

    api
      .getState()
      .asset.setOptions(
        options as unknown as UseAssetOptions<Asset>,
        optionsOwnerId
      )

    return () => {
      api.getState().asset.clearOptions(optionsOwnerId)
    }
  }, [api, options, optionsOwnerId])

  const cancelPreload = useCallback(
    (assetId: string) => {
      const preloadAbortController = api.getState().asset
        .preloadAbortControllers[assetId]
      preloadAbortController?.abort()

      const preloadManagers = (api.getState() as unknown as PlayerStore).player
        .preloadManagers as Map<string, shaka.media.PreloadManager>
      const manager = preloadManagers.get(assetId)
      if (manager) {
        manager.destroy()
        const updated = new Map(preloadManagers)
        updated.delete(assetId)
        ;(api as unknown as ImmerStoreApi<PlayerStore>).setState(
          ({ player }) => {
            player.preloadManagers = updated
          }
        )
      }

      ;(api as unknown as ImmerStoreApi<AssetStore>).setState(({ asset }) => {
        delete asset.preloadAbortControllers[assetId]
      })
    },
    [api]
  )

  const isPreloaded = useCallback(
    (assetId: string) => {
      return (
        (api.getState() as unknown as PlayerStore).player
          .preloadManagers as Map<string, shaka.media.PreloadManager>
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
  const events = useMediaEvents<
    PlaybackEvents & PlayerEvents & PlaylistEvents
  >()
  useEffect(() => {
    const getHasNext = () => {
      const { getNextIndex, queue, repeatMode } = api.getState().playlist
      return repeatMode === "all" && queue.length > 0
        ? true
        : getNextIndex() !== -1
    }

    const offPlaylistChange = events.on("playlistchange", (event) => {
      const item = event.currentItem
      if (!item) return

      const options = api.getState().asset.installedOptions as
        | undefined
        | UseAssetOptions<Asset>

      options?.onAssetChange?.(event as unknown as PlaylistChangeEvent<Asset>)
      void api.getState().asset.loadAsset(item.properties as unknown as Asset)
    })

    const offPlaybackError = events.on("playbackerror", (payload) => {
      void (async () => {
        const { currentItem } = api.getState().playlist
        const options = api.getState().asset.installedOptions as
          | undefined
          | UseAssetOptions<Asset>
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
            api.setState(({ asset }) => {
              asset.previousError = payload.error
            })
            void api.getState().asset.loadAsset(assetToLoad, startTime)
          } else if (decision.action === "skip" && getHasNext()) {
            api.getState().playlist.next()
          }
        } catch (callbackErr) {
          console.error(
            "[useAsset] onPlaybackError callback failed:",
            callbackErr
          )
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

function getNormalizedAssetId(
  asset: Asset,
  options: undefined | UseAssetOptions<Asset>,
  context: { index?: number; origin: "asset" | "media-props" | "playlist" }
): string {
  const id = asset.id ?? options?.getAssetId?.(asset, context)
  if (id) return id

  if (asset.src) {
    return `lp_src_${hashString(asset.src)}`
  }

  throw new Error(
    `[useAsset] Missing asset id. Provide asset.id, asset.src, or getAssetId for ${context.origin} assets.`
  )
}

function hashString(value: string): string {
  let hash = 0

  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash).toString(36)
}

function mergePlayerConfiguration(
  base?: shaka.extern.PlayerConfiguration,
  override?: shaka.extern.PlayerConfiguration
): shaka.extern.PlayerConfiguration | undefined {
  if (!base) return override
  if (!override) return base

  return {
    ...base,
    ...override,
  }
}

function normalizeAssets(
  assets: Asset[],
  options?: UseAssetOptions<Asset>
): NormalizedAsset[] {
  const usedIds = new Set<string>()

  return assets.map((asset, index) => {
    const id = getNormalizedAssetId(asset, options, {
      index,
      origin: "playlist",
    })

    if (usedIds.has(id)) {
      throw new Error(
        `[useAsset] Duplicate asset id "${id}". Provide explicit ids for duplicate playlist entries.`
      )
    }

    usedIds.add(id)

    return {
      id,
      properties: asset,
    }
  })
}

function normalizePlaybackSource(
  source?: null | PlaybackSource | shaka.media.PreloadManager | string
): NormalizedSource {
  if (typeof source === "string") {
    return { source }
  }

  if (!source) {
    return {}
  }

  if ("src" in source || "config" in source) {
    const playbackSource = source as PlaybackSource

    return {
      config: playbackSource.config,
      source: playbackSource.src,
    }
  }

  return { source: source as shaka.media.PreloadManager }
}

async function resolveSourceValue(
  options: undefined | UseAssetOptions<Asset>,
  context: ResolveSourceContext<Asset>
): Promise<null | PlaybackSource | string | undefined> {
  return options?.resolveSource?.(context)
}

function toError(error: unknown): Error {
  if (error instanceof Error) return error

  if (typeof error === "object" && error !== null) {
    return Object.assign(
      new Error(String((error as { message?: string }).message ?? error)),
      error
    )
  }

  return new Error(String(error))
}
