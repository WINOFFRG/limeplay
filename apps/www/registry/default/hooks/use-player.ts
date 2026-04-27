"use client"

import React, { useRef } from "react"
import shaka from "shaka-player"

import type { PlaybackStore } from "@/registry/default/hooks/use-playback"
import type {
  MediaEventSlice,
  MediaFeature,
} from "@/registry/default/ui/media-provider"

import { useMediaStore } from "@/registry/default/hooks/use-media"
import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useMediaEvents,
  useMediaFeatureApi,
  useMediaFeatureStore,
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

export const PLAYER_FEATURE_KEY = "player"

export interface PlayerEvents {
  bufferingchange: { isBuffering: boolean }
  playbackerror: { error: Error }
  playererror: { error: Error }
  playerready: { player: shaka.Player }
}

export interface PlayerStore extends MediaEventSlice<PlayerEvents> {
  [PLAYER_FEATURE_KEY]: {
    containerRef: HTMLDivElement | null
    instance: null | shaka.Player
    preloadManagers: Map<string, shaka.media.PreloadManager>
    setContainerRef: (instance: HTMLDivElement | null) => void
    setInstance: (player: null | shaka.Player) => void
  }
}

export interface UsePlayerOptions<TAsset> {
  onError: (error: Error, asset?: TAsset) => void
  onLoad: (
    asset: TAsset,
    player: shaka.Player,
    media: HTMLMediaElement,
    preloadManager?: shaka.media.PreloadManager,
    startTime?: number
  ) => Promise<void>
  onPreload?: (
    asset: TAsset,
    player: shaka.Player
  ) => Promise<null | shaka.media.PreloadManager>
}

export const RECOMMENDED_PLAYER_BUFFERING_THROTTLE_MS = 250

export function isLoadInterrupted(error: unknown): boolean {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: number }).code === shaka.util.Error.Code.LOAD_INTERRUPTED
  ) {
    return true
  }

  return false
}

export function playerFeature(): MediaFeature<PlayerStore> {
  return {
    createSlice: (_set, _get, _store) => ({
      [PLAYER_FEATURE_KEY]: {
        containerRef: null,
        instance: null,
        preloadManagers: new Map(),
        setContainerRef: (instance) => {
          _set(({ player }) => {
            player.containerRef = instance
          })
        },
        setInstance: (instance) => {
          _set(({ player }) => {
            player.instance = instance
          })
        },
      },
    }),
    key: PLAYER_FEATURE_KEY,
    Setup: PlayerSetup,
  }
}

/**
 * Low-level player hook for manual load/preload control.
 * Prefer `useAsset` for most use cases — it handles retry logic,
 * playlist integration, abort/generation tracking, and preload lifecycle.
 * Using both `usePlayer.load` and `useAsset.loadAsset` on the same
 * content will cause split state in `preloadManagers` and retry counters.
 */
export function usePlayer<TAsset extends { id: string }>(
  options?: UsePlayerOptions<TAsset>
) {
  const store = useMediaFeatureApi<PlayerStore>(PLAYER_FEATURE_KEY)
  const player = usePlayerStore((state) => state.instance)
  const mediaElement = useMediaStore((state) => state.mediaElement)

  const load = React.useCallback(
    async (asset: TAsset, startTime?: number): Promise<boolean> => {
      if (!options) return false

      const currentPlayer = store.getState().player.instance
      const currentMedia = store.getState().media.mediaElement

      if (!currentPlayer || !currentMedia) {
        console.warn("[usePlayer] Player or media element not initialized")
        return false
      }

      try {
        const preloadManagers = store.getState().player.preloadManagers
        const preloadManager = preloadManagers.get(asset.id)

        if (preloadManager) {
          await options.onLoad(
            asset,
            currentPlayer,
            currentMedia,
            preloadManager,
            startTime
          )
          preloadManagers.delete(asset.id)
          store.setState(({ player }) => {
            player.preloadManagers = new Map(preloadManagers)
          })
        } else {
          await options.onLoad(
            asset,
            currentPlayer,
            currentMedia,
            undefined,
            startTime
          )
        }

        return true
      } catch (error) {
        if (isLoadInterrupted(error)) {
          return false
        }

        const err = error instanceof Error ? error : new Error(String(error))
        options.onError(err, asset)
        return false
      }
    },
    [mediaElement, options, store]
  )

  const preload = React.useCallback(
    async (asset: TAsset): Promise<void> => {
      if (!options?.onPreload) return

      const currentPlayer = store.getState().player.instance
      if (!currentPlayer) return

      try {
        const manager = await options.onPreload(asset, currentPlayer)
        if (manager) {
          const preloadManagers = store.getState().player.preloadManagers
          preloadManagers.set(asset.id, manager)
          store.setState(({ player }) => {
            player.preloadManagers = new Map(preloadManagers)
          })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        options.onError(err, asset)
        console.error("[usePlayer] Preload error:", error)
      }
    },
    [options, store]
  )

  const cancelPreload = React.useCallback(
    (assetId: string): void => {
      const preloadManagers = store.getState().player.preloadManagers
      const manager = preloadManagers.get(assetId)
      if (manager) {
        manager.destroy()
        preloadManagers.delete(assetId)
        store.setState(({ player }) => {
          player.preloadManagers = new Map(preloadManagers)
        })
      }
    },
    [store]
  )

  const isPreloaded = React.useCallback(
    (assetId: string): boolean => {
      return store.getState().player.preloadManagers.has(assetId)
    },
    [store]
  )

  return {
    cancelPreload,
    isPreloaded,
    load,
    player,
    preload,
  }
}

export function usePlayerStore<TSelected>(
  selector: (state: PlayerStore["player"]) => TSelected
): TSelected {
  return useMediaFeatureStore<PlayerStore, TSelected>(
    PLAYER_FEATURE_KEY,
    (state) => selector(state.player)
  )
}

function PlayerSetup() {
  const store = useMediaFeatureApi<PlaybackStore & PlayerStore>(
    PLAYER_FEATURE_KEY
  )
  const events = useMediaEvents<PlayerEvents>()
  const setPlayer = usePlayerStore((state) => state.setInstance)
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const debug = useMediaStore((state) => state.debug)
  const player = usePlayerStore((state) => state.instance)

  const playerInstance = useRef<null | shaka.Player>(null)

  React.useLayoutEffect(() => {
    let aborted = false

    async function loadPlayer() {
      const shakaLib = (
        debug
          ? await import("shaka-player/dist/shaka-player.compiled.debug")
          : await import("shaka-player")
      ).default

      if (!mediaElement || aborted) {
        return
      }

      const localPlayer = new shakaLib.Player() as shaka.Player

      try {
        await localPlayer.attach(mediaElement)

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mutated by cleanup closure during await
        if (aborted) {
          void localPlayer.destroy().catch(noop)
          return
        }

        setPlayer(localPlayer)
        playerInstance.current = localPlayer

        mediaElement.player = playerInstance.current
        window.shaka = shakaLib as unknown as Window["shaka"]

        events.emit("playerready", { player: localPlayer })
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mutated by cleanup closure during await
        if (aborted) {
          void localPlayer.destroy().catch(noop)
          return
        }

        const err = error instanceof Error ? error : new Error(String(error))
        console.error(
          "[usePlayer] Failed to attach player to media element:",
          err
        )

        events.emit("playererror", { error: err })
      }
    }

    if (!playerInstance.current) {
      void loadPlayer()
    }

    return () => {
      aborted = true
      if (playerInstance.current) {
        void playerInstance.current.destroy().catch(noop)
        setPlayer(null)
        playerInstance.current = null
      }
    }
  }, [debug, mediaElement, setPlayer, events])

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
        store.setState(({ playback }) => {
          playback.status = "buffering"
        })
      }
    }

    const bufferingHandler = () => {
      const isBuffering = player.isBuffering()

      if (isBuffering) {
        store.setState(({ playback }) => {
          playback.status = "buffering"
        })
      } else {
        clearBufferingTimeout()
        const media = store.getState().media.mediaElement
        if (media) {
          store.setState(({ playback }) => {
            playback.status = media.paused ? "paused" : "playing"
          })
        }
      }

      events.emit("bufferingchange", { isBuffering })
    }

    const loadingHandler = () => {
      store.setState(({ playback }) => {
        playback.status = "loading"
      })
    }

    on(player, "buffering", bufferingHandler)
    on(player, "loading", loadingHandler)

    const errorHandler = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail && !isLoadInterrupted(detail)) {
        store.setState(({ playback }) => {
          playback.status = "error"
        })
        const err =
          detail instanceof Error
            ? detail
            : new Error(String(detail?.message ?? detail))
        events.emit("playbackerror", { error: err })
      }
    }

    player.addEventListener("error", errorHandler)

    setInitialState()

    return () => {
      off(player, "buffering", bufferingHandler)
      off(player, "loading", loadingHandler)
      player.removeEventListener("error", errorHandler)
      clearBufferingTimeout()
    }
  }, [mediaElement, player, store])

  return null
}
