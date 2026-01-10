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

export interface PlaybackStore {
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
  // Event callbacks
  onBuffering?: (payload: { isBuffering: boolean }) => void
  onEnded?: () => void
  onPause?: () => void

  onPlay?: () => void
  onStatusChange?: (payload: {
    prevStatus: MediaStatus
    status: MediaStatus
  }) => void
  paused: boolean
  readyState: MediaReadyState
  setDebug: (value: boolean) => void

  setForceIdle: (value: boolean) => void
  setIdle: (idle: boolean) => void
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) => void
  status: MediaStatus
}

export const createPlaybackStore: StateCreator<
  PlaybackStore,
  [],
  [],
  PlaybackStore
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
  onBuffering: undefined,
  onEnded: undefined,
  onPause: undefined,
  onPlay: undefined,
  onStatusChange: undefined,
  paused: false,
  readyState: MediaReadyState.HAVE_NOTHING,

  setDebug: (value) => set({ debug: value }),
  setForceIdle: (value) => set({ forceIdle: value }),
  setIdle: (idle: boolean) => set({ idle }),
  setMediaRef: (mediaRef: React.RefObject<HTMLMediaElement>) =>
    set({ mediaRef }),
  status: "init",
})

export interface UsePlaybackReturn {
  pause: () => void
  play: () => void
  restart: () => void
  setLoop: (loop: boolean) => void
  toggleLoop: () => void
  togglePaused: () => void
}

export function usePlayback(): UsePlaybackReturn {
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

export function usePlaybackStates() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)

  React.useEffect(() => {
    if (!mediaRef.current) return noop

    const media = mediaRef.current

    const setInitialState = () => {
      const status: MediaStatus = media.paused ? "paused" : "playing"

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
      const prevStatus = store.getState().status
      store.setState({
        paused: true,
        status: "paused",
      })

      store.getState().onPause?.()
      store.getState().onStatusChange?.({ prevStatus, status: "paused" })
    }

    const playHandler = () => {
      const prevStatus = store.getState().status
      store.setState({
        paused: false,
        status: "playing",
      })

      store.getState().onPlay?.()
      store.getState().onStatusChange?.({ prevStatus, status: "playing" })
    }

    const playingHandler = () => {
      const prevStatus = store.getState().status
      store.setState({
        paused: false,
        status: "playing",
      })

      store.getState().onStatusChange?.({ prevStatus, status: "playing" })
    }

    const endedHandler = () => {
      // DEV: When looping, ended event should be ignored to prevent UI showing ended state
      if (media.loop) {
        return
      }
      const prevStatus = store.getState().status
      store.setState({
        ended: true,
        status: "ended",
      })

      store.getState().onEnded?.()
      store.getState().onStatusChange?.({ prevStatus, status: "ended" })
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
      const prevStatus = store.getState().status
      store.setState({ status: "buffering" })

      store.getState().onBuffering?.({ isBuffering: true })
      store.getState().onStatusChange?.({ prevStatus, status: "buffering" })
    }

    const stalledHandler = () => {
      const prevStatus = store.getState().status
      store.setState({ status: "buffering" })

      store.getState().onBuffering?.({ isBuffering: true })
      store.getState().onStatusChange?.({ prevStatus, status: "buffering" })
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
  }, [store, mediaRef])
}
