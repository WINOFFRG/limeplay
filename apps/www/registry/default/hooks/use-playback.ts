import React from "react"

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

export const PLAYBACK_FEATURE_KEY = "playback"

export interface PlaybackEvents {
  buffering: { isBuffering: boolean }
  ended: void
  pause: void
  play: void
  statuschange: { prevStatus: MediaStatus; status: MediaStatus }
}

export interface PlaybackStore extends MediaEventSlice<PlaybackEvents> {
  [PLAYBACK_FEATURE_KEY]: {
    canPlay: boolean
    canPlayThrough: boolean
    ended: boolean
    error: MediaError | null
    loop: boolean
    networkState: number
    pause: () => void
    paused: boolean
    play: () => Promise<void>
    readyState: MediaReadyState
    restart: () => void
    setLoop: (loop: boolean) => void
    status: MediaStatus
    toggleLoop: () => void
    togglePaused: () => Promise<void>
  }
}

export function playbackFeature(): MediaFeature<PlaybackStore> {
  return {
    createSlice: (set, get) => ({
      [PLAYBACK_FEATURE_KEY]: {
        canPlay: false,
        canPlayThrough: false,
        ended: false,
        error: null,
        loop: false,
        networkState: 0,
        pause: () => {
          const media = get().media.mediaElement
          if (!media) return

          media.pause()

          set(({ media: mediaState }) => {
            mediaState.idle = false
          })
        },
        paused: false,
        play: async () => {
          const media = get().media.mediaElement
          if (!media) return

          set(({ media: mediaState }) => {
            mediaState.idle = false
          })

          try {
            await media.play()
          } catch (error: unknown) {
            console.error("Error playing media", error)
            set(({ media: mediaState, playback }) => {
              playback.status = "error"
              mediaState.idle = false
            })
            throw error
          }
        },
        readyState: MediaReadyState.HAVE_NOTHING,
        restart: () => {
          const media = get().media.mediaElement
          if (!media) return

          media.currentTime = 0
          if (media.paused) {
            void get().playback.play().catch(noop)
          }

          set(({ media: mediaState, playback }) => {
            mediaState.idle = false
            playback.ended = false
          })
        },
        setLoop: (loop) => {
          const media = get().media.mediaElement
          if (!media) return

          media.loop = loop

          set(({ media: mediaState, playback }) => {
            mediaState.idle = false
            playback.loop = loop
          })
        },
        status: "init",
        toggleLoop: () => {
          const media = get().media.mediaElement
          if (!media) return

          get().playback.setLoop(!media.loop)
        },
        togglePaused: async () => {
          const media = get().media.mediaElement
          if (!media) return

          if (media.paused) {
            await get().playback.play().catch(noop)
          } else {
            get().playback.pause()
          }
        },
      },
    }),
    key: PLAYBACK_FEATURE_KEY,
    Setup: PlaybackSetup,
  }
}

export function usePlaybackStore<TSelected>(
  selector: (state: PlaybackStore["playback"]) => TSelected
): TSelected {
  return useMediaFeatureStore<PlaybackStore, TSelected>(
    PLAYBACK_FEATURE_KEY,
    (state) => selector(state.playback)
  )
}

function PlaybackSetup() {
  const store = useMediaFeatureApi<PlaybackStore>(PLAYBACK_FEATURE_KEY)
  const events = useMediaEvents<PlaybackEvents>()
  const mediaElement = useMediaStore((state) => state.mediaElement)

  React.useEffect(() => {
    if (!mediaElement) return noop

    const media = mediaElement

    const setInitialState = () => {
      const status: MediaStatus = media.paused ? "paused" : "playing"

      store.setState(({ playback }) => {
        playback.canPlay = media.readyState >= MediaReadyState.HAVE_FUTURE_DATA
        playback.canPlayThrough = media.readyState >= MediaReadyState.HAVE_ENOUGH_DATA
        playback.ended = media.ended
        playback.error = media.error
        playback.loop = media.loop
        playback.networkState = media.networkState
        playback.paused = media.paused
        playback.readyState = media.readyState as MediaReadyState
        playback.status = status
      })
    }

    const pauseHandler = () => {
      const prevStatus = store.getState().playback.status

      store.setState(({ playback }) => {
        playback.paused = true
        playback.status = "paused"
      })

      if (prevStatus === "buffering") {
        events.emit("buffering", { isBuffering: false })
      }

      events.emit("pause")
      events.emit("statuschange", { prevStatus, status: "paused" })
    }

    const playHandler = () => {
      const prevStatus = store.getState().playback.status

      store.setState(({ playback }) => {
        playback.paused = false
        playback.status = "playing"
      })

      events.emit("play")
      events.emit("statuschange", { prevStatus, status: "playing" })
    }

    const playingHandler = () => {
      const prevStatus = store.getState().playback.status

      store.setState(({ playback }) => {
        playback.paused = false
        playback.status = "playing"
      })

      if (prevStatus === "buffering") {
        events.emit("buffering", { isBuffering: false })
      }

      events.emit("statuschange", { prevStatus, status: "playing" })
    }

    const endedHandler = () => {
      if (media.loop) {
        return
      }

      const prevStatus = store.getState().playback.status

      store.setState(({ playback }) => {
        playback.ended = true
        playback.status = "ended"
      })

      if (prevStatus === "buffering") {
        events.emit("buffering", { isBuffering: false })
      }

      events.emit("ended")
      events.emit("statuschange", { prevStatus, status: "ended" })
    }

    const loadStartHandler = () => {
      store.setState(({ playback }) => {
        playback.error = null
        playback.status = "loading"
      })
    }

    const loadedMetadataHandler = () => {
      store.setState(({ playback }) => {
        playback.ended = false
        playback.readyState = media.readyState as MediaReadyState
      })
    }

    const loadedDataHandler = () => {
      store.setState(({ playback }) => {
        playback.canPlay = media.readyState >= MediaReadyState.HAVE_FUTURE_DATA
        playback.ended = false
        playback.readyState = media.readyState as MediaReadyState
      })
    }

    const canPlayHandler = () => {
      store.setState(({ playback }) => {
        playback.canPlay = true
        playback.readyState = media.readyState as MediaReadyState
        playback.status = media.paused ? "paused" : "playing"
      })
    }

    const canPlayThroughHandler = () => {
      store.setState(({ playback }) => {
        playback.canPlay = true
        playback.canPlayThrough = true
        playback.readyState = media.readyState as MediaReadyState
        playback.status = media.paused ? "paused" : "playing"
      })
    }

    const waitingHandler = () => {
      const prevStatus = store.getState().playback.status

      store.setState(({ playback }) => {
        playback.status = "buffering"
      })

      events.emit("buffering", { isBuffering: true })
      events.emit("statuschange", { prevStatus, status: "buffering" })
    }

    const stalledHandler = () => {
      const prevStatus = store.getState().playback.status

      store.setState(({ playback }) => {
        playback.status = "buffering"
      })

      events.emit("buffering", { isBuffering: true })
      events.emit("statuschange", { prevStatus, status: "buffering" })
    }

    const errorHandler = () => {
      store.setState(({ playback }) => {
        playback.error = media.error
        playback.status = "error"
      })
    }

    on(media, "loadstart", loadStartHandler)
    on(media, "loadedmetadata", loadedMetadataHandler)
    on(media, "loadeddata", loadedDataHandler)
    on(media, "canplay", canPlayHandler)
    on(media, "canplaythrough", canPlayThroughHandler)
    on(media, "play", playHandler)
    on(media, "playing", playingHandler)
    on(media, "pause", pauseHandler)
    on(media, "ended", endedHandler)
    on(media, "waiting", waitingHandler)
    on(media, "stalled", stalledHandler)
    on(media, "error", errorHandler)

    setInitialState()

    return () => {
      off(media, "loadstart", loadStartHandler)
      off(media, "loadedmetadata", loadedMetadataHandler)
      off(media, "loadeddata", loadedDataHandler)
      off(media, "canplay", canPlayHandler)
      off(media, "canplaythrough", canPlayThroughHandler)
      off(media, "play", playHandler)
      off(media, "playing", playingHandler)
      off(media, "pause", pauseHandler)
      off(media, "ended", endedHandler)
      off(media, "waiting", waitingHandler)
      off(media, "stalled", stalledHandler)
      off(media, "error", errorHandler)
    }
  }, [events, store, mediaElement])

  return null
}
