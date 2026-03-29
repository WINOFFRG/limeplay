"use client"

import type shaka from "shaka-player"

import { useCallback, useEffect, useRef } from "react"

import type { UsePlayerOptions } from "@/registry/default/hooks/use-player"
import type { PlaylistChangeEvent } from "@/registry/default/hooks/use-playlist"
import type { UsePlaylistReturn } from "@/registry/default/hooks/use-playlist"

import { usePlayback } from "@/registry/default/hooks/use-playback"
import {
  isLoadInterrupted,
  usePlayer,
} from "@/registry/default/hooks/use-player"
import { usePlaylist } from "@/registry/default/hooks/use-playlist"
import {
  useGetStore,
  useMediaStore,
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
  /**
   * Custom load/preload strategy.
   * Use this to extend load/preload behavior (e.g. fetch signed URLs, retries)
   * while keeping default autoplay and queue orchestration from use-asset.
   */
  loader?: UseAssetLoader<TAsset>

  /**
   * Max auto-retries before giving up on an asset.
   * @default 0
   */
  maxRetries?: number

  /**
   * Called when the playlist cursor changes (before loading).
   */
  onAssetChange?: (event: PlaylistChangeEvent<TAsset>) => void

  /**
   * Called after an asset is successfully loaded.
   */
  onAssetLoaded?: (asset: TAsset) => void

  /**
   * Called when a playlist item fails to load.
   * Return "skip" to auto-advance, "retry" to retry, or "stop" to halt.
   * @default "skip" if hasNext, otherwise "stop"
   */
  onLoadError?: (
    asset: TAsset,
    error: Error,
    context: { hasNext: boolean; retryCount: number }
  ) => "retry" | "skip" | "stop"

  /**
   * Called when a Shaka playback error occurs mid-stream.
   * Return an action object to determine recovery behavior.
   */
  onPlaybackError?: (
    asset: TAsset,
    error: Error,
    context: { currentTime: number }
  ) => Promise<
    | { action: "reload"; asset?: TAsset; startTime?: number }
    | { action: "skip" }
    | { action: "stop" }
  >

  /**
   * Legacy escape hatch for raw use-player options.
   * Prefer `loader` for custom loading logic to keep opinionated defaults intact.
   * Providing `onLoad`/`onPreload` here replaces the default load/preload steps.
   */
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
> extends UsePlaylistReturn<TAsset> {
  cancelPreload: (assetId: string) => void
  isPreloaded: (assetId: string) => boolean
  loadAsset: (asset: TAsset, startTime?: number) => Promise<boolean>
  loadPlaylist: (assets: TAsset[], startIndex?: number) => void
  preloadAsset: (asset: TAsset) => Promise<void>
  preloadNext: () => Promise<void>
}

export function useAsset<TAsset extends Asset = Asset>(
  options?: UseAssetOptions<TAsset>
): UseAssetReturn<TAsset> {
  const player = useMediaStore((state) => state.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const store = useGetStore()

  const { play } = usePlayback()
  const isFirstLoadRef = useRef(true)
  const retryCountRef = useRef(0)
  const loadGenerationRef = useRef(0)
  const loadAbortControllerRef = useRef<AbortController | null>(null)
  const {
    onError: onPlayerError,
    onLoad,
    onPreload,
    ...playerOptions
  } = options?.playerOptions ?? {}

  const playback = usePlayer<TAsset>({
    onError: (error: Error, asset?: TAsset) => {
      console.error("[useAsset] Playback error:", error, asset?.id)
      onPlayerError?.(error, asset)
      throw error
    },
    onLoad: async (
      asset: TAsset,
      shakaPlayer: shaka.Player,
      media: HTMLMediaElement,
      preloadManager?: shaka.media.PreloadManager,
      startTime?: number
    ) => {
      const defaultLoad = async (
        source?: null | shaka.media.PreloadManager | string,
        customStartTime?: number
      ) => {
        if (asset.config) {
          shakaPlayer.resetConfiguration()
          shakaPlayer.configure(asset.config)
        }

        const resolvedSource =
          source === undefined ? (preloadManager ?? asset.src) : source

        const finalStartTime = customStartTime ?? startTime
        const timeToLoad = finalStartTime ?? undefined

        if (resolvedSource) {
          await shakaPlayer.load(resolvedSource, timeToLoad)
        } else {
          await shakaPlayer.load(asset.src, timeToLoad)
        }
      }

      if (options?.loader?.load) {
        const signal = loadAbortControllerRef.current?.signal
        if (!signal) {
          throw new Error("[useAsset] No AbortSignal available for loader")
        }
        await options.loader.load({
          asset,
          defaultLoad,
          media,
          player: shakaPlayer,
          preloadManager,
          signal,
          startTime,
        })
      } else if (onLoad) {
        await onLoad(asset, shakaPlayer, media, preloadManager, startTime)
      } else {
        await defaultLoad()
      }

      if (
        player &&
        mediaRef.current &&
        mediaRef.current.autoplay &&
        media.paused
      ) {
        if (isFirstLoadRef.current) {
          if (options?.autoplayFirst) {
            await play()
          }
        } else {
          await play()
        }
      }

      isFirstLoadRef.current = false
    },
    onPreload: async (
      asset: TAsset,
      shakaPlayer: shaka.Player
    ): Promise<null | shaka.media.PreloadManager> => {
      const defaultPreload = async (
        source?: string
      ): Promise<null | shaka.media.PreloadManager> => {
        const resolvedSource = source ?? asset.src
        return shakaPlayer.preload(
          resolvedSource,
          undefined,
          undefined,
          asset.config
        )
      }

      if (options?.loader?.preload) {
        return options.loader.preload({
          asset,
          defaultPreload,
          player: shakaPlayer,
        })
      }

      if (onPreload) {
        return onPreload(asset, shakaPlayer)
      }

      return defaultPreload()
    },
    ...playerOptions,
  })

  const playlist = usePlaylist<TAsset>()

  /**
   * Load an asset into the player, handling error recovery.
   */
  const loadAssetIntoPlayer = useCallback(
    async (asset: TAsset, startTime?: number): Promise<boolean> => {
      const generation = ++loadGenerationRef.current

      // Abort any previous in-flight load
      loadAbortControllerRef.current?.abort()
      const abortController = new AbortController()
      loadAbortControllerRef.current = abortController

      if (mediaRef.current) {
        mediaRef.current.pause()
      }

      try {
        const isLoaded = await playback.load(asset, startTime)

        console.log("[useAsset] Asset loaded:", {
          generation,
          loadGenerationRef,
        })

        if (loadGenerationRef.current !== generation) {
          return false
        }

        if (!isLoaded) {
          throw new Error(`[useAsset] Failed to load asset: ${asset.id}`)
        }

        retryCountRef.current = 0
        options?.onAssetLoaded?.(asset)
        return true
      } catch (error) {
        if (
          loadGenerationRef.current !== generation ||
          isLoadInterrupted(error) ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return false
        }

        const err = error instanceof Error ? error : new Error(String(error))
        const maxRetries = options?.maxRetries ?? 0
        const hasNext = playlist.hasNext

        if (options?.onLoadError) {
          const decision = options.onLoadError(asset, err, {
            hasNext,
            retryCount: retryCountRef.current,
          })

          if (decision === "retry" && retryCountRef.current < maxRetries) {
            retryCountRef.current += 1
            return loadAssetIntoPlayer(asset, startTime)
          }

          if (decision === "skip" && hasNext) {
            retryCountRef.current = 0
            playlist.next()
            return false
          }

          retryCountRef.current = 0
          return false
        }

        if (hasNext) {
          retryCountRef.current = 0
          playlist.next()
        }
        return false
      }
    },
    [playback.load, mediaRef, options, playlist.hasNext, playlist.next]
  )

  /**
   * React to playlist cursor changes — load the new asset.
   */
  useEffect(() => {
    store.setState({
      onPlaylistChange: (event: PlaylistChangeEvent) => {
        const item = event.currentItem
        if (!item) return

        const asset = item.properties as TAsset
        options?.onAssetChange?.(event as PlaylistChangeEvent<TAsset>)

        void loadAssetIntoPlayer(asset)
      },
    })
  }, [loadAssetIntoPlayer, store, options?.onAssetChange])

  /**
   * Handle mid-playback errors
   */
  const handlePlaybackError = useCallback(
    async (error: Error) => {
      const currentAsset = playlist.currentItem?.properties as
        | TAsset
        | undefined
      if (!currentAsset) return

      const media = mediaRef.current
      const currentTime = media ? media.currentTime : 0

      if (options?.onPlaybackError) {
        try {
          const decision = await options.onPlaybackError(currentAsset, error, {
            currentTime,
          })

          if (decision.action === "reload") {
            const assetToLoad = decision.asset ?? currentAsset
            const startTime = decision.startTime ?? currentTime
            void loadAssetIntoPlayer(assetToLoad, startTime)
          } else if (decision.action === "skip") {
            if (playlist.hasNext) {
              playlist.next()
            }
          }
        } catch (callbackErr) {
          console.error(
            "[useAsset] onPlaybackError callback failed:",
            callbackErr
          )
        }
      }
    },
    [options, playlist, mediaRef, loadAssetIntoPlayer]
  )

  useEffect(() => {
    store.setState({
      onPlaybackError: (error: Error) => {
        void handlePlaybackError(error)
      },
    })
  }, [handlePlaybackError, store])

  /**
   * Auto-advance to next item when current one ends.
   */
  const onItemEnded = useCallback(() => {
    if (playlist.hasNext) {
      playlist.next()
    }
  }, [playlist.hasNext, playlist.next])

  useEffect(() => {
    store.setState({
      onEnded: onItemEnded,
    })
  }, [onItemEnded, store])

  /**
   * Load a playlist of assets
   */
  const loadPlaylist = useCallback(
    (assets: TAsset[], startIndex = 0) => {
      isFirstLoadRef.current = true
      const items = assets.map((asset) => ({
        id: asset.id,
        properties: asset,
      }))

      playlist.load(items, startIndex)
    },
    [playlist.load]
  )

  /**
   * Load a single asset directly (bypasses playlist)
   */
  const loadAsset = useCallback(
    async (asset: TAsset, startTime?: number) => {
      isFirstLoadRef.current = true
      return playback.load(asset, startTime)
    },
    [playback.load]
  )

  /**
   * Preload the next asset in the queue
   */
  const preloadNext = useCallback(async () => {
    const nextItem = playlist.nextItem
    if (nextItem) {
      await playback.preload(nextItem.properties)
    }
  }, [playlist.nextItem, playback.preload])

  const preloadAsset = useCallback(
    async (asset: TAsset) => {
      return playback.preload(asset)
    },
    [playback.preload]
  )

  return {
    ...playlist,
    cancelPreload: playback.cancelPreload,
    isPreloaded: playback.isPreloaded,
    loadAsset,
    loadPlaylist,
    preloadAsset,
    preloadNext,
  }
}
