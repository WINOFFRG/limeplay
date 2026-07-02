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
} from "@/registry/default/hooks/use-player"
import type {
  PlaylistChangeEvent,
  PlaylistEvents,
  PlaylistStore,
} from "@/registry/default/hooks/use-playlist"
import type {
  ImmerStoreApi,
  MediaEventSlice,
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

/** Context passed to a custom asset load handler. */
export interface AssetLoadContext<TItem extends TAsset = TAsset> {
  /** Asset being loaded. */
  asset: TItem
  /** Run Limeplay's default Shaka load behavior. */
  loadDefault: (
    source?: null | PlaybackSource | shaka.media.PreloadManager | string,
    options?: number | { startTime?: number }
  ) => Promise<void>
  /** Active media element. */
  media: HTMLMediaElement
  /** Active Shaka Player instance. */
  player: shaka.Player
  /** Existing preload manager for this asset, when available. */
  preloadManager?: shaka.media.PreloadManager
  /** Previous load or playback error for retry-aware loaders. */
  previousError?: unknown
  /** Number of retry attempts for the active load session. */
  retryCount: number
  /** Abort signal for the active load session. */
  signal: AbortSignal
  /** Requested playback start time in seconds. */
  startTime?: number
}

/** Context passed to a custom asset preload handler. */
export interface AssetPreloadContext<TItem extends TAsset = TAsset> {
  /** Asset being preloaded. */
  asset: TItem
  /** Active Shaka Player instance. */
  player: shaka.Player
  /** Run Limeplay's default Shaka preload behavior. */
  preloadDefault: (
    source?: PlaybackSource | string
  ) => Promise<null | shaka.media.PreloadManager>
  /** Previous load or preload error for retry-aware loaders. */
  previousError?: unknown
  /** Number of retry attempts for the active session. */
  retryCount: number
  /** Abort signal for the active preload request. */
  signal: AbortSignal
}

/** Source shape currently controlled by the asset feature. */
export const AssetSourceType = {
  Asset: "asset",
  Playlist: "playlist",
} as const

export type AssetSourceType =
  (typeof AssetSourceType)[keyof typeof AssetSourceType]

/** Origin used when deriving or normalizing asset IDs. */
export const AssetSourceOrigin = {
  Asset: "asset",
  MediaProps: "media-props",
  Playlist: "playlist",
} as const

export type AssetSourceOrigin =
  (typeof AssetSourceOrigin)[keyof typeof AssetSourceOrigin]

/** Recovery actions returned by load and playback recovery policies. */
export const AssetRecoveryAction = {
  Reload: "reload",
  Retry: "retry",
  Skip: "skip",
  Stop: "stop",
} as const

/** Asset lifecycle events emitted through `useMediaEvents`. */
export interface AssetEvents {
  /** Emitted when the active playlist asset changes. */
  assetchange: PlaylistChangeEvent<TAsset>
  /** Emitted after an asset loads successfully. */
  assetloaded: { asset: TAsset }
  /** Emitted when asset loading fails. */
  assetloaderror: { asset: TAsset; error: Error }
  /** Emitted before asset loading starts. */
  assetloadstart: { asset: TAsset; sourceType: AssetSourceType | null }
  /** Emitted after an asset preloads successfully. */
  assetpreloaded: { asset: TAsset }
  /** Emitted when asset preloading fails. */
  assetpreloaderror: { asset: TAsset; error: Error }
  /** Emitted before asset preloading starts. */
  assetpreloadstart: { asset: TAsset }
}

/** Decision returned from load-error recovery. */
export type AssetLoadDecision =
  | typeof AssetRecoveryAction.Retry
  | typeof AssetRecoveryAction.Skip
  | typeof AssetRecoveryAction.Stop

/** Options for loading a source into the asset feature. */
export interface AssetLoadSourceOptions<TItem extends TAsset> {
  /** Initial playlist index when the source is an array. */
  initialIndex?: number
  /** Session-local loading configuration. */
  loading?: UseAssetOptions<TItem>
  /** Stable key used by source controllers to identify equivalent sources. */
  sourceKey?: string
  /** Explicit source type override for UI and recovery behavior. */
  sourceType?: AssetSourceType
}

/** Decision returned from playback-error recovery. */
export type AssetPlaybackRecoveryDecision<TItem extends TAsset> =
  | {
      action: typeof AssetRecoveryAction.Reload
      asset?: TItem
      startTime?: number
    }
  | { action: typeof AssetRecoveryAction.Skip }
  | { action: typeof AssetRecoveryAction.Stop }

export type AssetRecoveryAction =
  (typeof AssetRecoveryAction)[keyof typeof AssetRecoveryAction]

/** Active source loading session. */
export interface AssetSession<TItem extends TAsset = TAsset> {
  /** Unique session ID generated for each explicit load. */
  id: string
  /** Loading configuration attached to this session. */
  loading?: UseAssetOptions<TItem>
  /** Stable source key, when provided by the caller. */
  sourceKey?: string
  /** Source type for this session. */
  sourceType: AssetSourceType
}

/** Returns a stable ID for an asset when `asset.id` is not enough. */
export type GetAssetId<TItem extends TAsset = TAsset> = (
  asset: TItem,
  context: {
    index?: number
    origin: AssetSourceOrigin
  }
) => null | string | undefined

/** Asset normalized for playlist storage. */
export interface NormalizedAsset<TItem extends TAsset = TAsset> {
  /** Stable playlist item ID. */
  id: string
  /** Original asset object. */
  properties: TItem
}

/** Resolved playback source passed to Shaka Player. */
export interface PlaybackSource {
  /** Shaka Player configuration applied before loading. */
  config?: shaka.extern.PlayerConfiguration
  /** Playback URL. */
  src?: string
}

/** Public source input accepted by blocks and `loadSource`. */
export type PlayerSource<TItem extends TAsset = TAsset> =
  | readonly TItem[]
  | string
  | TItem

/** Lazily resolves a playable source for an asset. */
export type ResolveSource<TItem extends TAsset = TAsset> = (
  context: ResolveSourceContext<TItem>
) => MaybePromise<null | PlaybackSource | string | undefined>

/** Context passed to `resolveSource`. */
export interface ResolveSourceContext<TItem extends TAsset = TAsset> {
  /** Asset whose source should be resolved. */
  asset: TItem
  /** Previous error for retry-aware resolution. */
  previousError?: unknown
  /** Number of retry attempts in the active session. */
  retryCount: number
  /** Abort signal for the active load or preload request. */
  signal: AbortSignal
  /** Requested playback start time in seconds. */
  startTime?: number
}

/** Minimal playback configuration for one playable media item. */
export interface TAsset {
  /** Shaka Player configuration applied before this asset loads. */
  config?: shaka.extern.PlayerConfiguration
  /** Stable identifier used for playlist, preload, and recovery state. */
  id?: string
  /** Direct playback URL. Use `resolveSource` when this is resolved lazily. */
  src?: string
}

/** Store actions exposed by the asset feature. */
export interface UseAssetActions {
  /** Current source loading session. */
  activeSession: AssetSession | null
  /** Load a single asset immediately. */
  loadAsset: (asset: TAsset, startTime?: number) => Promise<boolean>
  /** Load assets into the playlist and start from `startIndex`. */
  loadPlaylist: (
    assets: TAsset[],
    startIndex?: number,
    sourceType?: AssetSourceType,
    options?: Omit<
      AssetLoadSourceOptions<TAsset>,
      "initialIndex" | "sourceType"
    >
  ) => void
  /** Normalize and load a URL, asset, or asset array. */
  loadSource: (
    source: PlayerSource<TAsset>,
    options?: AssetLoadSourceOptions<TAsset>
  ) => void
  /** Preload one asset for faster future playback. */
  preloadAsset: (asset: TAsset) => Promise<void>
  /** Preload the next playlist item, when one exists. */
  preloadNext: () => Promise<void>
}

/** Alias for custom load handler context. */
export type UseAssetLoadContext<TItem extends TAsset> = AssetLoadContext<TItem>

/** Custom loader hooks for replacing or extending default Shaka behavior. */
export interface UseAssetLoader<TItem extends TAsset> {
  /** Custom load implementation. Call `context.loadDefault()` to reuse defaults. */
  load?: (context: AssetLoadContext<TItem>) => Promise<void>
  /** Custom preload implementation. Call `context.preloadDefault()` to reuse defaults. */
  preload?: (
    context: AssetPreloadContext<TItem>
  ) => Promise<null | shaka.media.PreloadManager>
}

/** Session-local loading options for asset source loading. */
export interface UseAssetOptions<TItem extends TAsset> {
  /** Allow autoplay on the first loaded asset when the media element requests autoplay. */
  autoplayFirst?: boolean
  /** Resolve a stable asset ID when `asset.id` is missing or insufficient. */
  getAssetId?: GetAssetId<TItem>
  /** Custom load and preload handlers. */
  loader?: UseAssetLoader<TItem>
  /** Maximum retry attempts used by `recover.loadError`. */
  maxRetries?: number
  /** Recovery policies for load and playback errors. */
  recover?: {
    /** Decide whether to retry, skip, or stop after a load error. */
    loadError?: (
      asset: TItem,
      error: unknown,
      context: { hasNext: boolean; retryCount: number }
    ) => AssetLoadDecision
    /** Decide whether to reload, skip, or stop after a playback error. */
    playbackError?: (
      asset: TItem,
      error: Error,
      context: { currentTime: number }
    ) => Promise<AssetPlaybackRecoveryDecision<TItem>>
  }
  /** Lazily resolve the playback URL or source config for an asset. */
  resolveSource?: ResolveSource<TItem>
}

/** Alias for custom preload handler context. */
export type UseAssetPreloadContext<TItem extends TAsset> =
  AssetPreloadContext<TItem>

/** Values and actions returned by `useAsset`. */
export interface UseAssetReturn<TItem extends TAsset> {
  /** Cancel an active preload by asset ID. */
  cancelPreload: (assetId: string) => void
  /** Current playlist index. */
  currentIndex: number
  /** Current playlist item. */
  currentItem: null | { id: string; properties: TItem }
  /** Return a playlist item by ID. */
  getItem: (id: string) => null | { id: string; properties: TItem }
  /** Whether a next playlist item is available. */
  hasNext: boolean
  /** Whether a previous playlist item is available. */
  hasPrevious: boolean
  /** Check whether an asset has a stored Shaka preload manager. */
  isPreloaded: (assetId: string) => boolean
  /** Load one asset immediately. */
  loadAsset: (asset: TItem, startTime?: number) => Promise<boolean>
  /** Load a playlist and start from `startIndex`. */
  loadPlaylist: (
    assets: TItem[],
    startIndex?: number,
    sourceType?: AssetSourceType,
    options?: Omit<AssetLoadSourceOptions<TItem>, "initialIndex" | "sourceType">
  ) => void
  /** Load a URL string, one asset, or an asset array. */
  loadSource: (
    source: PlayerSource<TItem>,
    options?: AssetLoadSourceOptions<TItem>
  ) => void
  /** Next playlist item, when available. */
  nextItem: null | { id: string; properties: TItem }
  /** Playlist items in playback order. */
  orderedItems: { id: string; properties: TItem }[]
  /** Preload one asset for faster future playback. */
  preloadAsset: (asset: TItem) => Promise<void>
  /** Preload the next playlist item, when one exists. */
  preloadNext: () => Promise<void>
  /** Previous playlist item, when available. */
  previousItem: null | { id: string; properties: TItem }
  /** Current source mode, or `null` before a source is loaded. */
  sourceType: AssetSourceType | null
}

/** Internal state owned by the asset feature. */
export interface UseAssetState {
  /** Current source loading session. */
  activeSession: AssetSession | null
  /** Whether the current session has not completed its first load. */
  isFirstLoad: boolean
  /** Abort controller for the active load. */
  loadAbortController: AbortController | null
  /** Monotonic generation used to ignore stale loads. */
  loadGeneration: number
  /** Most recent load or playback error. */
  previousError: unknown
  /** Retry count for the active session. */
  retryCount: number
  /** Current source mode, or `null` before a source is loaded. */
  sourceType: AssetSourceType | null
}

export const ASSET_FEATURE_KEY = "asset"

/** Store slice installed by `assetFeature`. */
export interface AssetStore extends MediaEventSlice<AssetEvents> {
  [ASSET_FEATURE_KEY]: {
    activeSession: AssetSession | null
    isFirstLoad: boolean
    loadAbortController: AbortController | null
    loadAsset: (
      asset: TAsset,
      startTime?: number,
      sourceType?: AssetSourceType
    ) => Promise<boolean>
    loadGeneration: number
    loadPlaylist: (
      assets: TAsset[],
      startIndex?: number,
      sourceType?: AssetSourceType,
      options?: Omit<
        AssetLoadSourceOptions<TAsset>,
        "initialIndex" | "sourceType"
      >
    ) => void
    loadSource: (
      source: PlayerSource<TAsset>,
      options?: AssetLoadSourceOptions<TAsset>
    ) => void
    preloadAbortControllers: Record<string, AbortController | undefined>
    preloadAsset: (asset: TAsset) => Promise<void>
    preloadNext: () => Promise<void>
    previousError: unknown
    retryCount: number
    setSourceType: (sourceType: AssetSourceType | null) => void
    sourceType: AssetSourceType | null
  }
}

type AssetSetupStore = AssetStore & PlaybackStore & PlayerStore & PlaylistStore

type MaybePromise<T> = Promise<T> | T

type NormalizedSource = {
  config?: shaka.extern.PlayerConfiguration
  source?: null | shaka.media.PreloadManager | string
}

/**
 * Adds source loading, playlist-backed playback, preloading, and recovery
 * orchestration to a media kit.
 */
export function assetFeature(): MediaFeature<
  AssetStore,
  AssetStore & MediaStore & PlaybackStore & PlayerStore & PlaylistStore
> {
  return {
    createSlice: (set, get, _store, events) => ({
      [ASSET_FEATURE_KEY]: {
        activeSession: null,
        isFirstLoad: true,
        loadAbortController: null,
        loadAsset: async (asset, startTime, sourceType) => {
          const player = get().player.instance as null | shaka.Player
          const media = get().media.mediaElement
          const session = get().asset.activeSession
          const options = session?.loading as
            | undefined
            | UseAssetOptions<TAsset>

          if (sourceType) {
            set(({ asset }) => {
              asset.sourceType = sourceType
            })
          }

          if (!player || !media) {
            return false
          }

          const assetId = getNormalizedAssetId(asset, options, {
            origin: AssetSourceOrigin.Asset,
          })

          const generation = get().asset.loadGeneration + 1
          get().asset.loadAbortController?.abort()

          const abortController = new AbortController()

          set(({ asset }) => {
            asset.loadAbortController = abortController
            asset.loadGeneration = generation
          })

          get().playback.pause()
          set(({ playback }) => {
            playback.error = null
            playback.status = "loading"
          })
          events.emit("assetloadstart", {
            asset,
            sourceType: sourceType ?? get().asset.sourceType,
          })

          try {
            const preloadManagers = get().player.preloadManagers as Map<
              string,
              shaka.media.PreloadManager
            >
            const preloadManager = preloadManagers.get(assetId)
            const retryCount = get().asset.retryCount
            const previousError = get().asset.previousError ?? undefined

            const loadDefault = createDefaultLoad({
              asset,
              assetId,
              player,
              preloadManager,
              startTime,
            })

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

            events.emit("assetloaded", { asset })
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
            events.emit("assetloaderror", { asset, error: normalizedError })
            const playlist = get().playlist
            const maxRetries = options?.maxRetries ?? 0
            const currentRetryCount = get().asset.retryCount
            const hasNext = playlist.getNextIndex() !== -1

            set(({ asset }) => {
              asset.previousError = error
            })

            if (options?.recover?.loadError) {
              const decision = options.recover.loadError(asset, error, {
                hasNext,
                retryCount: currentRetryCount,
              })

              if (
                decision === AssetRecoveryAction.Retry &&
                currentRetryCount < maxRetries
              ) {
                set(({ asset }) => {
                  asset.retryCount = currentRetryCount + 1
                })
                return get().asset.loadAsset(asset, startTime, sourceType)
              }

              if (
                (decision === AssetRecoveryAction.Skip ||
                  (decision === AssetRecoveryAction.Retry &&
                    currentRetryCount >= maxRetries)) &&
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
              get().playback.setError(normalizedError)
              return false
            }

            if (hasNext) {
              set(({ asset }) => {
                asset.previousError = null
                asset.retryCount = 0
              })
              playlist.next()
            } else {
              get().playback.setError(normalizedError)
            }
            return false
          }
        },
        loadGeneration: 0,
        loadPlaylist: (assets, startIndex = 0, sourceType, options) => {
          const resolvedSourceType = sourceType ?? AssetSourceType.Playlist
          const activeSession = createAssetSession(resolvedSourceType, options)
          const normalizedAssets = normalizeAssets(
            assets,
            activeSession.loading
          )

          set(({ asset }) => {
            asset.activeSession = activeSession
            asset.isFirstLoad = true
            asset.previousError = null
            asset.retryCount = 0
            asset.sourceType = resolvedSourceType
          })

          get().playlist.load(normalizedAssets, startIndex)
        },
        loadSource: (source, options) => {
          const assets = normalizePlayerSource(source)
          const sourceType =
            options?.sourceType ??
            (Array.isArray(source)
              ? AssetSourceType.Playlist
              : (getSourceTypeForItems(assets) ?? AssetSourceType.Asset))

          get().asset.loadPlaylist(
            assets,
            options?.initialIndex,
            sourceType,
            options
          )
        },
        preloadAbortControllers: {},
        preloadAsset: async (asset) => {
          const player = get().player.instance as null | shaka.Player
          const session = get().asset.activeSession
          const options = session?.loading as
            | undefined
            | UseAssetOptions<TAsset>
          if (!player) return

          const assetId = getNormalizedAssetId(asset, options, {
            origin: AssetSourceOrigin.Asset,
          })
          get().asset.preloadAbortControllers[assetId]?.abort()
          const abortController = new AbortController()

          set(({ asset }) => {
            asset.preloadAbortControllers[assetId] = abortController
          })
          events.emit("assetpreloadstart", { asset })

          const isCurrentPreload = () => {
            return (
              get().asset.preloadAbortControllers[assetId] ===
                abortController && !abortController.signal.aborted
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
              events.emit("assetpreloaded", { asset })
            }
          } catch (error) {
            if (
              abortController.signal.aborted ||
              (error instanceof DOMException && error.name === "AbortError")
            ) {
              return
            }

            const err = toError(error)
            events.emit("assetpreloaderror", { asset, error: err })
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
              nextItem.properties as unknown as TAsset
            )
          }
        },
        previousError: null,
        retryCount: 0,
        setSourceType: (sourceType) => {
          set(({ asset }) => {
            asset.sourceType = sourceType
          })
        },
        sourceType: null,
      },
    }),
    key: ASSET_FEATURE_KEY,
    Setup: AssetSetup,
  }
}

/**
 * Access asset loading state and actions for the current `MediaProvider`.
 *
 * `useAsset()` is optionless. Pass loading configuration to `loadSource`,
 * `loadPlaylist`, or a block's `loading` prop so configuration is scoped to
 * the active source session.
 */
export function useAsset<
  TItem extends TAsset = TAsset,
>(): UseAssetReturn<TItem> {
  const api = useMediaFeatureApi<AssetStore>(ASSET_FEATURE_KEY)
  const playlist = usePlaylist<TItem>()
  const loadAssetAction = useAssetStore((state) => state.loadAsset) as (
    asset: TItem,
    startTime?: number,
    sourceType?: AssetSourceType
  ) => Promise<boolean>
  const loadPlaylist = useAssetStore((state) => state.loadPlaylist) as (
    assets: TItem[],
    startIndex?: number,
    sourceType?: AssetSourceType,
    options?: Omit<AssetLoadSourceOptions<TItem>, "initialIndex" | "sourceType">
  ) => void
  const loadSourceAction = useAssetStore((state) => state.loadSource) as (
    source: PlayerSource<TItem>,
    options?: AssetLoadSourceOptions<TItem>
  ) => void
  const preloadAsset = useAssetStore((state) => state.preloadAsset) as (
    asset: TItem
  ) => Promise<void>
  const preloadNext = useAssetStore((state) => state.preloadNext)
  const sourceType = useAssetStore((state) => state.sourceType)

  const loadAsset = useCallback<UseAssetReturn<TItem>["loadAsset"]>(
    (asset, startTime) =>
      loadAssetAction(asset, startTime, sourceType ?? AssetSourceType.Asset),
    [loadAssetAction, sourceType]
  )

  const loadSource = useCallback<UseAssetReturn<TItem>["loadSource"]>(
    (source, options) => loadSourceAction(source, options),
    [loadSourceAction]
  )

  const cancelPreload = useCallback(
    (assetId: string) => {
      const preloadAbortController =
        api.getState().asset.preloadAbortControllers[assetId]
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
    cancelPreload,
    currentIndex: playlist.currentIndex,
    currentItem: playlist.currentItem,
    getItem: playlist.getItem,
    hasNext: playlist.hasNext,
    hasPrevious: playlist.hasPrevious,
    isPreloaded,
    loadAsset,
    loadPlaylist,
    loadSource,
    nextItem: playlist.nextItem,
    orderedItems: playlist.orderedItems,
    preloadAsset,
    preloadNext,
    previousItem: playlist.previousItem,
    sourceType,
  }
}

/** Subscribe to a field from the asset feature store slice. */
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
    AssetEvents & PlaybackEvents & PlayerEvents & PlaylistEvents
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
      events.emit("assetchange", event as PlaylistChangeEvent<TAsset>)
      void api
        .getState()
        .asset.loadAsset(
          item.properties as unknown as TAsset,
          undefined,
          api.getState().asset.sourceType ?? AssetSourceType.Playlist
        )
    })

    const offPlaybackError = events.on("playbackerror", (payload) => {
      void (async () => {
        const state = api.getState()
        const { currentItem } = state.playlist
        const sessionId = state.asset.activeSession?.id
        const options = state.asset.activeSession?.loading as
          | undefined
          | UseAssetOptions<TAsset>
        if (!currentItem) return
        const currentItemId = currentItem.id

        const getFreshCurrentItem = () => {
          const freshState = api.getState()
          if (freshState.asset.activeSession?.id !== sessionId) return null
          if (freshState.playlist.currentItem?.id !== currentItemId) return null

          return freshState.playlist.currentItem
        }

        const mediaElement = api.getState().media.mediaElement
        try {
          const currentTime =
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            payload.currentTime ?? mediaElement?.currentTime ?? 0
          const decision = options?.recover?.playbackError
            ? await options.recover.playbackError(
                currentItem.properties as unknown as TAsset,
                payload.error,
                { currentTime }
              )
            : {
                action: AssetRecoveryAction.Reload,
              }
          const freshCurrentItem = getFreshCurrentItem()
          if (!freshCurrentItem) return

          if (decision.action === AssetRecoveryAction.Reload) {
            const assetToLoad = (decision.asset ??
              freshCurrentItem.properties) as unknown as TAsset
            const startTime = decision.startTime ?? currentTime
            api.setState(({ asset }) => {
              asset.previousError = payload.error
            })
            await api
              .getState()
              .asset.loadAsset(
                assetToLoad,
                startTime,
                api.getState().asset.sourceType ?? AssetSourceType.Asset
              )
          } else if (
            decision.action === AssetRecoveryAction.Skip &&
            getHasNext()
          ) {
            api.getState().playlist.next()
          }
        } catch (callbackErr) {
          console.error(
            "[useAsset] recover.playbackError callback failed:",
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
function createAssetSession(
  sourceType: AssetSourceType,
  options?: Omit<AssetLoadSourceOptions<TAsset>, "initialIndex" | "sourceType">
): AssetSession {
  return {
    id: generateAssetSessionId(),
    loading: options?.loading,
    sourceKey: options?.sourceKey,
    sourceType,
  }
}

function createDefaultLoad({
  asset,
  assetId,
  player,
  preloadManager,
  startTime,
}: {
  asset: TAsset
  assetId: string
  player: shaka.Player
  preloadManager?: shaka.media.PreloadManager
  startTime?: number
}): AssetLoadContext["loadDefault"] {
  return async (source, loadOptions) => {
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
}

function generateAssetSessionId(): string {
  return `lp_asset_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function getNormalizedAssetId(
  asset: TAsset,
  options: undefined | UseAssetOptions<TAsset>,
  context: { index?: number; origin: AssetSourceOrigin }
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

function getSourceTypeForItems<T>(
  items: T[],
  sourceType?: AssetSourceType
): AssetSourceType | null {
  return (
    sourceType ??
    (items.length === 0
      ? null
      : items.length > 1
        ? AssetSourceType.Playlist
        : AssetSourceType.Asset)
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
  assets: TAsset[],
  options?: UseAssetOptions<TAsset>
): NormalizedAsset[] {
  const usedIds = new Set<string>()

  return assets.map((asset, index) => {
    const id = getNormalizedAssetId(asset, options, {
      index,
      origin: AssetSourceOrigin.Playlist,
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

function normalizePlayerSource(source: PlayerSource<TAsset>): TAsset[] {
  if (Array.isArray(source)) return [...source]
  if (typeof source === "string") return [{ src: source }]
  return [source as TAsset]
}

async function resolveSourceValue(
  options: undefined | UseAssetOptions<TAsset>,
  context: ResolveSourceContext<TAsset>
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
