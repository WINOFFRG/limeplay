"use client"

import React, { useCallback } from "react"
import clamp from "lodash.clamp"
import type { StateCreator } from "zustand"

import { useInterval } from "@/registry/default/hooks/use-interval"
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
  liveLatency: number | null
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
  liveLatency: null,
  isLive: false,
})

export interface useTimelineStatesProps {
  /**
   * Interval in milliseconds to update the states
   * @default 500
   */
  updateDuration?: number
}

export function useTimelineStates({
  updateDuration = 500,
}: useTimelineStatesProps = {}) {
  const store = useGetStore()
  const player = useMediaStore((s) => s.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)

  const onTimeUpdate = () => {
    if (!mediaRef.current || !player) return

    const mediaCurrentTime = mediaRef.current.currentTime
    const isLive = player.isLive()

    let currentTime = mediaCurrentTime
    let liveLatency = null

    if (isLive) {
      const seekRange = player.seekRange()
      currentTime = mediaCurrentTime - seekRange.start
      liveLatency = seekRange.end - mediaCurrentTime
      currentTime = Math.max(0, currentTime)
    } else {
      currentTime = clamp(mediaCurrentTime, 0, store.getState().duration)
    }

    const progress = toFixedNumber(currentTime / store.getState().duration, 4)

    store.setState({
      currentTime: currentTime,
      progress: progress || 0,
      liveLatency,
      isLive,
    })
  }

  const onDurationChange = React.useCallback(() => {
    if (!mediaRef.current || !player) return

    const playerDuration = player.isLive()
      ? player.getSegmentAvailabilityDuration()
      : mediaRef.current.duration

    if (playerDuration && Number.isFinite(playerDuration)) {
      store.setState({ duration: playerDuration })
    }
  }, [store, mediaRef, player])

  const onBuffer = React.useCallback(() => {
    if (!player) return

    const bufferedInfo = player.getBufferedInfo()

    if (player.isBuffering() && bufferedInfo.total.length === 0) {
      return
    }

    store.setState({ buffered: bufferedInfo.total })
  }, [store, player])

  useInterval(onTimeUpdate, updateDuration)

  React.useEffect(() => {
    if (!mediaRef.current || !player) return noop

    const media = mediaRef.current

    if (media.readyState >= 1) {
      onTimeUpdate()
      onDurationChange()
      onBuffer()
    }

    on(media, "durationchange", onDurationChange)
    on(media, "loadedmetadata", onDurationChange)
    on(media, "progress", onBuffer)
    on(player, "trackschanged", onBuffer)

    return () => {
      off(media, "durationchange", onDurationChange)
      off(media, "loadedmetadata", onDurationChange)
      off(media, "progress", onBuffer)
      off(player, "trackschanged", onBuffer)
    }
  }, [mediaRef, player])
}

export function useTimeline() {
  const store = useGetStore()
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const duration = useMediaStore((state) => state.duration)
  const isLive = useMediaStore((state) => state.isLive)
  const player = useMediaStore((state) => state.player)

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

    let actualSeekTime = time
    let storeCurrentTime = time

    if (isLive && player) {
      const seekRange = player.seekRange()
      // For live videos, clamp within the seek range
      actualSeekTime = clamp(time, seekRange.start, seekRange.end)
      // Store the relative time for UI display (0 to duration)
      storeCurrentTime = actualSeekTime - seekRange.start
    } else {
      // For non-live videos, clamp within duration
      actualSeekTime = clamp(time, 0, duration)
      storeCurrentTime = actualSeekTime
    }

    store.setState({
      progress: storeCurrentTime / duration,
      currentTime: storeCurrentTime,
    })

    media.currentTime = actualSeekTime
  }

  function setHoveringTime(time: number) {
    if (!Number.isFinite(store.getState().duration)) return

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
