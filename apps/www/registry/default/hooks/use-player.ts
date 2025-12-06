import type shaka from "shaka-player"
import type { StateCreator } from "zustand"

import React from "react"

import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export type MediaStatus =
  | "buffering"
  | "canplay"
  | "canplaythrough"
  | "ended"
  | "error"
  | "init"
  | "loading"
  | "paused"
  | "playing"
  | "stopped"

export const MediaReadyState = {
  HAVE_CURRENT_DATA: 2,
  HAVE_ENOUGH_DATA: 4,
  HAVE_FUTURE_DATA: 3,
  HAVE_METADATA: 1,
  HAVE_NOTHING: 0,
} as const

export type MediaReadyState =
  (typeof MediaReadyState)[keyof typeof MediaReadyState]

export interface PlayerStore {
  canPlay: boolean
  canPlayThrough: boolean
  debug: boolean
  ended: boolean
  error: MediaError | null
  forceIdle: boolean
  idle: boolean
  loop: boolean
  mediaRef: React.RefObject<HTMLMediaElement | null>
  networkState: number
  // Media State Store
  paused: boolean
  player: null | shaka.Player
  playerContainerRef: HTMLDivElement | null
  readyState: MediaReadyState
  setDebug: (value: boolean) => void
  setForceIdle: (value: boolean) => void
  setIdle: (idle: boolean) => void
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) => void
  setPlayer: (player: null | shaka.Player) => void
  setPlayerContainerRef: (instance: HTMLDivElement | null) => void
  status: MediaStatus
}

export const createPlayerStore: StateCreator<
  PlayerStore,
  [],
  [],
  PlayerStore
> = (set) => ({
  canPlay: false,
  canPlayThrough: false,
  debug: false,
  ended: false,
  error: null,
  forceIdle: false,
  idle: false,
  loop: false,
  mediaRef: React.createRef<HTMLMediaElement>(),
  networkState: 0,
  paused: false,
  player: null,
  playerContainerRef: null,
  readyState: MediaReadyState.HAVE_NOTHING,
  setDebug: (value) => set({ debug: value }),
  setForceIdle: (value) => set({ forceIdle: value }),
  setIdle: (idle: boolean) => set({ idle }),
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) =>
    set({ mediaRef }),
  setPlayer: (player: null | shaka.Player) => set({ player }),
  setPlayerContainerRef: (instance) => set({ playerContainerRef: instance }),
  status: "init",
})

export function usePlayer() {
  const store = useGetStore()

  function play() {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.play().catch((error: unknown) => {
      console.error("Error playing media", error)
      store.setState({
        idle: false,
        status: "error",
      })
    })

    store.setState({
      idle: false,
    })
  }

  function pause() {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.pause()

    store.setState({
      idle: false,
    })
  }

  function togglePaused() {
    const media = store.getState().mediaRef.current
    if (!media) return

    if (media.paused) {
      play()
    } else {
      pause()
    }
  }

  function setLoop(loop: boolean) {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.loop = loop

    store.setState({
      idle: false,
    })
  }

  function toggleLoop() {
    const media = store.getState().mediaRef.current
    if (!media) return

    setLoop(!media.loop)
  }

  function restart() {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.currentTime = 0
    if (media.paused) {
      play()
    }

    store.setState({
      ended: false,
      idle: false,
    })
  }

  return {
    pause,
    play,
    restart,
    setLoop,
    toggleLoop,
    togglePaused,
  }
}

export function usePlayerStates() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const player = useMediaStore((state) => state.player)

  React.useEffect(() => {
    if (!mediaRef.current) return noop

    const media = mediaRef.current

    const setInitialState = () => {
      const isBuffering = player?.isBuffering()
      const status: MediaStatus = isBuffering
        ? "buffering"
        : media.paused
          ? "paused"
          : "playing"

      store.setState({
        canPlay: media.readyState >= MediaReadyState.HAVE_FUTURE_DATA,
        canPlayThrough: media.readyState >= MediaReadyState.HAVE_ENOUGH_DATA,
        ended: media.ended,
        error: media.error,
        loop: media.loop,
        networkState: media.networkState,
        paused: media.paused,
        readyState: media.readyState as MediaReadyState,
        status,
      })
    }

    // Playback event handlers
    const pauseHandler = () => {
      store.setState({
        paused: true,
        status: "paused",
      })
    }

    const playHandler = () => {
      store.setState({
        paused: false,
        status: "playing",
      })
    }

    const playingHandler = () => {
      store.setState({
        paused: false,
        status: "playing",
      })
    }

    const endedHandler = () => {
      // DEV: When looping, ended event should be ignored to prevent UI showing ended state
      if (media.loop) {
        return
      }
      store.setState({
        ended: true,
        status: "ended",
      })
    }

    // Loading event handlers
    const loadStartHandler = () => {
      store.setState({
        error: null,
        status: "loading",
      })
    }

    const loadedMetadataHandler = () => {
      store.setState({
        ended: false,
        readyState: media.readyState as MediaReadyState,
      })
    }

    const loadedDataHandler = () => {
      store.setState({
        canPlay: media.readyState >= MediaReadyState.HAVE_FUTURE_DATA,
        ended: false,
        readyState: media.readyState as MediaReadyState,
      })
    }

    const canPlayHandler = () => {
      store.setState({
        canPlay: true,
        readyState: media.readyState as MediaReadyState,
        status: media.paused ? "paused" : "playing",
      })
    }

    const canPlayThroughHandler = () => {
      store.setState({
        canPlay: true,
        canPlayThrough: true,
        readyState: media.readyState as MediaReadyState,
        status: media.paused ? "paused" : "playing",
      })
    }

    const readyStateChangeHandler = () => {
      const readyState = media.readyState as MediaReadyState

      store.setState({
        canPlay: readyState >= MediaReadyState.HAVE_FUTURE_DATA,
        canPlayThrough: readyState >= MediaReadyState.HAVE_ENOUGH_DATA,
        readyState,
      })
    }

    const waitingHandler = () => {
      store.setState({ status: "buffering" })
    }

    const stalledHandler = () => {
      store.setState({ status: "buffering" })
    }

    const errorHandler = () => {
      store.setState({
        error: media.error,
        status: "error",
      })
    }

    const loopChangeHandler = () => {
      store.setState({
        loop: media.loop,
      })
    }

    on(media, "loadstart", loadStartHandler)
    on(media, "loadedmetadata", loadedMetadataHandler)
    on(media, "loadeddata", loadedDataHandler)
    on(media, "canplay", canPlayHandler)
    on(media, "canplaythrough", canPlayThroughHandler)
    on(media, "readystatechange", readyStateChangeHandler)
    on(media, "play", playHandler)
    on(media, "playing", playingHandler)
    on(media, "pause", pauseHandler)
    on(media, "ended", endedHandler)
    on(media, "waiting", waitingHandler)
    on(media, "stalled", stalledHandler)
    on(media, "error", errorHandler)
    on(media, "loopchange", loopChangeHandler)

    setInitialState()

    return () => {
      off(media, "loadstart", loadStartHandler)
      off(media, "loadedmetadata", loadedMetadataHandler)
      off(media, "loadeddata", loadedDataHandler)
      off(media, "canplay", canPlayHandler)
      off(media, "canplaythrough", canPlayThroughHandler)
      off(media, "readystatechange", readyStateChangeHandler)
      off(media, "play", playHandler)
      off(media, "playing", playingHandler)
      off(media, "pause", pauseHandler)
      off(media, "ended", endedHandler)
      off(media, "waiting", waitingHandler)
      off(media, "stalled", stalledHandler)
      off(media, "error", errorHandler)
      off(media, "loopchange", loopChangeHandler)
    }
  }, [store, mediaRef, player])

  React.useEffect(() => {
    if (!player) return noop

    const bufferingHandler = () => {
      const isBuffering = player.isBuffering()

      if (isBuffering) {
        store.setState({ status: "buffering" })
      } else {
        const media = mediaRef.current
        if (media) {
          const status = media.paused ? "paused" : "playing"
          store.setState({ status })
        }
      }
    }

    const loadingHandler = () => {
      store.setState({ status: "loading" })
    }

    player.addEventListener("buffering", bufferingHandler)
    player.addEventListener("loading", loadingHandler)

    return () => {
      player.removeEventListener("buffering", bufferingHandler)
      player.removeEventListener("loading", loadingHandler)
    }
  }, [player, mediaRef, store])
}
