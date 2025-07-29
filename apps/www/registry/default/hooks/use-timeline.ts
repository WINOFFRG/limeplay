import React, { useCallback } from "react"
import clamp from "lodash.clamp"
import type { StateCreator } from "zustand"

import type { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { noop, off, on, toFixedNumber } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface TimelineStore {
  duration: number
  currentTime: number
  progress: number
  hoveringTime: number
  isHovering: boolean
  buffered: shaka.extern.BufferedRange[]
  isLive: boolean
}

export const createTimelineStore: StateCreator<
  TimelineStore & PlayerRootStore,
  [],
  [],
  TimelineStore
> = () => ({
  duration: 0,
  currentTime: 0,
  progress: 0,
  hoveringTime: 0,
  isHovering: false,
  buffered: [],
  isLive: false,
})

export function useTimelineStates() {
  const store = useGetStore()
  const player = useMediaStore((s) => s.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)

  const onTimeUpdate = () => {
    if (!mediaRef.current) return

    const { duration, currentTime } = mediaRef.current
    const progress = toFixedNumber(currentTime / duration, 4)

    store.setState({ currentTime, progress: progress || 0 })
  }

  const onDurationChange = React.useCallback(() => {
    if (!mediaRef.current) return

    const { duration } = mediaRef.current
    if (duration && Number.isFinite(duration)) {
      store.setState({ duration })
    }
  }, [store, mediaRef])

  const onBuffer = React.useCallback(() => {
    if (!player) return

    const bufferedInfo = player.getBufferedInfo()

    if (player.isBuffering() && bufferedInfo.total.length === 0) {
      return
    }

    store.setState({ buffered: bufferedInfo.total })
  }, [store, player])

  React.useEffect(() => {
    if (!mediaRef.current || !player) return noop

    const media = mediaRef.current

    if (media.readyState >= 1) {
      onTimeUpdate()
      onDurationChange()
      onBuffer()
    }

    on(media, "timeupdate", onTimeUpdate)
    on(media, ["durationchange", "loadedmetadata"], onDurationChange)
    on(media, "progress", onBuffer)
    on(player, "trackschanged", onBuffer)

    return () => {
      off(media, "timeupdate", onTimeUpdate)
      off(media, ["durationchange", "loadedmetadata"], onDurationChange)
      off(media, "progress", onBuffer)
      off(player, "trackschanged", onBuffer)
    }
  }, [mediaRef, player])
}

export function useTimeline() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const duration = useMediaStore((state) => state.duration)

  const getTimeFromEvent = useCallback(
    (event: React.PointerEvent) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const percentage = (event.clientX - rect.left) / rect.width
      const clampedPercentage = Math.max(0, Math.min(1, percentage))
      return duration ? clampedPercentage * duration : 0
    },
    [duration]
  )

  function seek(time: number) {
    if (!mediaRef.current || !Number.isFinite(duration)) return

    const media = mediaRef.current

    const clampedTime = clamp(time, 0, duration)

    store.setState({
      progress: clampedTime / duration,
      currentTime: clampedTime,
    })

    media.currentTime = time
  }

  function setHoveringTime(time: number) {
    const { duration } = store.getState()
    if (!Number.isFinite(duration)) return

    // store.setState({
    //   hoveringTime: clamp(time, 0, duration),
    // })
    store.setState({
      hoveringTime: time,
    })
  }

  function setIsHovering(isHovering: boolean) {
    store.setState({ isHovering })
  }

  return {
    seek,
    setHoveringTime,
    setIsHovering,
    getTimeFromEvent,
  }
}
