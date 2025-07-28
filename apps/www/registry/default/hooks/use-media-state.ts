import React from "react"
import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { noop, off, on } from "@/registry/default/lib/utils"
import { useGetStore } from "@/registry/default/ui/media-provider"

export function useMediaStates() {
  const store = useGetStore()

  React.useEffect(() => {
    const mediaElement = store.getState().mediaRef?.current

    if (!mediaElement) return noop

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
      if (mediaElement?.loop) {
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
        loop: mediaElement.loop,
      })
    }

    on(mediaElement, "pause", pauseHandler)
    on(mediaElement, "play", playHandler)
    on(mediaElement, "ended", endedHandler)
    on(mediaElement, "loadeddata", loadedDataHandler)
    on(mediaElement, "loopchange", loopChangeHandler)

    return () => {
      off(mediaElement, "pause", pauseHandler)
      off(mediaElement, "play", playHandler)
      off(mediaElement, "ended", endedHandler)
      off(mediaElement, "loadeddata", loadedDataHandler)
      off(mediaElement, "loopchange", loopChangeHandler)
    }
  }, [store])

  // Handle buffering states
  React.useEffect(() => {
    const mediaElement = store.getState().mediaRef?.current
    const player = store.getState().player

    const bufferingHandler = () => {
      if (player?.isBuffering()) {
        store.setState({ status: "buffering" })
      } else {
        store.setState({ status: "playing" })
      }
    }

    const waitingHandler = () => {
      store.setState({ status: "buffering" })
    }

    const onPlayingHandler = () => {
      store.setState({ status: "playing" })
    }

    if (mediaElement) {
      on(mediaElement, "waiting", waitingHandler)
      on(mediaElement, "playing", onPlayingHandler)
    }

    if (player) {
      player.addEventListener("buffering", bufferingHandler)
      player.addEventListener("loading", bufferingHandler)
    }

    return () => {
      if (mediaElement) {
        off(mediaElement, "waiting", waitingHandler)
        off(mediaElement, "playing", onPlayingHandler)
      }

      if (player) {
        player.removeEventListener("buffering", bufferingHandler)
        player.removeEventListener("loading", bufferingHandler)
      }
    }
  }, [store])
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

    media.play().catch((error) => {
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
