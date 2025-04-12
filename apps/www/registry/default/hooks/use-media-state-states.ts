import React from "react"

import { noop, off, on } from "@/registry/default/lib/utils"
import { useMediaStore } from "@/registry/default/ui/media-provider"

/**
 * Hooks doesnt return anything to prevent you from
 * using the hook again to access the states. Rather
 * always ask the store for the states you need.
 */
export function useMediaStates() {
  const status = useMediaStore((state) => state.status)
  const setStatus = useMediaStore((state) => state.setStatus)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const loop = useMediaStore((state) => state.loop)
  const player = useMediaStore((state) => state.player)

  React.useEffect(() => {
    const mediaElement = mediaRef?.current
    if (!mediaElement) return

    if (!mediaElement.paused && (status === "paused" || status === "stopped")) {
      mediaElement.pause()
    } else if (status === "playing" && mediaElement.paused) {
      mediaElement.play().catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Error playing media", error)
        setStatus("error")
      })
    }
  }, [status, mediaRef])

  React.useEffect(() => {
    const mediaElement = mediaRef?.current
    if (!mediaElement) return

    if (loop) {
      mediaElement.loop = true
    } else {
      mediaElement.loop = false
    }
  }, [loop, mediaRef])

  React.useEffect(() => {
    const mediaElement = mediaRef?.current
    if (!mediaElement) return noop

    const pauseHandler = () => setStatus("paused")
    const playHandler = () => setStatus("playing")
    const endedHandler = () => {
      // DEV: Whenever in looping ended would never happen, so prevent UI from showing ended state
      if (mediaElement?.loop) {
        return
      }
      setStatus("ended")
    }

    on(mediaElement, "pause", pauseHandler)
    on(mediaElement, "play", playHandler)
    on(mediaElement, "ended", endedHandler)

    return () => {
      off(mediaElement, "pause", pauseHandler)
      off(mediaElement, "play", playHandler)
      off(mediaElement, "ended", endedHandler)
    }
  }, [mediaRef])

  // FIXME: In shaka buffering is also triggered when buffering has ended, so
  // we need to check if we need to update the status manually, because it also
  // automatically starts playing the content
  React.useEffect(() => {
    const bufferingHandler = () => {
      console.log("Shaka Buffering", player?.isBuffering())

      if (player?.isBuffering() && status !== "error") {
        setStatus("buffering")
      } else {
        setStatus("playing")
      }
    }

    const waitingHandler = () => {
      console.log("Native Waiting")
      // setStatus('buffering');
    }

    const onPlayingHandler = () => {
      console.log("Native Playing")
      // setStatus('playing');
    }

    if (mediaRef?.current) {
      on(mediaRef.current, "waiting", waitingHandler)
      on(mediaRef.current, "playing", onPlayingHandler)
    }

    if (player) {
      player.addEventListener("buffering", bufferingHandler)
      player.addEventListener("loading", bufferingHandler)
    }

    return () => {
      if (mediaRef?.current) {
        off(mediaRef.current, "waiting", waitingHandler)
        off(mediaRef.current, "playing", onPlayingHandler)
      }

      if (player) {
        player.removeEventListener("buffering", bufferingHandler)
        player.removeEventListener("loading", bufferingHandler)
      }
    }
  }, [status, player])
}
