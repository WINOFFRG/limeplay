"use client"

import React, { useCallback } from "react"
import clamp from "lodash.clamp"
import type { StateCreator } from "zustand"

import { useInterval } from "@/registry/default/hooks/use-interval"
import {
  MediaReadyState,
  type PlayerStore,
} from "@/registry/default/hooks/use-player"
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
  TimelineStore & PlayerStore,
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
      progress,
      liveLatency,
      isLive: isLive,
      ...(isLive && {
        duration: player.seekRange().end - player.seekRange().start,
      }),
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

  const seek = useCallback(
    (time: number) => {
      if (!mediaRef.current || !Number.isFinite(duration)) return

      const media = mediaRef.current

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
        progress: storeCurrentTime / duration,
        currentTime: storeCurrentTime,
      })

      media.currentTime = actualSeekTime
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
      variant: "combined" | "from-zero" | "default" = "default"
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
          { start: Infinity, end: 0 }
        )

        if (combinedBuffered.start !== Infinity) {
          normalizedBuffered = [
            {
              start: combinedBuffered.start,
              end: combinedBuffered.end,
            },
          ]
        }
      } else if (variant === "from-zero") {
        normalizedBuffered = bufferedRanges.map((range) => ({
          start: 0,
          end: range.end,
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
    seek,
    setHoveringTime,
    setIsHovering,
    getTimeFromEvent,
    processBufferedRanges,
  }
}
