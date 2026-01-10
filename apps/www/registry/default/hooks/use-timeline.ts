"use client"

import type shaka from "shaka-player"
import type { StateCreator } from "zustand"

import clamp from "lodash.clamp"
import React, { useCallback } from "react"

import { useInterval } from "@/registry/default/hooks/use-interval"
import {
  MediaReadyState,
  type PlaybackStore,
} from "@/registry/default/hooks/use-playback"
import { noop, off, on, toFixedNumber } from "@/registry/default/lib/utils"
import {
  useGetStore,
  useMediaStore,
} from "@/registry/default/ui/media-provider"

export interface TimelineStore {
  buffered: shaka.extern.BufferedRange[]
  currentTime: number
  duration: number
  hoveringTime: number
  isHovering: boolean
  isLive: boolean
  liveLatency: null | number
  onDurationChange?: (payload: { duration: number }) => void

  onSeek?: (payload: { from: number; to: number }) => void
  onTimeUpdate?: (payload: {
    currentTime: number
    duration: number
    progress: number
  }) => void
  progress: number
}

export const createTimelineStore: StateCreator<
  PlaybackStore,
  [],
  [],
  TimelineStore
> = () => ({
  buffered: [],
  currentTime: 0,
  duration: 0,
  hoveringTime: 0,
  isHovering: false,
  isLive: false,
  liveLatency: null,
  // Initialize event callbacks
  onDurationChange: undefined,

  onSeek: undefined,
  onTimeUpdate: undefined,
  progress: 0,
})

export interface UseTimelineReturn {
  getTimeFromEvent: (event: React.PointerEvent) => number
  processBufferedRanges: (
    bufferedRanges: shaka.extern.BufferedRange[],
    variant?: "combined" | "default" | "from-zero"
  ) => Array<{ startPercent: number; widthPercent: number }>
  seek: (time: number) => void
  setHoveringTime: (time: number) => void
  setIsHovering: (isHovering: boolean) => void
}

export interface useTimelineStatesProps {
  /**
   * Interval in milliseconds to update the states
   * @default 500
   */
  updateDuration?: number
}

export function useTimeline(): UseTimelineReturn {
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

  const seek = useCallback(
    (time: number) => {
      if (!mediaRef.current || !Number.isFinite(duration)) return

      const media = mediaRef.current
      const fromTime = media.currentTime

      let actualSeekTime = time
      let storeCurrentTime = time

      if (isLive && player) {
        const seekRange = player.seekRange()
        actualSeekTime = clamp(time, seekRange.start, seekRange.end)
        storeCurrentTime = actualSeekTime - seekRange.start
      } else {
        actualSeekTime = clamp(time, 0, duration)
        storeCurrentTime = actualSeekTime
      }

      store.setState({
        currentTime: storeCurrentTime,
        progress: storeCurrentTime / duration,
      })

      media.currentTime = actualSeekTime

      store.getState().onSeek?.({ from: fromTime, to: actualSeekTime })
    },
    [mediaRef, duration, isLive, player, store]
  )

  const setHoveringTime = useCallback(
    (time: number) => {
      if (!Number.isFinite(store.getState().duration)) return

      store.setState({
        hoveringTime: time,
      })
    },
    [store]
  )

  function setIsHovering(isHovering: boolean) {
    store.setState({ isHovering })
  }

  const processBufferedRanges = useCallback(
    (
      bufferedRanges: shaka.extern.BufferedRange[],
      variant: "combined" | "default" | "from-zero" = "default"
    ): Array<{ startPercent: number; widthPercent: number }> => {
      if (!bufferedRanges.length || !duration) {
        return []
      }

      let normalizedBuffered: shaka.extern.BufferedRange[] = []

      if (variant === "combined") {
        const combinedBuffered = bufferedRanges.reduce(
          (acc, range) => {
            acc.start = Math.min(acc.start, range.start)
            acc.end = Math.max(acc.end, range.end)
            return acc
          },
          { end: 0, start: Infinity }
        )

        if (combinedBuffered.start !== Infinity) {
          normalizedBuffered = [
            {
              end: combinedBuffered.end,
              start: combinedBuffered.start,
            },
          ]
        }
      } else if (variant === "from-zero") {
        normalizedBuffered = bufferedRanges.map((range) => ({
          end: range.end,
          start: 0,
        }))
      } else {
        normalizedBuffered = bufferedRanges
      }

      if (!normalizedBuffered.length) {
        return []
      }

      return normalizedBuffered.map((range) => {
        let startPercent: number
        let widthPercent: number

        if (isLive && player) {
          const seekRange = player.seekRange()
          const relativeStart = Math.max(0, range.start - seekRange.start)
          const relativeEnd = Math.max(0, range.end - seekRange.start)

          startPercent = (relativeStart / duration) * 100
          widthPercent = ((relativeEnd - relativeStart) / duration) * 100
        } else {
          startPercent = (range.start / duration) * 100
          widthPercent = ((range.end - range.start) / duration) * 100
        }

        return { startPercent, widthPercent }
      })
    },
    [duration, isLive, player]
  )

  return {
    getTimeFromEvent,
    processBufferedRanges,
    seek,
    setHoveringTime,
    setIsHovering,
  }
}

export function useTimelineStates({
  updateDuration = 500,
}: useTimelineStatesProps = {}) {
  const store = useGetStore()
  const player = useMediaStore((s) => s.player)
  const mediaRef = useMediaStore((state) => state.mediaRef)
  const canPlay = useMediaStore((state) => state.canPlay)
  const readyState = useMediaStore((state) => state.readyState)

  const isLive = player?.isLive() ?? false

  const onTimeUpdate = () => {
    if (!mediaRef.current || !player) return

    if (readyState < MediaReadyState.HAVE_METADATA) return

    let currentTime = mediaRef.current.currentTime
    let liveLatency = isLive ? 0 : null
    let progress = 0

    if (isLive) {
      const seekRange = player.seekRange()
      liveLatency =
        mediaRef.current.currentTime === 0
          ? 0
          : seekRange.end - mediaRef.current.currentTime

      liveLatency = toFixedNumber(clamp(liveLatency, 0, seekRange.end), 4)

      progress =
        1 -
        (seekRange.end - mediaRef.current.currentTime) /
          (seekRange.end - seekRange.start)

      progress = toFixedNumber(clamp(progress, 0, 1), 4)
    } else {
      currentTime = clamp(
        mediaRef.current.currentTime,
        0,
        store.getState().duration
      )
      progress = toFixedNumber(currentTime / store.getState().duration, 4)
    }

    store.setState({
      currentTime,
      isLive: isLive,
      liveLatency,
      progress,
      ...(isLive && {
        duration: player.seekRange().end - player.seekRange().start,
      }),
    })

    store.getState().onTimeUpdate?.({
      currentTime,
      duration: store.getState().duration,
      progress,
    })
  }

  const onDurationChange = React.useCallback(() => {
    if (!mediaRef.current || !player) return

    const seekRange = player.seekRange()
    const playerDuration = player.isLive()
      ? seekRange.end - seekRange.start
      : mediaRef.current.duration

    if (playerDuration && Number.isFinite(playerDuration)) {
      store.setState({ duration: playerDuration })

      store.getState().onDurationChange?.({ duration: playerDuration })
    }
  }, [store, mediaRef, player])

  const onBuffer = React.useCallback(() => {
    if (!player) return

    const bufferedInfo = player.getBufferedInfo()

    if (player.isBuffering()) {
      return
    }

    store.setState({ buffered: bufferedInfo.total })
  }, [store, player])

  useInterval(onTimeUpdate, updateDuration)

  React.useEffect(() => {
    if (!mediaRef.current || !player) return noop

    const media = mediaRef.current

    if (canPlay) {
      onTimeUpdate()
      onDurationChange()
      onBuffer()
    }

    on(media, ["durationchange", "loading"], onDurationChange)
    on(media, "progress", onBuffer)
    on(player, ["trackschanged", "loading"], onBuffer)

    return () => {
      off(media, ["durationchange", "loading"], onDurationChange)
      off(media, "progress", onBuffer)
      off(player, ["trackschanged", "loading"], onBuffer)
    }
  }, [mediaRef, player, canPlay])
}
