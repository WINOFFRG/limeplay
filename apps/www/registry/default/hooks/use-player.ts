"use client"

import type shaka from "shaka-player"
import type { StateCreator } from "zustand"

import React, { useRef } from "react"

import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

declare global {
  interface HTMLMediaElement {
    player: null | shaka.Player
  }
  interface Window {
    shaka: {
      Player: typeof shaka.Player
    }
  }
}

/**
 * Playback store state - unopinionated, uses generics
 */
export interface PlayerStore {
  onBufferingChange?: (payload: { isBuffering: boolean }) => void
  onError?: (payload: { error: Error }) => void
  onPlayerReady?: (payload: { player: shaka.Player }) => void

  player: null | shaka.Player
  playerContainerRef: HTMLDivElement | null
  preloadManagers: Map<string, shaka.media.PreloadManager>

  setPlayer: (player: null | shaka.Player) => void
  setPlayerContainerRef: (instance: HTMLDivElement | null) => void
}

export const createPlayerStore: StateCreator<
  PlayerStore,
  [],
  [],
  PlayerStore
> = (set) => ({
  onBufferingChange: undefined,
  onError: undefined,
  onPlayerReady: undefined,

  player: null,
  playerContainerRef: null,
  preloadManagers: new Map(),

  setPlayer: (player: null | shaka.Player) => set({ player }),
  setPlayerContainerRef: (instance) => set({ playerContainerRef: instance }),
})

/**
 * Options for usePlayer hook
 */
export interface UsePlayerOptions<TAsset> {
  /**
   * Error handler - required
   */
  onError: (error: Error, asset?: TAsset) => void
  /**
   * Load implementation - required, user controls player.load/configure
   */
  onLoad: (
    asset: TAsset,
    player: shaka.Player,
    media: HTMLMediaElement,
    preloadManager?: shaka.media.PreloadManager
  ) => Promise<void>
  /**
   * Preload implementation - required if using preload
   */
  onPreload?: (
    asset: TAsset,
    player: shaka.Player
  ) => Promise<null | shaka.media.PreloadManager>
}

export interface UsePlayerReturn<TAsset> {
  cancelPreload: (assetId: string) => void
  isPreloaded: (assetId: string) => boolean
  load: (asset: TAsset) => Promise<boolean>
  player: null | shaka.Player
  preload: (asset: TAsset) => Promise<void>
}

export const RECOMMENDED_PLAYER_BUFFERING_THROTTLE_MS = 250

export interface UsePlayerStatesOptions {
  /**
   * Delay buffering UI/status updates to reduce flicker during seek bursts.
   * - `true`: use RECOMMENDED_PLAYER_BUFFERING_THROTTLE_MS
   * - `number`: use custom delay in ms
   * - `undefined`/`false`: no throttle
   */
  throttleBuffering?: boolean | number
}

export function usePlayer<TAsset extends { id: string }>(
  options?: UsePlayerOptions<TAsset>
): UsePlayerReturn<TAsset> {
  const store = useGetStore()

  /**
   * Load an asset
   */
  const load = React.useCallback(
    async (asset: TAsset): Promise<boolean> => {
      if (!options) return false

      const currentPlayer = store.getState().player
      const currentMedia = store.getState().mediaRef.current

      if (!currentPlayer || !currentMedia) {
        console.warn("[usePlayer] Player or media element not initialized")
        return false
      }

      try {
        await currentPlayer.unload()

        const preloadManagers = store.getState().preloadManagers
        const preloadManager = preloadManagers.get(asset.id)

        if (preloadManager) {
          await options.onLoad(asset, currentPlayer, currentMedia, preloadManager)
          preloadManagers.delete(asset.id)
          store.setState({ preloadManagers: new Map(preloadManagers) })
        } else {
          await options.onLoad(asset, currentPlayer, currentMedia)
        }

        return true
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        options.onError(err, asset)
        return false
      }
    },
    [store, options]
  )

  /**
   * Preload an asset for faster playback later
   */
  const preload = React.useCallback(
    async (asset: TAsset): Promise<void> => {
      if (!options || !options.onPreload) return

      const currentPlayer = store.getState().player
      if (!currentPlayer) return

      try {
        const manager = await options.onPreload(asset, currentPlayer)
        if (manager) {
          const preloadManagers = store.getState().preloadManagers
          preloadManagers.set(asset.id, manager)
          store.setState({ preloadManagers: new Map(preloadManagers) })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        options.onError(err, asset)
        console.error("[usePlayer] Preload error:", error)
      }
    },
    [store, options]
  )

  /**
   * Cancel a pending preload
   */
  const cancelPreload = React.useCallback(
    (assetId: string): void => {
      const preloadManagers = store.getState().preloadManagers
      const manager = preloadManagers.get(assetId)
      if (manager) {
        manager.destroy()
        preloadManagers.delete(assetId)
        store.setState({ preloadManagers: new Map(preloadManagers) })
      }
    },
    [store]
  )

  /**
   * Check if an asset is preloaded
   */
  const isPreloaded = React.useCallback(
    (assetId: string): boolean => {
      return store.getState().preloadManagers.has(assetId)
    },
    [store]
  )

  const player = useMediaStore((s) => s.player)

  return {
    cancelPreload,
    isPreloaded,
    load,
    player,
    preload,
  }
}
export function usePlayerStates(options?: UsePlayerStatesOptions) {
  const store = useGetStore()
  const setPlayer = useMediaStore((state) => state.setPlayer)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const debug = useMediaStore((state) => state.debug)
  const player = useMediaStore((state) => state.player)
  const bufferingThrottleMs = resolveBufferingThrottleMs(
    options?.throttleBuffering
  )

  const playerInstance = useRef<null | shaka.Player>(null)

  React.useLayoutEffect(() => {
    const mediaElement = mediaRef.current

    async function loadPlayer() {
      const shakaLib = (
        debug
          ? await import("shaka-player/dist/shaka-player.compiled.debug")
          : await import("shaka-player")
      ).default

      if (!mediaElement) {
        return
      }

      const localPlayer = new shakaLib.Player() as shaka.Player
      setPlayer(localPlayer)
      playerInstance.current = localPlayer

      try {
        await localPlayer.attach(mediaElement)

        mediaElement.player = playerInstance.current
        window.shaka = shakaLib as unknown as Window["shaka"]

        store.getState().onPlayerReady?.({ player: localPlayer })
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        console.error(
          "[usePlayer] Failed to attach player to media element:",
          err
        )

        store.getState().onError?.({ error: err })
      }
    }

    if (!playerInstance.current) {
      void loadPlayer()
    }

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy()
        setPlayer(null)
        playerInstance.current = null
      }
    }
  }, [mediaRef, debug])

  React.useEffect(() => {
    if (!player) return noop
    let bufferingTimeout: null | ReturnType<typeof setTimeout> = null

    const clearBufferingTimeout = () => {
      if (bufferingTimeout) {
        clearTimeout(bufferingTimeout)
        bufferingTimeout = null
      }
    }

    const setInitialState = () => {
      if (player.isBuffering()) {
        store.setState({ status: "buffering" })
      }
    }

    const bufferingHandler = () => {
      const isBuffering = player.isBuffering()

      if (isBuffering) {
        if (bufferingThrottleMs === undefined) {
          store.setState({ status: "buffering" })
        } else {
          clearBufferingTimeout()
          bufferingTimeout = setTimeout(() => {
            if (player.isBuffering() && store.getState().status !== "error") {
              store.setState({ status: "buffering" })
            }
            bufferingTimeout = null
          }, bufferingThrottleMs)
        }
      } else {
        clearBufferingTimeout()
        const media = mediaRef.current
        if (media) {
          const status = media.paused ? "paused" : "playing"
          store.setState({ status })
        }
      }

      store.getState().onBufferingChange?.({ isBuffering })
    }

    const loadingHandler = () => {
      store.setState({ status: "loading" })
    }

    on(player, "buffering", bufferingHandler)
    on(player, "loading", loadingHandler)

    setInitialState()

    return () => {
      off(player, "buffering", bufferingHandler)
      off(player, "loading", loadingHandler)
      clearBufferingTimeout()
    }
  }, [player, mediaRef, store, bufferingThrottleMs])
}

function resolveBufferingThrottleMs(
  value?: boolean | number
): number | undefined {
  if (value === undefined || value === false) {
    return undefined
  }

  if (value === true) {
    return RECOMMENDED_PLAYER_BUFFERING_THROTTLE_MS
  }

  if (Number.isFinite(value) && value > 0) {
    return value
  }

  return undefined
}
