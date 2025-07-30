import React from "react"
import type { StateCreator } from "zustand"

import type { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { noop, off, on } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export function useMediaStates() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const player = useMediaStore((state) => state.player)

  React.useEffect(() => {
    if (!mediaRef.current) return noop

    const media = mediaRef.current

    // DEV: Handle more cases like player destroyed
    const setInitialState = () => {
      const isBuffering = player?.isBuffering()

      store.setState({
        paused: media.paused,
        status: isBuffering ? "buffering" : media.paused ? "paused" : "playing",
      })
    }

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

    const endedHandler = () => {
      // DEV: Whenever in looping ended would never happen, so prevent UI from showing ended state
      if (media.loop) {
        return
      }
      store.setState({
        ended: true,
        status: "ended",
      })
    }

    const loadedDataHandler = () => {
      store.setState({
        ended: false,
      })
    }

    const loopChangeHandler = () => {
      store.setState({
        loop: media.loop,
      })
    }

    on(media, "pause", pauseHandler)
    on(media, "play", playHandler)
    on(media, "ended", endedHandler)
    on(media, "loadeddata", loadedDataHandler)
    on(media, "loopchange", loopChangeHandler)

    setInitialState()

    return () => {
      off(media, "pause", pauseHandler)
      off(media, "play", playHandler)
      off(media, "ended", endedHandler)
      off(media, "loadeddata", loadedDataHandler)
      off(media, "loopchange", loopChangeHandler)
    }
  }, [store, mediaRef, player])

  // Handle buffering states
  React.useEffect(() => {
    if (!mediaRef.current) return noop

    const media = mediaRef.current

    const bufferingHandler = () => {
      if (player?.isBuffering()) {
        store.setState({ status: "buffering" })
      } else {
        const isPlaying = media.paused
        store.setState({ status: isPlaying ? "paused" : "playing" })
      }
    }

    const waitingHandler = () => {
      store.setState({ status: "buffering" })
    }

    const onPlayingHandler = () => {
      store.setState({ status: "playing" })
    }

    on(media, "waiting", waitingHandler)
    on(media, "playing", onPlayingHandler)

    if (player) {
      player.addEventListener("buffering", bufferingHandler)
      player.addEventListener("loading", bufferingHandler)
    }

    return () => {
      off(media, "waiting", waitingHandler)
      off(media, "playing", onPlayingHandler)

      if (player) {
        player.removeEventListener("buffering", bufferingHandler)
        player.removeEventListener("loading", bufferingHandler)
      }
    }
  }, [store, mediaRef, player])
}

export interface MediaStateStore {
  paused: boolean
  ended: boolean
  loop: boolean
}

export const createMediaStateStore: StateCreator<
  MediaStateStore & PlayerRootStore,
  [],
  [],
  MediaStateStore
> = () => ({
  paused: false,
  ended: false,
  loop: false,
})

export function useMediaState() {
  const store = useGetStore()

  function play() {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.play().catch((error: unknown) => {
      console.error("Error playing media", error)
      store.setState({
        status: "error",
        idle: false,
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

  function seek(time: number) {
    const media = store.getState().mediaRef.current
    if (!media) return

    media.currentTime = time

    store.setState({
      idle: false,
    })
  }

  return {
    play,
    pause,
    togglePaused,
    setLoop,
    toggleLoop,
    seek,
  }
}
