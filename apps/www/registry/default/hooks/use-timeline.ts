import React, { useCallback } from "react"
import clamp from "lodash.clamp"
import { StateCreator } from "zustand"

import { PlayerRootStore } from "@/registry/default/hooks/use-player-root-store"
import { noop, off, on, toFixedNumber } from "@/registry/default/lib/utils"
import { useGetStore } from "@/registry/default/ui/media-provider"

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

  const { setState, getState } = store
  const player = store((s) => s.player)
  const mediaRef = store((s) => s.mediaRef)

  const onTimeUpdate = () => {
    const { mediaRef } = getState()
    const mediaElement = mediaRef.current
    if (!mediaElement) return

    const { duration, currentTime } = mediaElement
    const progress = toFixedNumber(currentTime / duration, 4)

    setState({ currentTime, progress: progress || 0 })
  }

  const onDurationChange = React.useCallback(() => {
    const { mediaRef } = getState()
    const mediaElement = mediaRef.current
    if (!mediaElement) return

    const { duration } = mediaElement
    if (duration && Number.isFinite(duration)) {
      setState({ duration })
    }
  }, [getState, setState])

  const onBuffer = React.useCallback(() => {
    const { player } = getState()
    if (!player) return

    const bufferedInfo = player.getBufferedInfo()

    if (player.isBuffering() && bufferedInfo.total.length === 0) {
      return
    }

    setState({ buffered: bufferedInfo.total })
  }, [getState, setState])

  React.useEffect(() => {
    const mediaElement = mediaRef?.current

    if (!mediaElement || !player) return noop

    // if (mediaElement.readyState >= 1) {
    //   onDurationChange()
    //   onBuffer()
    // }

    on(mediaElement, "timeupdate", onTimeUpdate)
    on(mediaElement, ["durationchange", "loadedmetadata"], onDurationChange)
    on(mediaElement, "progress", onBuffer)
    on(player, "trackschanged", onBuffer)

    return () => {
      off(mediaElement, "timeupdate", onTimeUpdate)
      off(mediaElement, ["durationchange", "loadedmetadata"], onDurationChange)
      off(mediaElement, "progress", onBuffer)
      off(player, "trackschanged", onBuffer)
    }
  }, [getState, onBuffer, onDurationChange, player])
}

// 4. ACTION HOOK
export function useTimeline() {
  const store = useGetStore()
  const { mediaRef, duration } = store.getState()

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
    const media = mediaRef.current

    if (!media || !Number.isFinite(duration)) return

    const clampedTime = clamp(time, 0, duration)

    store.setState({
      progress: clampedTime / duration,
      currentTime: clampedTime,
    })

    mediaRef.current.currentTime = time
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
